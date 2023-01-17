import asyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import configs from "../config/config";

const generateToken = (id: any) => {
    return jwt.sign({id}, configs.JWT_SECRET, {expiresIn: "1d"} )
};

const registerUser = asyncHandler( async (req: Request, res: Response) => {
   const {name, email, password} = req.body

  // Validation
  if ( !name || !email || !password ) {
    res.status(400)
    throw new Error("Please fill in all required fields")
  }
  if (password.lenght < 6) {
    res.status(400)
    throw new Error("Password must be up to 6 characters")
  }

 // Check if user email already exists  
 const userExists = await User.findOne({email}) 

 if (userExists) {
    res.status(400)
    throw new Error("Email has already been registered")
 }

 // Create new user
 const user = await User.create({ name, email, password })

  //  Generate Token
  const token = generateToken(user._id)

 if (user) {
    const {_id, name, email, photo, phone, bio} = user
    res.status(201).json({
        _id, name, email, photo, phone, bio, token
    })
 } else {
    res.status(400)
    throw new Error("invalid user data")
 }

});

export default (registerUser);