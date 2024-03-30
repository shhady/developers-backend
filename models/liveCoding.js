import mongoose from "mongoose";


const LiveCodingSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    date:{
        type: String,
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
    language:{
        type: String,
        required:true,
    },
    active:{
        type: Boolean,
        required:true,
    },
    roomId:{
        type: String,
    }
}, {
    timestamps: true
})

const LiveCoding = mongoose.model('LiveCoding', LiveCodingSchema )
export default LiveCoding;