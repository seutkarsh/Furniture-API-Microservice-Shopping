import { Inject, Service } from "typedi";
import { IOrderItem, IOrderSchema } from "../../models/orderSchema";
import { Document, Model } from "mongoose";
import { ICartSchema } from "../../models/cartSchema";
import { v4 as uuidv4 } from "uuid";

@Service()
export class ShoppingService {
	constructor(
		@Inject("OrderSchema")
		private orderSchema: Model<IOrderSchema & Document>,
		@Inject("CartSchema")
		private cartSchema: Model<ICartSchema & Document>,
	) {}

	async placeOrder(userid: string, txnNumber: string) {
		//verify transaction using txn Number
		const cart: ICartSchema | null = await this.findCartByUserId(userid);

		if (!cart) throw new Error(ShoppingServiceErrors.CART_NOT_FOUND);
		let amount: number = 0;
		const cartItems: IOrderItem[] = cart.items;
		if (!cartItems.length)
			throw new Error(ShoppingServiceErrors.CART_EMPTY);
		cartItems.map((item: IOrderItem) => {
			amount += parseInt(item.product.price) * item.unit;
		});

		const orderId: string = uuidv4();
		const orderDetails: IOrderCreationDetails = {
			orderId: orderId,
			userId: userid,
			amount: amount,
			status: OrderStatus.RECEIVED,
			items: cartItems,
		};
		const order: IOrderSchema = await this.createOrder(orderDetails);
	}

	private async findCartByUserId(userId: string) {
		return this.cartSchema.findOne({ userId: userId });
	}
	private async emptyCart(cart: ICartSchema) {
		return (cart.items = []);
	}
	private async createOrder(orderDetails: IOrderCreationDetails) {
		return this.orderSchema.create(orderDetails);
	}
}

export interface IOrderCreationDetails {
	orderId: string;
	userId: string;
	amount: number;
	status: string;
	items: IOrderItem[];
}
export enum ShoppingServiceErrors {
	CART_NOT_FOUND = "Cart Not Found",
	CART_EMPTY = "Cart is Empty",
}

export enum OrderStatus {
	RECEIVED = "received",
	PENDING = "pending",
}
