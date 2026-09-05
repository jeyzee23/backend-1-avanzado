import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    duration: { type: Number, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true, trim: true },
    available: { type: Boolean, default: true },
    seedKey: { type: String, unique: true, sparse: true, select: false },
  },
  { timestamps: true }
);

export const ServiceModel = mongoose.model("services", serviceSchema);
