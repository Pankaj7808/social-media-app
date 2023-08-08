import UserModel from "../Models/userModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

//Resgitering a new User
export const registerUser = async (req,res)=>{
    const {username, password, firstname, lastname} = req.body
    const salt = await bcrypt.genSalt(10)
    const hashedPass = await bcrypt.hash(password,salt)

    const newUser = new UserModel({username, password:hashedPass, firstname, lastname})
    try{
        const oldUser = await UserModel.findOne({username})
        if(oldUser){
            return res.status(404).json("User Alreasdy registered!")
        }

        const user = await newUser.save()
        const token = jwt.sign({
            username:user.username, id : user._id
        }, process.env.JWT_KEY, {expiresIn:"1m"})

        res.status(200).json({newUser,token})
    }catch(err){
        res.status(500).json({message:err.message})
    }
}

// Login a User
export const loginUser = async (req,res)=>{
    const {username, password}=req.body
    try{
        const user = await UserModel.findOne({username:username})
        if(user){
            const validity = await bcrypt.compare(password,user.password)
            // validity? res.status(200).json(user):res.status(400).json("Wrong Password");
            if(!validity){
                res.status(400).json("Wrong Password")
            }else{
                const token = jwt.sign({
                    username:user.username, id : user._id
                }, process.env.JWT_KEY, {expiresIn:"1m"})
                res.status(200).json({user,token})
            }
        }else{
            res.status(404).json("User does not exist")
        }
    }catch(err){
        res.status(500).json({message:err.message})
    }
}