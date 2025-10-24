# CSV to JSON Converter API

A Node.js TypeScript API that converts CSV files to JSON and stores data in PostgreSQL with age distribution reporting. Built with Express.js, TypeScript, and PostgreSQL (Supabase).

## 🚀 Features

- **Custom CSV parser** without external libraries
- **Handles nested properties** with dot notation (e.g., `address.line1`, `user.profile.details.age`)
- **PostgreSQL integration** with JSONB columns using Supabase
- **Age distribution calculation** and console reporting
- **TypeScript** for type safety and better development experience
- **Environment-based configuration**
- **RESTful API endpoints**
- **Production-ready code** with proper error handling

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL database (already configured with Supabase)

## 🛠 Quick Start

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/yourusername/csv-to-json-api.git
cd csv-to-json-api

# Install dependencies
npm install