import { model, Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface UserDocument extends Document {
    name: string;
    email: string;
    phone: string;
    password: string;
    photo: string;
    bio: string;
  }

const userSchema = new Schema(
  {
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
  },
  {
    timestamps: true,
    collection: "users",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Encrypt password before saving to DB
userSchema.pre("save", async function ( next ) {

  if(!this.isModified("password") || !this.password) {
    return next();
  }

  // Hash password 
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(this.password, salt)
  this.password = hashedPassword
  next();
  
})

const User = model<UserDocument>("User", userSchema);

export default User;