# CSV to JSON Converter API

API that converts CSV files to JSON and stores data in PostgreSQL with age distribution reporting. Built with Express.js, TypeScript, and PostgreSQL (Supabase).

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL database (already configured with Supabase)

## Quick Start

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/NiranjanKumarYadav36/niranjan-csv-to-json-api.git
cd csv-to-json-api

# Install dependencies
npm install
```
### 2. Environment Variables

```bash
- due to setup issues of pgAdmin I used Supabse 
- No need to create a new .env file; the included file  is ready to use.
```
### 3. Run the API
```bash
# Start the development server
npm run dev
```
### 4. API enpoint Test (in Postman)
```bash
# 1. Root endpoint
    http://localhost:5000

# 2. Get all Users details
    http://localhost:5000/api/users

# 3. Process Csv file
    http://localhost:5000/api/process-csv
```

