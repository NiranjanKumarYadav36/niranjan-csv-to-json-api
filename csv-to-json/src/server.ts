import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { config } from "dotenv";
import bodyParser, { json } from "body-parser";
import csvRoutes from "./routes/csv.routes";
import { connectDB, queryDB } from "./config/db";

config();

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());

app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error("Global Error:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
});


app.use("/api", csvRoutes)

app.get("/", (request: Request, response: Response) => {
    response.send("CSV to JSON!");
});

process.on("uncaughtException", (err: Error) => {
    console.error("UNCAUGHT EXCEPTION! Shutting down...");
    console.error(err.name, err.message);
    process.exit(1);
});

process.on("unhandledRejection", (err: Error) => {
    console.error("Unhandled Rejection! Shutting down...");
    console.error(err.name, err.message);
    process.exit(1);
});

// Start the server and listen on the specified port
app.listen(port, async () => {
    try {
        await connectDB();
    } catch (error) {
        console.error("Failed to connect to the database:", (error as Error).message);
    }
    console.log(`Server is running on http://localhost:${port}`);
});