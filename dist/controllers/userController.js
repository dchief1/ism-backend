"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const config_1 = __importDefault(require("../config/config"));
const Token_1 = __importDefault(require("../models/Token"));
const crypto_1 = __importDefault(require("crypto"));
const sendEmail_1 = __importDefault(require("../utils/sendEmail"));
const generateToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, config_1.default.JWT_SECRET, { expiresIn: "1d" });
};
class UserController {
    constructor() {
        // Register User
        this.registerUser = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { name, email, password } = req.body;
            // Validation
            if (!name || !email || !password) {
                res.status(400);
                throw new Error("Please fill in all required fields");
            }
            if (password.lenght < 6) {
                res.status(400);
                throw new Error("Password must be up to 6 characters");
            }
            // Check if user email already exists
            const userExists = yield User_1.default.findOne({ email });
            if (userExists) {
                res.status(400);
                throw new Error("Email has already been registered");
            }
            // Create new user
            const user = yield User_1.default.create({ name, email, password });
            //  Generate Token
            const token = generateToken(user._id);
            // Send HTTP-only cookie
            res.cookie("token", token, {
                path: "/",
                httpOnly: true,
                expires: new Date(Date.now() + 1000 * 86400),
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
            }
            else {
                res.status(400);
                throw new Error("invalid user data");
            }
        }));
        // Login User
        this.loginUser = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            // Validate Request
            if (!email || !password) {
                res.status(400);
                throw new Error("Please add email and password");
            }
            // Check if user exist
            const user = yield User_1.default.findOne({ email }).select("+password");
            if (!user) {
                res.status(400);
                throw new Error("User not found, please signup");
            }
            // User exist, now check if password is correct
            const passwordIsCorrect = yield bcryptjs_1.default.compare(password, user.password);
            //  Generate Token
            const token = generateToken(user._id);
            // Send HTTP-only cookie
            res.cookie("token", token, {
                path: "/",
                httpOnly: true,
                expires: new Date(Date.now() + 1000 * 86400),
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
            }
            else {
                res.status(400);
                throw new Error("Invalid email or password");
            }
        }));
        // Logout User
        this.logout = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            res.cookie("token", "", {
                path: "/",
                httpOnly: true,
                expires: new Date(0),
                sameSite: "none",
                secure: true,
            });
            res.status(200).json({ message: "Successfully Logged Out" });
        }));
        // Get User Profile
        this.getUser = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.default.findById(req.user._id);
            if (user) {
                const { _id, name, email, photo, phone, bio } = user;
                res.status(200).json({
                    _id,
                    name,
                    email,
                    photo,
                    phone,
                    bio,
                });
            }
            else {
                res.status(400);
                throw new Error("User Not Found");
            }
        }));
        // Get Login Status
        this.loginStatus = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const token = req.cookies.token;
            console.log(token);
            if (!token) {
                res.json(false);
            }
            // Verify Token
            const verified = jsonwebtoken_1.default.verify(token, config_1.default.JWT_SECRET);
            if (verified) {
                res.json(true);
            }
            res.json(false);
        }));
        // Update User
        this.updateUser = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.default.findById(req.user._id);
            if (user) {
                const { name, email, photo, phone, bio } = user;
                user.email = email;
                user.name = req.body.name || name;
                user.bio = req.body.bio || bio;
                user.phone = req.body.phone || phone;
                user.photo = req.body.photo || photo;
                const updatedUser = yield user.save();
                res.status(200).json({
                    _id: updatedUser._id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    photo: updatedUser.photo,
                    phone: updatedUser.phone,
                    bio: updatedUser.bio,
                });
            }
            else {
                res.status(404);
                throw new Error("User not found");
            }
        }));
        // Change password
        this.changePassword = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.default.findById(req.user._id).select("+password");
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
            const passwordIsCorrect = yield bcryptjs_1.default.compare(oldPassword, user.password);
            // Save new password
            if (user && passwordIsCorrect) {
                user.password = password;
                yield user.save();
                res.status(200).send("Password change successful");
            }
            else {
                res.status(400);
                throw new Error("Old password is incorrect");
            }
        }));
        this.forgotPassword = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            const user = yield User_1.default.findOne({ email });
            if (!user) {
                res.status(404);
                throw new Error("User does not exist");
            }
            // Delete token if it exists in DB
            let token = yield Token_1.default.findOne({ userId: user._id });
            if (token) {
                yield token.deleteOne();
            }
            // Create a reset token
            let resetToken = crypto_1.default.randomBytes(32).toString("hex") + user._id;
            console.log(resetToken);
            // Hash token before saving to DB
            const hashedToken = crypto_1.default
                .createHash("sha256")
                .update(resetToken)
                .digest("hex");
            // Save token to DB
            yield new Token_1.default({
                userId: user._id,
                token: hashedToken,
                createdAt: Date.now(),
                expiresAt: Date.now() + 30 * (60 * 1000), // thirty minutes
            }).save();
            // Construct Reset Url
            const resetUrl = `${config_1.default.FRONTEND_URL}/resetpassword/${resetToken}`;
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
            const sent_from = config_1.default.EMAIL_USER;
            const reply_to = null;
            try {
                yield (0, sendEmail_1.default)(subject, message, send_to, sent_from, reply_to);
                res.status(200).json({
                    success: true,
                    message: "Reset Email Sent",
                });
            }
            catch (error) {
                res.status(500);
                throw new Error("Email not sent, please try again");
            }
        }));
        this.resetPassword = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { password } = req.body;
            const { resetToken } = req.params;
            // Hash token, then compare to Token in DB
            const hashedToken = crypto_1.default
                .createHash("sha256")
                .update(resetToken)
                .digest("hex");
            // Find Token in DB
            const userToken = yield Token_1.default.findOne({
                token: hashedToken,
                expiresAt: { $gt: Date.now() },
            });
            if (!userToken) {
                res.status(404);
                throw new Error("Invalid or Expired Token");
            }
            // Find User
            const user = yield User_1.default.findOne({ _id: userToken.userId });
            if (user) {
                user.password = password;
                yield user.save();
                res.status(200).json({
                    message: "Password Reset Successful, Please Login",
                });
            }
        }));
    }
}
exports.default = UserController;
