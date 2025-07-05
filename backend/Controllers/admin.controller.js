import { z } from "zod";
import { Admin } from "../Models/admin.model.js";
import jwt from "jsonwebtoken";
import config from "../config.js";
import bcrypt from "bcryptjs";

export const Signup = async(req, res) => {
    const {firstName, lastName, email, password} = req.body;

    const adminSchema = z.object({
        firstName: z.string().min(2,{message: "firstName must be atleast 2 to 20 characters"}),
        lastName: z.string().min(2,{message: "lastName must be atleast 2 to 20 characters"}),
        email: z.string().email(),
        password: z.string().min(6, {message: "password must be atleast 6 characters long"})
    })

    const validateData = adminSchema.safeParse(req.body); 
    if(!validateData.success){
        return res.status(400).json({message:validateData.error.issues.map((err) => err.message)});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const existingAdmin = await Admin.findOne({email: email});
        if(existingAdmin){
            return res.status(400).json({message: "Admin Already Exists"});
        }

        const newAdmin = new Admin({firstName, lastName, email, password: hashedPassword});
        await newAdmin.save()
        return res.status(201).json({message: "Admin Created Successfully", newAdmin});    
    } catch (error) {
        console.log(error)
        return res.status(400).json({message: "Error in Signing Up"})
    }
}

export const login = async(req,res) =>{
    const {email, password} = req.body;
    try {
        const admin =await Admin.findOne({email: email});
        const isPasswordCorrect =await bcrypt.compare(password, admin.password);
        
        if(!admin || !isPasswordCorrect){
            return res.status(403).json({message: "Invalid Credentials"})
        }

        const token = jwt.sign({
            id: admin._id
        }, config.JWT_ADMIN_PASSWORD)
        
        res.cookie("jwt", token)
        return res.status(200).json({message: "Login Successful", admin, token});

    } catch (error) {
        console.log(error);
        return res.status(400).json({message: "Error in Logging In", error});
    }
}

export const logout = async(req,res) => {
    try {
        res.clearCookie("jwt");
        return res.status(200).json({message: "Logged Out Successfully"});
    } catch (error) {
        console.log(error);
        return res.status(400).json({message: "Error in Logging Out", error});
    }
}