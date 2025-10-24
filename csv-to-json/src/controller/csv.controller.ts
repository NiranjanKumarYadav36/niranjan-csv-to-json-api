import { Request, Response } from "express";
import { queryDB } from "../config/db";
import { CSVParser } from "../services/csvParser";
import { User, ProcessCSVResponse, APIResponse } from "../types";
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

      const addressFields = ['line1', 'line2', 'city', 'state'];
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

    const response: APIResponse<User[]> = {
      success: true,
      data: users,
      count: users.length,
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