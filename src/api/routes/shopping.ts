import { Request, Response, Router } from "express";
import { Container } from "typedi";
import { ShoppingService } from "../../services/ShoppingService/ShoppingService";
import Logger from "../../loaders/logger";

export default (router: Router) => {
	const shoppingService = Container.get(ShoppingService);
	router.post("/order", async (req: Request, res: Response) => {
		try {
			const userId: string = req.body.userId.toString();
			const txnNumber: string = req.body.txnNumber.toString();
			const data = await shoppingService.placeOrder(userId, txnNumber);
		} catch (e) {
			Logger.error(e);
			// @ts-ignore
			response.setError(e);
		}
	});

	router.post("/orders", async (req: Request, res: Response) => {
		try {
			const userId: string = req.body.userId.toString();
			const data = shoppingService.getOrders(userId);
		} catch (e) {
			Logger.error(e);
			// @ts-ignore
			response.setError(e);
		}
	});

	router.post("/cart",async (req:Request,res:Response)=>{
		try{
			const userId:string = req.body.userId
			const data = shoppingService.getCart(userId)
		}catch (e) {
			Logger.error(e);
			// @ts-ignore
			response.setError(e);
		}
	})

	router.post("/cart/addItem", async (req:Request,res:Response)=>{
		try{
			const userId:string = req.body.userId.toString()
			const itemId = req.body.itemId
			const itemQuantity = req.body.itemQuantity
			const data = await shoppingService.addItemToCart(userId,itemId,itemQuantity)
		}catch (e) {
			Logger.error(e);
			// @ts-ignore
			response.setError(e);
		}
	})

	router.post("/cart/deleteItem", async (req:Request,res:Response)=>{
		try{
			const userId:string = req.body.userId.toString()
			const itemId = req.body.itemId
			const itemQuantity = req.body.itemQuantity
			const data = await shoppingService.deleteItemFromCart(userId,itemId,itemQuantity)
		}catch (e) {
			Logger.error(e);
			// @ts-ignore
			response.setError(e);
		}
	})

	router.post("/cart/delete", async (req:Request,res:Response)=>{
		try{
			const cartId:string = req.body.userId.toString()
			const data = await shoppingService.deleteCart(cartId)
		}catch (e) {
			Logger.error(e);
			// @ts-ignore
			response.setError(e);
		}
	})
};
