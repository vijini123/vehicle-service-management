import Employee from '../models/Employee.js'
import { VerifyUser } from '../Utils/VerifyToken.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import HttpType from '../Utils/ResponseHandler/HttpType.js'
import ResTypes from '../Utils/ResponseHandler/ResTypes.js'
export const createEmployee = async (req, res) => {
  const newEmployee  = new Employee (req.body);
  try {
    const savedEmployee  = await newEmployee .save();
    res.status(201).json({
      success: true,
      message: "Successfully created",
      data: savedEmployee ,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Update a Employee
export const updateEmployee = async (req, res) => {
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(updatedEmployee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a Employee
export const deleteEmployee = async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
    if (!deletedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Read a single Employee
export const getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Read all Employees
export const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//check email
export const checkEmailExists = async (req, res) => {
  try {
    const { email } = req.params;
    const employee = await Employee.findOne({ email });
    res.json({ exists: !!employee });
  } catch (error) {
    res.status(500).json({ message: "Error checking email", error: error.message });
  }
};

//check nic
export const checkNicExists = async (req, res) => {
  try {
    const { nic } = req.params;
    const employee = await Employee.findOne({ nic });
    res.json({ exists: !!employee });
  } catch (error) {
    res.status(500).json({ message: "Error checking NIC", error: error.message });
  }
};

export const loginEmployee = async (req, res) => {
  try {
      const { email, nic } = req.body;
      
      const employee = await Employee.findOne({ email, nic });
      if (!employee) {
          return res.status(HttpType.NOT_FOUND.code).json({
              success: false,
              message: ResTypes.errors.no_user.message
          });
      }

      const token = jwt.sign({ id: employee._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

      res.status(HttpType.OK.code).json({
          success: true,
          message: ResTypes.successMessages.login_successful.message,
          employee: {
              email: employee.email,
              nic: employee.nic
          },
          token
      });
  } catch (error) {
      console.error(error);
      res.status(HttpType.INTERNAL_SERVER_ERROR.code).json({
          success: false,
          message: ResTypes.errors.server_error.message
      });
  }
};
