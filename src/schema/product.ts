import mongoose, { Document, Schema } from 'mongoose';
import { IProduct } from '../models/product';

const ProductSchema = new Schema(
  {
    name: {
      required: true,
      trim: true,
      type: String
    },
    price: {
      required: true,
      trim: true,
      type: String
    },
    available: {
      required: true,
      type: Boolean
    },
    variants: [
      {
        color: String,
        quantity: Number,
        size: [String]
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

export interface IProductModel extends IProduct, Document {}
export const ProductModel = mongoose.model<IProductModel>('Product', ProductSchema);
