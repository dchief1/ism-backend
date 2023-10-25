import asyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import configs from "../config/config";
import { CustomRequest, JwtObject } from "../utils/extendRequest";
import Token from "../models/Token";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail";

const generateToken = (id: any) => {
    return jwt.sign({ id }, configs.JWT_SECRET, { expiresIn: "1d" });
};

export default class UserController {
    // Register User
    registerUser = asyncHandler(async (req: Request, res: Response) => {
        const { name, email, password } = req.body;

        // Validation
        if (!name || !email || !password) {
            res.status(400);
            throw new Error("Please fill in all required fields");
        }
        if (password.length < 6) {
            res.status(400);
            throw new Error("Password must be up to 6 characters");
        }

        // Check if user email already exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            res.status(400);
            throw new Error("Email has already been registered");
        }

        // Create new user
        const user = await User.create({ name, email, password });

        //  Generate Token
        const token = generateToken(user._id);

        // Send HTTP-only cookie
        res.cookie("token", token, {
            path: "/",
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 86400), // 1 Day
            sameSite: "none",
            secure: true,
        });

        if (user) {
            const { _id, name, email, photo, phone, bio } = user;
            res.status(201).json({
                _id,
                name,
                email,
                photo,
                phone,
                bio,
                token,
            });
        } else {
            res.status(400);
            throw new Error("invalid user data");
        }
    });

    // Login User
    loginUser = asyncHandler(async (req: Request, res: Response) => {
        const { email, password } = req.body;

        // Validate Request
        if (!email || !password) {
            res.status(400);
            throw new Error("Please add email and password");
        }

        // Check if user exist
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            res.status(400);
            throw new Error("User not found, please signup");
        }

        // User exist, now check if password is correct
        const passwordIsCorrect = await bcrypt.compare(password, user.password);

        //  Generate Token
        const token = generateToken(user._id);

        // Send HTTP-only cookie
        res.cookie("token", token, {
            path: "/",
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 86400), // 1 Day
            sameSite: "none",
            secure: true,
        });

        if (user && passwordIsCorrect) {
            const { _id, name, email, photo, phone, bio } = user;
            res.status(200).json({
                _id,
                name,
                email,
                photo,
                phone,
                bio,
                token,
            });
        } else {
            res.status(400);
            throw new Error("Invalid email or password");
        }
    });

    // Logout User
    logout = asyncHandler(async (req: Request, res: Response) => {
        res.cookie("token", "", {
            path: "/",
            httpOnly: true,
            expires: new Date(0), // expires cookie to logout
            sameSite: "none",
            secure: true,
        });
        res.status(200).json({ message: "Successfully Logged Out" });
    });

    // Get User Profile
    getUser = asyncHandler(async (req: CustomRequest, res: Response) => {
        const user = await User.findById(req.user._id);

        if (user) {
            const { _id, name, email, photo, phone, bio } = user as any;
            res.status(200).json({
                _id,
                name,
                email,
                photo,
                phone,
                bio,
            });
        } else {
            res.status(400);
            throw new Error("User Not Found");
        }
    });

    // Get Login Status
    loginStatus = asyncHandler(async (req: CustomRequest, res: Response) => {
        const token = req.cookies.token;
        console.log(token);
        if (!token) {
            res.json(false);
        }

        // Verify Token
        const verified = jwt.verify(token, configs.JWT_SECRET) as JwtObject;
        if (verified) {
            res.json(true);
        }
        res.json(false);
    });

    // Update User
    updateUser = asyncHandler(async (req: CustomRequest, res: Response) => {
        const user = await User.findById(req.user._id);

        if (user) {
            const { name, email, photo, phone, bio } = user;
            user.email = email;
            user.name = req.body.name || name;
            user.bio = req.body.bio || bio;
            user.phone = req.body.phone || phone;
            user.photo = req.body.photo || photo;

            const updatedUser = await user.save();
            res.status(200).json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                photo: updatedUser.photo,
                phone: updatedUser.phone,
                bio: updatedUser.bio,
            });
        } else {
            res.status(404);
            throw new Error("User not found");
        }
    });

    // Change password
    changePassword = asyncHandler(async (req: CustomRequest, res: Response) => {
        const user = await User.findById(req.user._id).select("+password");
        const { oldPassword, password } = req.body;

        if (!user) {
            res.status(400);
            throw new Error("User not found, please signup");
        }

        // Validate
        if (!oldPassword || !password) {
            res.status(400);
            throw new Error("Please add old and new password");
        }

        // Check if old password matches password in DB
        const passwordIsCorrect = await bcrypt.compare(
            oldPassword,
            user.password,
        );

        // Save new password
        if (user && passwordIsCorrect) {
            user.password = password;
            await user.save();
            res.status(200).send("Password change successful");
        } else {
            res.status(400);
            throw new Error("Old password is incorrect");
        }
    });

    forgotPassword = asyncHandler(async (req: CustomRequest, res: Response) => {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            res.status(404);
            throw new Error("User does not exist");
        }

        // Delete token if it exists in DB
        let token = await Token.findOne({ userId: user._id });
        if (token) {
            await token.deleteOne();
        }

        // Create a reset token
        let resetToken = crypto.randomBytes(32).toString("hex") + user._id;
        console.log(resetToken);

        // Hash token before saving to DB
        const hashedToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        // Save token to DB
        await new Token({
            userId: user._id,
            token: hashedToken,
            createdAt: Date.now(),
            expiresAt: Date.now() + 30 * (60 * 1000), // thirty minutes
        }).save();

        // Construct Reset Url
        const resetUrl = `${configs.FRONTEND_URL}/resetpassword/${resetToken}`;

        // Reset email
        const message = `
    <h2>Hello ${user.name}</h2>
    <p>Please use the url below to reset your password</p>
    <p>Reset link is only valid for 30minutes</p>

    <a href=${resetUrl} clicktracking=off>${resetUrl}</a>

    <p>Regards...</p>
    <p>Ism Team</p>
  `;
        const subject = "Password Reset Request";
        const send_to = user.email;
        const sent_from = configs.EMAIL_USER;
        const reply_to = null;

        try {
            await sendEmail(subject, message, send_to, sent_from, reply_to);
            res.status(200).json({
                success: true,
                message: "Reset Email Sent",
            });
        } catch (error) {
            res.status(500);
            throw new Error("Email not sent, please try again");
        }
    });

    resetPassword = asyncHandler(async (req: CustomRequest, res: Response) => {
        const { password } = req.body;
        const { resetToken } = req.params;

        // Hash token, then compare to Token in DB
        const hashedToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        // Find Token in DB
        const userToken = await Token.findOne({
            token: hashedToken,
            expiresAt: { $gt: Date.now() },
        });

        if (!userToken) {
            res.status(404);
            throw new Error("Invalid or Expired Token");
        }

        // Find User
        const user = await User.findOne({ _id: userToken.userId });
        if (user) {
            user.password = password;
            await user.save();
            res.status(200).json({
                message: "Password Reset Successful, Please Login",
            });
        }
    });
}
