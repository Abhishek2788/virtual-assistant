import genToken from "../config/token.js"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
 

export const signUp = async (req,res)=>{
    try {
        const {name,email,password} = req.body

        const emailExists = await User.findOne({email})
        if(emailExists){
            return res.status(400).json({message: "Email ALready Exists!!"});
        }
        if(password.length<=6){
            return res.status(400).json({message: "Length should be greater than six!!"});
        }
        const hashedPassword = await bcrypt.hash(password,10);

        const user  = await User.create({
            name, email, password: hashedPassword
        })

        const token = await genToken(user._id)
        res.cookie("token",token,{
            httpOnly: true,
            maxAge: 7*24*60*60*1000,
            sameSite: "none",
            secure: true
        })
        return res.status(201).json(user)

    } catch (error) {
        return res.status(500).json({message: `sign up error ${error}`})
    }
}



// Login

export const Login = async (req,res)=>{
    try {
        const {email,password} = req.body

        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message: "Email Doesn't Exists!!"});
        }
        
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message: "Incorrect Passowrd!!"})
        }


        const token = await genToken(user._id)
        res.cookie("token",token,{
            httpOnly: true,
            maxAge: 7*24*60*60*1000,
            sameSite: "none",
            secure: true
        })
        return res.status(200).json(user)

    } catch (error) {
        return res.status(500).json({message: `Login  error ${error}`})
    }
}



// Logout

export const Logout = async (req,res)=>{
    try {
        res.clearCookie("token")
        return res.status(200).json({message: "Log Out Successfully!!"})
    } catch (error) {
        return res.status(500).json({message: `Logout error ${error}`})
    }
}