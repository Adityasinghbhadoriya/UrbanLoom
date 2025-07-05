import { Cloth } from "../Models/cloth.model.js";
import { v2 as cloudinary } from 'cloudinary';
import { Purchase } from "../Models/purchase.model.js";

export const createCloth = async (req, res) => {
    const adminId = req.adminId;
    const { title, description, price, category } = req.body;

    try {

        if (!title || !description || !price || !category) {
            return res.status(400).json({ message: "All Fields are required!!" });
        }

        const { image } = req.files;
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ message: "Image is Required" })
        }

        const allowedFormat = ["image/png", "image/jpeg"]
        if (!allowedFormat.includes(image.mimetype)) {
            return res.status(400).json({ message: "Invalid File Format" });
        }

        const cloud_response = await cloudinary.uploader.upload(image.tempFilePath);
        if (!cloud_response || cloud_response.error) {
            return res.status(400).json({
                error: "Error uploading file to cloudinary"

            });
        }

        const clothData = {
            title,
            description,
            price,
            image: {
                public_id: cloud_response.public_id,
                url: cloud_response.secure_url
            },
            category,
            creatorId: adminId  
        }

        const cloth = await Cloth.create(clothData);
        return res.status(201).json({ message: "Item Created Successfully", cloth });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Error in Creating Data" });
    }
}

export const updateCloth = async (req, res) => {
    const adminId = req.adminId
    const { clothId } = req.params;
    const { title, description, price, image, category } = req.body;

    try {
        const clothSearch = await Cloth.findById(clothId);
        if (!clothSearch) {
            return res.status(404).json({
                message:
                    "Item not found"
            })
        }

        const cloth = await Cloth.findOneAndUpdate({
            _id: clothId,
            creatorId: adminId,
        }, {
            title,
            description,
            price,
            image: {
                public_id: image?.public_id,
                url: image?.url
            },
            category
        })

        if(!cloth){
            return res.status(404).json({message: "Can't Update, Created By another Admin"});
        }

        return res.status(201).json({
            message: "Item Updated Successfully",
            cloth
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Error in Updating the Data" })
    }

}

export const getCloths = async (req, res) => {
    try {
        const cloths = await Cloth.find({});
        return res.status(200).json({ message: "Items Fetched Successfully", cloths });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ messaage: "Error in Fetching all Items" });
    }
}

export const deleteCloth = async (req, res) => {
    const adminId = req.adminId;
    const { clothId } = req.params;

    try {
        const cloth = await Cloth.findOneAndDelete({
            _id: clothId,
            creatorId: adminId,
        })
        if(!cloth){
            return res.status(404).json({message: "Can't Delete, Created by another admin "})
        }
        return res.status(200).json({ message: "Item Deleted Successfully" });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Error in Deleting Cloth" });
    }
}

export const getOneCloth = async (req, res) => {
    const { clothId } = req.params;
    try {
        const cloth = await Cloth.findById(clothId)
            if (!cloth) {
            return res.status(404).json({ message: "Item not found" });
        }
        return res.status(200).json({ message: "Item fetched successfully", cloth });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Error in Fetching the cloth" });
    }
}

import Stripe from "stripe";
import config from "../config.js";
const stripe = new Stripe(config.STRIPE_SECRET_KEY)
console.log(config.STRIPE_SECRET_KEY)

export const buyCloth = async (req, res) => {
    const { userId } = req;
    const { clothId } = req.params;

    try {
        const cloth = await Cloth.findById(clothId)
        if (!cloth) {
            return res.status(404).json({ message: "Item not Found" });
        }

        const existingPurchase = await Purchase.findOne({ userId, clothId });
        if (existingPurchase) {
            return res.status(400).json({ message: "You Have Already Puchased this Item" });
        }

        //Stripe Payment Gateway
        const amount = cloth.price;
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: "usd",
            payment_method_types:["card"]
        });

        return res.status(200).json({ message: "Item Purchased Successfully", cloth, clientSecret: paymentIntent.client_secret, });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Error in buying Item", error });
    }
}

