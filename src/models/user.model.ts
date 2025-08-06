import mongoose, { Schema, Document } from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

interface IUserData {
  name: string;
  dob: string;
  phone: string;
  email: string;
  password: string;
  gender: 'Male' | 'Female' | 'Other';
  blood_group?: string;
  height_cm?: number;
  weight_kg?: number;
  chronic_conditions?: string[];
  allergies?: string[];
  medications?: string[];
  smoking?: boolean;
  alcohol?: boolean;
  exercise_frequency?: string;
  diet_type?: string;
  family_history?: string[];
  location?: string;
  language?: string;
  emergency_contact?: string;
}



const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    dob: {
      type: String,
      required: true,
      match: /^\d{2}-\d{2}-\d{4}$/
    },
    phone: {
      type: String,
      required: true,
      match: /^[6-9]\d{9}$/,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      //   match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },

    gender: {
      type: String,
      required: true,
      enum: ['male', 'female', 'other'],
    },

    blood_group: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      default: null
    },
    height_cm: {
      type: Number,
      default: null
    },
    weight_kg: {
      type: Number,
      default: null
    },
    chronic_conditions: {
      type: [String],
      default: []
    },
    allergies: {
      type: [String],
      default: []
    },
    medications: {
      type: [String],
      default: []
    },
    smoking: {
      type: Boolean,
      default: null
    },
    alcohol: {
      type: Boolean,
      default: null
    },
    exercise_frequency: {
      type: String,
      default: null
    },
    diet_type: {
      type: String,
      enum: ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Other'],
      default: null
    },
    family_history: {
      type: [String],
      default: null
    },
    location: {
      type: String,
      default: null
    },
    language: {
      type: String,
      default: null
    },
    emergency_contact: {
      type: String,
      default: null
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err as Error);
  }
});

UserSchema.methods.comparePassword = async function (
  userPassword: string
): Promise<boolean> {
  return bcrypt.compare(userPassword, this.password);
};

UserSchema.methods.generateAccessToken = async function () {
  const payload = {
    email: this.email,
    id: this._id,
    name: this.name
  };
  const secret_key = process.env.JWT_SECRET as string;
  const token = jwt.sign(payload, secret_key, { expiresIn: '24h' });
  return token;
};

UserSchema.methods.generateRefreshToken = async function () {
  const payload = {
    email: this.email,
    id: this._id,
    name: this.name
  };
  const secret_key = process.env.JWT_SECRET as string;
  const token = jwt.sign(payload, secret_key, { expiresIn: '7d' });
  return token;
};


export interface IUser extends IUserData, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAccessToken(): Promise<string>;
  generateRefreshToken(): Promise<string>;
}



export const User = mongoose.model<IUser>(
  "user",
  UserSchema
);
