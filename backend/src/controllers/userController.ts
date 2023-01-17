import asyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import User from "../models/User";
import bcrypt, { genSalt } from "bcryptjs";

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

 // Encrypt password befor saving to DB
 const salt = await bcrypt.genSalt(10)

 const hashedPassword = await bcrypt.hash(password, salt)

 // Create new user
 const user = await User.create({ name, email, password: hashedPassword })

 if (user) {
    const {_id, name, email, photo, phone, bio} = user
    res.status(201).json({
        _id, name, email, photo, phone, bio
    })
 } else {
    res.status(400)
    throw new Error("invalid user data")
 }

});

export default (registerUser);