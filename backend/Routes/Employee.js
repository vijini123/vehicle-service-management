import express from "express";
import { VerifyAdmin, VerifyUser } from "../Utils/VerifyToken.js";
import {createEmployee, getAllEmployees, getEmployee, deleteEmployee, updateEmployee, checkEmailExists,checkNicExists, loginEmployee} from "../Controllers/EmployeeControlle.js";

const router = express.Router()

router.post('/', createEmployee,)
router.post('/:id', updateEmployee)
router.delete('/:id', deleteEmployee)
router.get('/:id', getEmployee)
router.get('/', getAllEmployees)
router.get('/checkEmail/:email', checkEmailExists);
router.get('/checkNic/:nic', checkNicExists);
router.post('/login', loginEmployee);




export default router