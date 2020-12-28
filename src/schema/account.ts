import mongoose, { Document, Schema } from 'mongoose';
import { IAccount } from '../models/account';
import { RegexPatterns } from '../utils/regex';

const AccountSchema = new Schema(
  {
    email: {
      createIndexes: { unique: true },
      lowercase: true,
      match: RegexPatterns.EMAIL,
      required: [true, 'Email is required!'],
      trim: true,
      type: String,
      unique: true
    },
    fullname: {
      required: false,
      trim: true,
      type: String
    },
    password: {
      type: String,
      required: [true, 'Password is required!']
    },
    product: [
      {
        type: Number,
        ref: 'Product'
      }
    ]
  },
  {
    timestamps: {
      createdAt: 'createdDate',
      updatedAt: 'updatedDate'
    }
  }
);

export interface IAccountModel extends IAccount, Document {}
export const AccountModel = mongoose.model<IAccountModel>('Accounts', AccountSchema);
