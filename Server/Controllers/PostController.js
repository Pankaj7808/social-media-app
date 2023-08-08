import PostModel from "../Models/postModel.js";
import UserModel from '../Models/userModel.js'
import mongoose from "mongoose";

export const createPost = async (req,res)=>{
    
    const newPost = new PostModel(req.body)
    try{
        newPost.save()
        res.status(200).json("Post Created")
    }catch(err){
        res.status(500).json(err)
    }
}

export const getPost = async (req,res)=>{
    const id = req.params.id
    try{
        const post = await PostModel.findById(id)
        res.status(200).json(post)
    }catch(err){
        res.status(500).json(err)
    }
}

export const updatePost = async (req,res)=>{
    const id = req.params.id
    const {userId} = req.body
    try{
        const post = await PostModel.findById(id)
        //bug fixed
        if(post.userId===userId){
            await post.updateOne({$set : req.body})
            res.status(200).json("Post Updated") 
        }
        else{
            res.status(403).json("Action forbidden")
        }
    }catch(err){
        res.status(500).json(err)
    }
}

export const deletePost = async (req,res)=>{
    const id = req.params.id
    const {userId}=req.body
    try{
        const post = await PostModel.findById(id)
        if(post.userId===userId){
            post.deleteOne()
            res.status(200).json("Post Deleted")
        }else{
            res.status(403).json("Action forbidden")
        }
        
    }catch(err){
        res.status(500).json(err)
    }
}

// likes and dislike
export const likePost = async (req,res)=>{
    const id = req.params.id
    const {userId} = req.body
    try{
        const post = await PostModel.findById(id);
        if(!post.likes.includes(userId)){
            await post.updateOne({$push:{likes:userId}})
            
            res.status(200).json("Post liked")
        }else{
            await post.updateOne({$pull:{likes:userId}})
            res.status(200).json("Post unliked")
        }

    }catch(err){ 
        res.status(500).json(err)
    }
}

// Get Timeline Post
export const getTimelinePost = async (req, res) => {
    const userId = req.params.id;
    try {
        const currentUserPost = await PostModel.find({ userId: userId });
        const followingPost = await UserModel.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(userId),
                },
            },
            {
                $lookup: {
                    from: "posts",
                    localField: "followings",
                    foreignField: "userId",
                    as: "followingPosts",
                },
            },
            {
                $project: {
                    followingPosts: 1,
                    _id: 0,
                },
            },
        ]);

        const timelinePosts = currentUserPost.concat(...followingPost[0].followingPosts);
        // Sort the posts based on createdAt in descending order
        timelinePosts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        
        res.status(200).json(timelinePosts);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};
