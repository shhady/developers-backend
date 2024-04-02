import mongoose from "mongoose";


const projectSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    name: { 
        type:String,
        required:[true, 'is required'],
    },
    description:{
        type:String,
        required:[true, 'is required'],
    },
    image:{
        type:String,
        required:true,
    },
    projectType:{
        type:String,
        required:true,
    },
    githubLink:{
        type:String,
        required:[true, 'is required'],
    },
    url:{
        type:String,
        // required:[true, 'is required'],
    },
    likes:{
        type:[Object]
    },
    comments:{
        type:[Object]
    },
    media:{
        type:Array
    },
    tags:{
        type:Array
    }
}, {
    timestamps: true
})

const Project = mongoose.model('Project', projectSchema )
export default Project;