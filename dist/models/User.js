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
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "please add a name"],
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        required: [true, "please add an email"],
        unique: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please add a valid email"
        ]
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: [6, "password must be up to 6 characters"],
        // maxlength: [23, "password must not be more than 23 characters"],
        select: false
    },
    photo: {
        type: String,
        required: [true, 'Please add a photo'],
        default: "https://i.ibb.co/4pDNDk1/avater.png"
    },
    phone: {
        type: String,
        default: "+234"
    },
    bio: {
        type: String,
        maxlength: [250, "Bio must not be more than 250 characters"],
        default: "bio"
    }
}, {
    timestamps: true,
    collection: "users",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// Encrypt password before saving to DB
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified("password") || !this.password) {
            return next();
        }
        // Hash password 
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(this.password, salt);
        this.password = hashedPassword;
        next();
    });
});
const User = (0, mongoose_1.model)("User", userSchema);
exports.default = User;
