import { z } from "zod";
import { User } from "../Models/user.model.js";
import bcrypt from "bcryptjs";
import  jwt from "jsonwebtoken";
import  config  from "../config.js";
import { Purchase } from "../Models/purchase.model.js";
import { Cloth } from "../Models/cloth.model.js";


export const Signup = async(req, res) => {
    const {firstName, lastName, email, password} = req.body;

    const userSchema = z.object({
        firstName: z.string().min(2,{message: "firstName must be atleast 2 to 20 characters"}),
        lastName: z.string().min(2,{message: "lastName must be atleast 2 to 20 characters"}),
        email: z.string().email(),
        password: z.string().min(6, {message: "password must be atleast 6 characters long"})
    })

    const validateData = userSchema.safeParse(req.body); 
    if(!validateData.success){
        return res.status(400).json({message:validateData.error.issues.map((err) => err.message)});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const existingUser = await User.findOne({email: email});
        if(existingUser){
            return res.status(400).json({message: "User Already Exists"});
        }

        const newUser = new User({firstName, lastName, email, password: hashedPassword});
        await newUser.save()
        return res.status(201).json({message: "User Created Successfully", newUser});    
    } catch (error) {
        console.log(error)
        return res.status(400).json({message: "Error in Signing Up"})
    }
}

export const login = async(req,res) =>{
    const {email, password} = req.body;
    try {
        const user =await User.findOne({email: email});
        const isPasswordCorrect =await bcrypt.compare(password, user.password);
        
        if(!user || !isPasswordCorrect){
            return res.status(403).json({message: "Invalid Credentials"})
        }

        const token = jwt.sign({
            id: user._id
        }, config.JWT_USER_PASSWORD)
        
        res.cookie("jwt", token)
        return res.status(200).json({message: "Login Successful", user, token});

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

export const purchases = async(req, res) => {
    const userId  = req.userId;
    try {
        const purchased = await Purchase.find({userId});
        
        let purchasedClothId = [];

        for(let i=0; i<purchased.length; i++){
            purchasedClothId.push(purchased[i].clothId)
        }

         const clothData = await Cloth.find({
            _id:{$in:purchasedClothId}
        })

        return res.status(200).json({purchased, clothData});
    } catch (error) {
        console.log(error);
        return res.status(400).json({message: "Error in Fetching all Cloths"});
    }
}