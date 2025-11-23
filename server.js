const dotenv = require("dotenv");

dotenv.config();
const express = require("express");


const app = express();
const path = require("path");
const connectDB = require("./config/db.config");
connectDB();
app.use(express.json());

const productRoute = require("./routes/product.route");

const userRoute = require("./routes/user.route");
const authRoute=require('./routes/auth.router')
const purchaseRoute=require('./routes/purchase.route')
const reportRoute = require('./routes/report.route')
const settingRoute= require('./routes/setting.route')
const port = process.env.PORT;
const corsMiddleware= require('./middlewares/cors.middleware')
const cors= require('cors');

app.use(cors(corsMiddleware))


app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// const mongoose = require("mongoose");

// mongoose
//   .connect("mongodb://localhost:27017/advancedbackendtuesday")
//   .then(() => {
//     console.log("dayabase is connected successfully");
//   })
//   .catch(() => {
//     console.log("database connection Failed");
//   });

////REPLACED BY::::



app.use("/product", productRoute);

app.use("/user", userRoute);
app.use('/auth',authRoute);
app.use('/purchase',purchaseRoute);

app.use("/report", reportRoute);
app.use("/backup", settingRoute);

const AppError= require('./utilities/app-error.utils')
app.use('/',(req,res,next)=>{
  next(new AppError (`can't find ${req.originalUrl} on this server`,404))
})

const errorMiddleWare=require('./middlewares/error-handler.middleware');
app.use(errorMiddleWare);

app.listen(port, () => {
  console.log(`server runs on ${port}`);
});