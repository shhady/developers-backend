import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    role:{
        type:String,
        required:true,
        default:"user",
    },
    userName: {
        type:String,
        required:true,
        minlength: [2, 'too short'],
        maxlength:50
    },
    education:{
        type:String,
        required:true,
    },
    address:{
        type:String,
        required:true,
    }, 
    email: {
        type:String,
        required:true,
        unique:[true, "User already exists"],
        lowerCase:true,
        validate: {
            validator: function(value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(value);
            },
            message: "invalid email address"
        }
    },
    avatar:{
        type:String,
        required:true,
    },
    password: {
        type: String,
        required: true,
        minlength:[4, "password must be at least 8 characters"]
    },
    confirmPassword: {
        type: String,
        required: true,
        minlength:[4, "password must be at least 8 characters"]
    }
}, {
    timestamps: true
})

const User = mongoose.model('User', userSchema )
export default User;