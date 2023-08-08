import UserModel from "../Models/userModel.js";
import bcrypt from 'bcrypt';

// READ USER
export const getUser = async (req,res)=>{
    const id = req.params.id
    try{
        const user = await UserModel.findById(id)
        console.log("USER ")
        if(!user){
            res.status(404).json("User Not Found")
        }
        else{
            const {password, ...otherDetails} = user._doc
            res.status(200).json(otherDetails)
        }
    }catch(err){
        res.status(500).json(err)
    }
} 

// Update User

export const updateUser = async (req, res)=>{
    const id=req.params.id
    const {currentUserId, currentUserAdminStatus,password }=req.body
    if(currentUserId===id || currentUserAdminStatus){
        try{
            if(password){
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(password,salt);
            }
            const user = await UserModel.findByIdAndUpdate(id, req.body, {new:true})
            res.status(200).json(user)
        }catch(err){
            res.status(500).json(err)
        }
    }
    else{
        res.status(403).json("Access Denied! You can update your profile only.")
    }
}

// DELETE USER
export const deleteUser = async (req,res)=>{
    const id = req.params.id
    const {currentUserId,currentUserAdminStatus} = req.body
    if(currentUserId===id || currentUserAdminStatus){
        try{
            await UserModel.findByIdAndDelete(id)
            res.status(200).json("User Delete Successfully")
        }
        catch(err){
            res.status(500).json(err)
        }
    }else{
        res.status(403).json("Access Denied! YOu can delete only your profile only")
    }
}

// Follow User
export const followUser = async (req,res)=>{
    const id=req.params.id
    const {currentUserId} = req.body
    if(currentUserId===id){
        res.status(403).json("Actiaon forbidden")
    }else{
        try{
            const followUser = await UserModel.findById(id)
            const followingUser = await UserModel.findById(currentUserId)

            if(!followUser.followers.includes(currentUserId)){
                await followUser.updateOne({$push : {followers:currentUserId}})
                await followingUser.updateOne({$push:{followings:id}})
                res.status(200).json("User followed!")
            }else{
                res.status(403).json("User is Already followed by You")
            }
        }catch(err){
            res.status(500).json(err)
        }
    }
}

// Unfollow User
export const unfollowUser = async (req,res)=>{
    const id=req.params.id
    const {currentUserId} = req.body
    if(currentUserId===id){
        res.status(403).json("Actiaon forbidden")
    }else{
        try{
            const followUser = await UserModel.findById(id)
            const followingUser = await UserModel.findById(currentUserId)

            if(followUser.followers.includes(currentUserId)){
                await followUser.updateOne({$pull : {followers:currentUserId}})
                await followingUser.updateOne({$pull:{followings:id}})
                res.status(200).json("User unfollowed!")
            }else{
                res.status(403).json("User is not followed by You")
            }
        }catch(err){
            res.status(500).json(err)
        }
    }
}



