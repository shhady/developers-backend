import mongoose from "mongoose";


const LiveCodingSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    date:{
        type: Date,
        required:true,
    },
    time:{
        type: String,
        required:true,
    },
    description:{
        type: String,
        required:true,
    },
    projectName:{
        type: String,
        required:true,
    },
    tags:{
        type: String,
        required:true,
    },
    active:{
        type: Boolean,
        required:true,
    },
    roomId:{
         type: String,
    },
    github:{
        type: String,
    }
}, {
    timestamps: true
})

const LiveCoding = mongoose.model('LiveCoding', LiveCodingSchema )
export default LiveCoding;