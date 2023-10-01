import mongoose, {Connection,Document} from "mongoose";
import {Container} from "typedi";
import config from "../config";
import {IOrderItem} from "./orderSchema";

const CartSchema = new mongoose.Schema({
	userId: { type: String },
	items: [
		{
			product: {
				_id: { type: String, require: true},
				name: { type: String },
				description: { type: String },
				banner: { type: String },
				type: { type: String },
				unit: { type: Number },
				price: { type: Number },
				supplier: { type: String },
			} ,
			unit: { type: Number, require: true}
		}
	]
});

export interface ICartSchema extends Document{
	userId:string,
	items:IOrderItem[]
}


export default {
	name: "CartSchema",
	model: Container.get<Connection>(config.mongo.db.name).model(
		"CartSchema",
		CartSchema,
		"carts",
	),
};
