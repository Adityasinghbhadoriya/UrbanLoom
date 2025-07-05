import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    clothId:{
        type: mongoose.Types.ObjectId,
        ref: "Course"
    }


})

export const Purchase = mongoose.model("Purchase", purchaseSchema);