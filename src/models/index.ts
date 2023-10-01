import mongoose from "mongoose";
import OrderSchema from "./orderSchema";
import CartSchema from "./cartSchema";

export const models: Array<{
	name: string;
	model: mongoose.Model<mongoose.Document>;
}> = [OrderSchema, CartSchema];
