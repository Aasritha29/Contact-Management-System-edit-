import express from 'express'
import { UserModel } from '../models/User.js'
import { validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config({path:"../config/.env"})



const Register=async (req,res)=>{
   const errors=validationResult(req)              // Validate the request data using express-validator
   if(!errors.isEmpty())
   {
      return res.status(400).json({errors:errors.array()})
   }
   
   const {name,email,password}=req.body;
   try{

       // Check if a user with the same email already exists
       const userExist=await UserModel.findOne({email});
        if(userExist)
        {
         return res.status(400).json({
              errors:[{ msg:'User already existed'}],
         });
        }
      
        // Hash the password with bcrypt and create a new user instance
 
        const hashPassword=await bcrypt.hash(password,12)
        const newUser=new UserModel({name,email,password:hashPassword})

        // Save the new user in the database
        const result=await newUser.save()
        result._doc.password=undefined;
        return res.status(201).json({success:true,...result._doc})
   } catch(err)
   {
         console.log(err)
         return res.status(500).json({error:err.message})
   }

   
};

//login an existing user
const Login=async (req,res)=>{
   const errors=validationResult(req)
     if(!errors.isEmpty())
       {
          return res.status(400).json({errors:errors.array()})
        }
     const {email,password}=req.body;   // Extract email and password from the request body

     try
     {
        const userExist=await UserModel.findOne({email})
        if(!userExist)
        {
              return res.status(400).json({
              errors:[{  msg:'User is not registered'}],
         });
       }

        // Compare the provided password with the stored hashed password
        const isPasswordOk= await bcrypt.compare(password,userExist.password)
        if(!isPasswordOk)
         {
              return res.status(400).json({
              errors:[{  msg:'Wrong Password'}],
             });
         }
       // Generate a JWT token for the user with an expiration time of 3 days
        const token=jwt.sign({_id:userExist._id},process.env.JWT_SECRET_KEY,{expiresIn:"3d"});
        const user={...userExist._doc,password:undefined}
        return res.status(201).json({success:true,user,token})    // Send success response with user and token

      } 
      catch(err)
      {
         console.log(err)
         return res.status(500).json({error:err.message})
      }
};

//Fetch the user
 const Auth=(req,res)=>{
   return res.status(200).json({success:true,user:{...req.user._doc}})
 }

export {Register,Login,Auth};