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
};
