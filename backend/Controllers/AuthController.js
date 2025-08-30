import User from "../models/User.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import GenerateToken from '../Token/generateToken.js'

export const register = async (req,res) => {
    try {
        console.log('Received registration request:', req.body);
        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User with this email or username already exists"
            });
        }

        // Hash password
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        
        const newUser = new User({
            username,
            email,
            password: hash,
        });

        await newUser.save();

        res.status(200).json({
            success: true,
            message: "Successfully registered"
        });
    } catch (err) {
        console.error('Detailed registration error:', err);
        res.status(500).json({
            success: false,
            message: "Failed to register. Please try again."
        });
    }
};

// user login
export const login = async (req,res) => {

    const email = req.body.email

    try {
        const user = await User.findOne({email})

        //invalid user
        if(!user){
            return res.status(404).json({success: false, message:"User not found"})
        }

        //check the password
        const checkCorrectPassword = await bcrypt.compare(
            req.body.password,
            user.password
        )

        //if password is incorrect
        if (!checkCorrectPassword){
            return res
                .status(401)
                .json({
                    success: false,
                    message: "Incorrect email or password"
                })
        }

        const { password, role, ...rest } = user._doc
        //create json web token
        const token = jwt.sign(
            {id: user._id, role: user.role},
            process.env.JWT_SECRET_KEY,
            { expiresIn: "10s" }
        )

        const expirationTime = new Date(Date.now() + 10 * 1000); // 10 seconds from now

        //set token in the browser cookies and send the response to the client
        res
            .cookie("accessToken", token, {
                httpOnly: true,
                expires: expirationTime,
            })
            .status(200)
            .json({
                token,
                data: {...rest},
                role,
                expiresAt: expirationTime.getTime(), // Send expiration timestamp to client
            })
    } catch (err) {
        console.error("Error during login:", err);
        return res
        .status(500)
        .json({
            success: false,
            message: "Failed to login"
        })
    }
}
// Update user
export const updateUser = async (req, res) => {
    const userId = req.params.id;
    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: req.body },
            { new: true }
        ).select('-password');

        res.status(200).json({
            success: true,
            message: "Successfully updated",
            data: updatedUser,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to update. Try again",
        });
    }
};


// Delete user
export const deleteUser = async (req, res) => {
    const userId = req.params.id;
    try {
        await User.findByIdAndDelete(userId);

        res.status(200).json({
            success: true,
            message: "Successfully deleted",
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to delete. Try again",
        });
    }
};

//getAll User
export const getAllUser = async (req, res) => {

    try {
        const users = await User
            .find({})
        res
            .status(200)
            .json({
                success: true,
                message: "Successful",
                data: users,
            });
    } catch (err) {
        res
           .status(404)
           .json({
                success: false,
                message: "Not found",
           });
    }
};
