import express from "express";
import dotenv from "dotenv";
import path from "path";
import { errorMiddleware } from "../middlewares/error.middleware";
import { ResponseError } from "../responses/error.response";
import authRouter from "../routes/auth.route";
import userRouter from "../routes/user.route";
import bannerRouter from "../routes/banner.route";

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());

app.use(
   express.static(path.join(__dirname, "../../public/uploads"), {
     maxAge: 31557600000,
   })
); 

// Routes
app.use(authRouter);
app.use(bannerRouter);
app.use(userRouter);

app.use((req, res, next) => {
   const route = req.originalUrl;
   const method = req.method;

   next(new ResponseError("Not Found", 404, `Method ${method} not found for route ${route}`));
});

app.use(errorMiddleware);

export default app;
