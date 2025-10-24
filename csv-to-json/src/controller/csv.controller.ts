import { Request, Response } from "express";
import { CSVParser } from "../services/csvParser";
import { User, ProcessCSVResponse, APIResponse, UserResponse } from "../types";
import { UserService } from "../services/userService";
import { AgeDistributionService } from "../services/ageDistribution";

const userService = new UserService();
const ageDistributionService = new AgeDistributionService();

export const processCSV = async (req: Request, res: Response): Promise<void> => {
  try {
    const filePath = process.env.CSV_FILE_PATH;

    if (!filePath) {
      res.status(400).json({
        success: false,
        error: "CSV file path not configured",
      });
      return;
    }

    // 1. Parse CSV file
    const parser = new CSVParser(filePath);
    const records = await parser.parse();
    console.log(`Parsed ${records.length} records from CSV`);

    // 2. Transform data for database
    const users: User[] = records.map((record) => {

      const firstName = record.name?.firstName || '';
      const lastName = record.name?.lastName || '';
      const age = record.age;

      const fullName = `${firstName} ${lastName}`.trim();

      const address: any = {};

      if (record.address) {
        for (const [key, value] of Object.entries(record.address)) {
          if (value) address[key] = value;
        }
      }

      const additionalInfo: any = { ...record };

      delete additionalInfo.name;
      delete additionalInfo.age;
      delete additionalInfo.address;

      Object.keys(additionalInfo).forEach(key => {
        if (additionalInfo[key] === null || additionalInfo[key] === undefined || additionalInfo[key] === '') {
          delete additionalInfo[key];
        }
      });

      return {
        name: fullName,
        age,
        address: address || null,
        additional_info: Object.keys(additionalInfo).length > 0 ? additionalInfo : null,
      };
    });

    // 3. Database operations
    await userService.createTable();
    await userService.insertUsers(users);


    // 4. Calculate age distribution
    const allUsers = await userService.getAllUsers();
    const distribution = ageDistributionService.calculateDistribution(allUsers);
    ageDistributionService.printReport(distribution);

    // 5. Send API response
    const response: ProcessCSVResponse = {
      success: true,
      message: `Successfully processed ${users.length} records`,
      recordsProcessed: users.length,
      ageDistribution: distribution,
    };

    res.json(response);
  } catch (error: any) {
    console.error("Error processing CSV:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await userService.getAllUsers();

    const trasformedUsers: UserResponse[] = users.map((user) => {
      const address = user.address ? JSON.parse(JSON.stringify(user.address)) : undefined;
      const additional_info = user.additional_info ? JSON.parse(JSON.stringify(user.additional_info)) : {};

      const nameParts = user.name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const response: UserResponse = {
        id: user.id,
        name: {
          firstName: firstName,
          lastName: lastName
        },
        age: user.age
      };

      // Add address if it exists
      if (address && Object.keys(address).length > 0) {
        response.address = address;
      }

      // Add all additional fields
      Object.keys(additional_info).forEach(key => {
        response[key] = additional_info[key];
      });

      return response;
    });

    const response: APIResponse<UserResponse[]> = {
      success: true,
      data: trasformedUsers,
      count: trasformedUsers.length
    };

    res.json(response);
  } catch (error: any) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};