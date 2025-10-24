import { queryDB } from "../config/db";
import { User } from "../types";

export class UserService {
    async createTable(): Promise<void> {
    const query = `
      CREATE TABLE IF NOT EXISTS public.users (
        id SERIAL PRIMARY KEY,
        name VARCHAR NOT NULL,
        age INTEGER NOT NULL,
        address JSONB NULL,
        additional_info JSONB NULL
      );
    `;
    
    await queryDB(query, []);
    console.log('Users table created or already exists');
  }

    async insertUsers(users: User[]): Promise<void> {
        const query = `
            INSERT INTO users (name, age, address, additional_info)
            VALUES ($1, $2, $3, $4)
    `;

        try {
            for (let i = 0; i < users.length; i++) {
                const user = users[i];
                await queryDB(query, [user.name, user.age, user.address, user.additional_info]);
            }
            console.log(`successfully inserted ${users.length} users in the databse`);
        } catch (error) {
            throw error;
        }
    }

    async getAllUsers(): Promise<User[]> {
        const result = await queryDB('SELECT * FROM users ORDER BY id');
        return result
    }
};