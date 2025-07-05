import mongoose from "mongoose";

const clothSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
    },

    description: {
        type: String,
        require: true,
    },

    price: {
        type: Number,
        require: true,
    },

    image: {
        public_id: {
            type: String,
            require: true,
        },
        url: {
            type: String,
            require: true,
        }
    },

    category: {
        type: String,
        require: true,
    },

    creatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }

})

export const Cloth = mongoose.model("Cloth", clothSchema);