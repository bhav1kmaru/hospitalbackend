const express = require('express');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const { UserModel } = require('../models/UserModel');


const userRouter=express.Router()

userRouter.post('/register',async(req,res)=>{
    try {
        const {email,password}=req.body
        const userCheck=await UserModel.find({email})
        if(userCheck.length>0){
            res.send({message:"User already exists,Please Login"})
        }else{
            const hashedPassword=await bcrypt.hash(password,5)
            const user=new UserModel({email,password:hashedPassword})
            await user.save()
            res.send({message:"User Registered Successfully"})
        }
    } catch (error) {
        res.status(404).send({error:error.message})
    }
})

userRouter.post('/login',async(req,res)=>{
    const {email,password}=req.body
    try {
        const user=await UserModel.find({email})
        if(user.length>0){
            bcrypt.compare(password,user[0].password,(err,result)=>{
                if(result){
                    const token=jwt.sign({userID:user[0]._id},"shhhhh")
                    res.send({message:"Login Successful",token:token})
                }else{
                    res.send({message:"Wrong Credentials"})
                }
            })
        }else{
            res.send({message:"wrong credentials or user does not exist,please register"})
        }
    } catch (error) {
        res.send({message:"unable to login",error:error.message})
    }
})

module.exports={userRouter}