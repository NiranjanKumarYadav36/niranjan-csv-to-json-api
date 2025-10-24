import express from 'express';
import { processCSV, getUsers } from '../controller/csv.controller'

const router = express.Router();

// api endpoints
router.post('/process-csv', processCSV);
router.get('/users', getUsers);          

export default router;