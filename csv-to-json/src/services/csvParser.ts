import { CSVRecord } from "../types";
import path from "path";
import fs from "fs"

export class CSVParser {
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;  // csv file path
  }

  async parse(): Promise<CSVRecord[]> {
    return new Promise((resolve, reject) => {
      try {
        // 1. Check if file exists
        const absolutePath = path.resolve(this.filePath);
        if (!fs.existsSync(absolutePath)) {
          throw new Error(`CSV file not found at: ${absolutePath}`);
        }

        // 2. Read and split file content by lines
        const fileContent = fs.readFileSync(absolutePath, 'utf8');
        const lines = fileContent.trim().split('\n');
        
        // 3. minimum lines
        if (lines.length < 2) {
          throw new Error('CSV file must have at least a header and one data row');
        }

        // 4. Parse header row
        const headers = this.parseLine(lines[0]);
        const records: CSVRecord[] = [];

        for (let i = 1; i < lines.length; i++) {
          if (lines[i].trim() === '') continue;
          
          const values = this.parseLine(lines[i]);  // Parse current line
          const record = this.createObject(headers, values);
          records.push(record as CSVRecord);
        }

        resolve(records);
      } catch (error) {
        reject(error);
      }
    });
  }

  private parseLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    let quoteChar = '';

    // Process each character in the line
    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if ((char === '"' || char === "'") && !inQuotes) {
        inQuotes = true;
        quoteChar = char;
      } 
      // Handle closing quotes  
      else if (char === quoteChar && inQuotes) {
        inQuotes = false;
        quoteChar = '';
      } 
      // Handle comma separator (only outside quotes)
      else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } 
      // Regular character
      else {
        current += char;
      }
    }

    result.push(current.trim());  // Add the last field
    return result;
  }

  private createObject(headers: string[], values: string[]): object {
    const obj: any = {};

    // Map each header to its corresponding value
    for (let i = 0; i < headers.length; i++) {
      if (i >= values.length) break;  // Skip if no value for this header

      const header = headers[i].trim();
      const value = values[i].trim();

      this.setNestedProperty(obj, header, value);  // Handle dot notation
    }

    return obj;
  }

  private setNestedProperty(obj: any, path: string, value: string): void {
    // Split path by dots to handle nested properties
    const keys = path.split('.').map(key => key.trim());
    let current = obj;

    // Navigate/create the nested structure
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!current[key]) {
        current[key] = {};  // Create nested object if it doesn't exist
      }
      current = current[key];
    }

    const lastKey = keys[keys.length - 1];
    
    // Special handling for age field - convert to number
    if (lastKey === 'age' && !isNaN(Number(value)) && value !== '') {
      current[lastKey] = Number(value);
    } else {
      current[lastKey] = value;  // Store as string for other fields
    }
  }
}