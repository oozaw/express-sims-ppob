import express from "express";
import dotenv from "dotenv";
import { errorMiddleware } from "../middlewares/error.middleware";
import { ResponseError } from "../responses/error.response";
import authRouter from "../routes/auth.route";
import userRouter from "../routes/user.route";

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());

// Routes
app.use(authRouter);
app.use(userRouter);

app.use((req, res, next) => {
   const route = req.originalUrl;
   const method = req.method;

   next(new ResponseError("Not Found", 404, `Method ${method} not found for route ${route}`));
});

app.use(errorMiddleware);

export default app;
