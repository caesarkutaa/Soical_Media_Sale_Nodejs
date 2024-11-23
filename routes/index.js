// @ts-nocheck
const { Router } = require("express");

const userRouter = require("./authRoutes");
const orderRouter = require("./orderRoutes");
const adminRouter = require("./adminRoutes"); 
const productRouter = require("./productRoutes");

const rootRouter = Router();

// Attach the routes to the router
rootRouter.use("/auth", userRouter);
rootRouter.use("/order", orderRouter);
rootRouter.use("/products", productRouter);
rootRouter.use("/admin", adminRouter)

module.exports = rootRouter;
