import mongoose, {Connection,Document} from "mongoose";
import {Container} from "typedi";
import config from "../config";

const OrderSchema = new mongoose.Schema({
		orderId: { type: String },
		userId: { type: String },
		amount: { type: Number },
		status: { type: String },
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
	},
	{
		toJSON: {
			transform(doc, ret){
				delete ret.__v;
			}
		},
		timestamps: true
})

export interface IOrderSchema extends Document{
	orderId:string,
	userId:string,
	amount:number,
	status:string,
	items: IOrderItem[],

}

export interface IOrderItem{
	product: IOrderItemProduct,
	unit:number
}

export interface IOrderItemProduct{
	_id: string,
	name:string,
	description:string,
	banner:string,
	type:string,
	unit:string,
	price:string,
	supplier:string
}
export default {
	name: "OrderSchema",
	model: Container.get<Connection>(config.mongo.db.name).model(
		"OrderSchema",
		OrderSchema,
		"orders",
	),
};
