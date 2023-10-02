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

	async getOrders(userId: string) {
		const orders = await this.getOrdersByUserId(userId)
		if(!orders.length) throw new Error(ShoppingServiceErrors.NO_ORDERS_FOUND)
	}

	async getCart(userId:string){
		const cart = await this.findCartByUserId(userId)
		if(!cart) throw new Error(ShoppingServiceErrors.CART_EMPTY)
	}

	async addItemToCart(userId:string,itemId:string,itemQuantity:number){
		const cart = await this.findCartByUserId(userId)
		if(!cart){
			const newCart = this.createCart(userId,itemId,itemQuantity)
		}
	}

	async deleteItemFromCart(userId:string,itemId:string,itemQuantity:number){
		const cart = await this.findCartByUserId(userId)
		if(!cart){
			const newCart = this.createCart(userId,itemId,itemQuantity)
		}
	}

	async deleteCart(cartId:string){
	}

	private async getOrdersByUserId(userId: string) {
		return this.orderSchema.find({ userId: userId });
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

	private async createCart(userId:string,itemId:string,ItemQuantity:number){
		//get Item using Item ID
		//create cart
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
	NO_ORDERS_FOUND = "No Orders Found"
}

export enum OrderStatus {
	RECEIVED = "received",
	PENDING = "pending",
}
