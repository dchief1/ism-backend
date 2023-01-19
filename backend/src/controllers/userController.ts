import asyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"
import configs from "../config/config";

const generateToken = (id: any) => {
    return jwt.sign({id}, configs.JWT_SECRET, {expiresIn: "1d"} )
};

export default class UserController  {
// Register User
 registerUser = asyncHandler( async (req: Request, res: Response) => {
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

 // Send HTTP-only cookie
 res.cookie("token", token, {
   path: "/", 
   httpOnly: true,
   expires: new Date(Date.now() + 1000 * 86400), // 1 Day
   sameSite: "none",
   secure: true
 })   

 if (user) {
    const {_id, name, email, photo, phone, bio} = user
    res.status(201).json({
        _id, name, email, photo, phone, bio, token
    });
 } else {
    res.status(400)
    throw new Error("invalid user data")
 }

});

// Login User
loginUser = asyncHandler( async (req: Request, res: Response) => {
   const {email, password} = req.body

  // Validate Request
  if ( !email || !password ) {
    res.status(400)
    throw new Error("Please add email and password")
  }

  // Check if user exist
  const user = await User.findOne({email}).select("+password") 

  if (!user) {
     res.status(400)
     throw new Error("User not found, please signup")
  }

  // User exist, now check if password is correct
  const passwordIsCorrect = await bcrypt.compare(password, user.password)

  //  Generate Token
  const token = generateToken(user._id)

 // Send HTTP-only cookie
 res.cookie("token", token, {
   path: "/", 
   httpOnly: true,
   expires: new Date(Date.now() + 1000 * 86400), // 1 Day
   sameSite: "none",
   secure: true
 })

  if (user && passwordIsCorrect) {
    const {_id, name, email, photo, phone, bio} = user
    res.status(200).json({
        _id, name, email, photo, phone, bio, token
    });
  } else {
    res.status(400)
    throw new Error("Invalid email or password")
  }

} );

// Logout User
logout = asyncHandler (async (req: Request, res: Response) => {
  res.cookie("token", "", {
    path: "/", 
    httpOnly: true,
    expires: new Date(0), // expires cookie to logout
    sameSite: "none",
    secure: true
  })
   res.status(200).json({message: "Successfully Logged Out"})
});

}
