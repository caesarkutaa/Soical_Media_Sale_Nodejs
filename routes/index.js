// @ts-nocheck
const { Router } = require("express");

const userRouter = require("./authRoutes");
const orderRouter = require("./orderRoutes");
const adminRouter = require("./adminRoutes"); 
const productRouter = require("./productRoutes");
const paymentRouter = require("./paymentsRoutes");
const cartRouter = require("./cartRoutes")
const rootRouter = Router();

// Attach the routes to the router
rootRouter.use("/auth", userRouter);
rootRouter.use("/order", orderRouter);
rootRouter.use("/products", productRouter);
rootRouter.use("/admin", adminRouter)
rootRouter.use("/payment", paymentRouter);
rootRouter.use("/cart", cartRouter);


module.exports = rootRouter;
