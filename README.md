//////////we use env to save sensitive data////////

--> npm i dot env
-->create .env file
-->in srever.js: require dot env then dotenv.config();


-----------------------------
///what is the problem of using app.use("/uploads", express.static("./uploads"));???///////

--security problem hacker can axcess certain files using ./upload/../...

-Solution: app.use("/uploads", express.static(path.jioin(__dirname,'uploads')));
it lets you always in the root so it solve security problem



------------------------------------------
///How to access port form .env ??/////////

using process.env.____

-const port=process.env.PORT;



---------------------------------------
/////when connecting to database in the proper way/////////////

--> you put in .env the uri of mongoconnection:


MONGO_URI=mongodb://localhost:27017/advancedbackendtuesday

--> you need to create folder called config

-->then make file called db.config.js:
const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    const connectionString = proccess.env.MONGO_URI;
    await mongoose.connect(connectionString);
    console.log("MongoDB is connected");
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
};

module.exports=connectDB; // to export and use it in sever.js


-->then in server.js you need only to do 

const connectDB = require("./config/db.config");
connectDB();



------------------------------------------
///////////now i want to separate the databasem schema ////////

--> we created modles folder

-->then we created product.model.js:
const mongoose=require('mongoose')
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    desc: { String },
    price: Number,
    imgURL: String,
    stock: Number,
    slug: { type: String, required: true, unique: true },
  },
  { timpstamps: true }
);
module.exports= mongoose.model("Product", productSchema);


//////then also we made folder for routes /////////

--> we created product.route.js

--> we called express.Router and at the end we made module.exports=router

--NOTE--
-we separated the fun in which we will send it to controller since router must not contain process or dealing with db and etc--

const express=require('express');
const router= express.Router();

let myFun= async (req, res) => {
  const products = await Product.find();
  res.status(200).json(products);
}

app.get("/product", myFun);

module.exports=router;


////so after separating in the controller////

--> we made file named productcontroller.js inside controller folder and we bought the required model which conains:
const Product= require("../models/product.model")

exports.getAllProducts= async (req, res) => {
  const products = await Product.find();
  res.status(200).json(products);
}


--> then in the routes in product.route it will contain 

const express=require('express');
const router= express.Router();
const {getAllProducts}=require('../controller/product.controller')

router.get("/product", getAllProducts);

module.exports=router;


--> to use it in server.js we just add it:
const productRoute= require("./routes/product.route")
app.use('/product',productRoute)




------------------------------------

////what if you have to models user and prchase mocel and you want to link purchase with user and also proudcts////////


->user.model.js:
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { String },
  password: String,
  imgURL: String,
});
module.exports = mongoose.model("User", userSchema);

->product.model.js:
const mongoose=require('mongoose')
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    desc: { String },
    price: Number,
    imgURL: String,
    stock: Number,
    slug: { type: String, required: true, unique: true },
  },
  { timpstamps: true }
);
module.exports= mongoose.model("Product", productSchema);



->purchase.model.js:(we want to link it with user and product)(ASk chatgpt for explaination)

const mongoose = require("mongoose");
const purchaseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  price: Number,
  quantity: Number,
  purchaseAt: {
    type: Date,
    default: Date.now,
  },
},{timestamps:true});
module.exports = mongoose.model("Purchase", purchaseSchema);


---------------------------------------
///what if you want to use slug rather than getting by id ////////

--so in product.controller.js:
exports.getProductBySlug=async(req,res)=>{
    const slug=req.params.slug;
    const product= await Product.findOne({slug})
    if (product){
        res.status(200).json({message:`product (${slug}) info`,data:product});
    }
    else{
        res.status(404).json({message:"error, product not found"});
    }
}


---------------------------------------------------
//what if you want to delete product ??////////

NOTE:
we do not delete product we set flag to false or true

--> in product.model we added is deleted flag :
const mongoose = require("mongoose");
const { boolean } = require("webidl-conversions");
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    desc: { String },
    price: Number,
    imgURL: String,
    stock: Number,
    isDeleted: { type: Boolean },
    slug: { type: String, required: true, unique: true },
  },
  { timpstamps: true }
);
module.exports = mongoose.model("Product", productSchema);

--> while in product.controller.js we changed get to filter is deleted false and added the delete method:

const Product = require("../models/product.model");

exports.getAllProducts = async (req, res) => {
  const products = await Product.find({isDeleted:false});
  res.status(200).json({ message: "all products", data: products });
};

exports.getProductBySlug = async (req, res) => {
  const slug = req.params.slug;
  const product = await Product.findOne({ slug });
  if (product) {
    res.status(200).json({ message: `product (${slug}) info`, data: product });
  } else {
    res.status(404).json({ message: "error, product not found" });
  }
};

exports.addProduct = async (req, res) => {
  const { name, desc, price, stock } = req.body;
  const imgURL = req.file.filename;
  const product = await Product.create({ name, desc, price, stock, imgURL });
  res.status(201).json({ message: "product cretad", data: product });
};

exports.deleteProduct = async (req, res) => {
  const id = req.params.id;
  const product = await Product.findByIdAndUpdate(id, { isDeleted: true });
  if (product) {
    res.status(200).json({ message: "product deleted", data: product });
  } else {
    res.status(404).json({ message: "error, product not found" });
  }
};

-->product.route.js:
const express=require('express');
const router= express.Router();
const {getAllProducts, getProductBySlug,addProduct,deleteProduct}=require('../controller/product.controller')

router.get("/", getAllProducts);
router.post("/", addProduct);
router.get("/:slug", getProductBySlug);
router.delete("/:id", deleteProduct);



module.exports=router;

//////////////////////////////////////////////////////////////

/////(Ask chatGPT)////// for the order of this and what happens if we put slug before we get all products:


router.get("/", getAllProducts);
router.post("/", addProduct);
router.get("/:slug", getProductBySlug);
router.delete("/:id", deleteProduct);



/////////now we missed something dealing with multer for uploads/////

--> we created new folder called middlewares

-->inside it we created file called upload.middleware.js:(we must apply filteration proccess to avoid uploading virus )

--NOTE--
since admin will only he will upload image so we only we will check for extention





-
-
-
-

-


-------------------------------------

/////what if you wan tto bycrpt the password ???//////

-->npm i bycrpt

-->make it in user.model so go get the required bcrypt
const bcrypt=require("bcrypt");

const mongoose = require("mongoose");
const bcrypt=require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { String },
    password: String,
    role: { type: String ,
      enum:['admin','user']
    },
  },
  { timestamps: true }
);

userSchema.pre('save',async function(next){
  if(this.isModified('password')){
    this.password=await bcrypt.hash(this.password,12)

  }
  return next()

})
module.exports = mongoose.model("User", userSchema);


--------------------------------------------
///////////////authentication///////////////

////what if you want to make sure of the password an compare it in the user model//////

-->in user.model:

userSchema.methods.correctPassword= async function(inputPassword){
  return await bcrypt.compare(inputPassword,this.password)
}


--> now we created auth.controller

const User = require("../models/user.model");

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const myuser = await User.findOne({ email });
  if (!myuser) {
    return res.status(404).json({ message: "Error,email not found" });
  }
  const correctPassword = await myuser.correctPassword(password);
  if (!correctPassword) {
    return res.status(401).json({ message: "invalid password" });
  }
  res.status(200).json({ message: "you are logged in" });
};


--> then we created auth.route
const express =require('express');
const router= express.Router();
const {login}=require('../controller/auth.controller');

router.post('/login',login);
module.exports=router;


--> then we called it in server.js






------------------------------------------------
////what about adding token ???(ask chatGPT)////////////


-->download package npm i jsonwebtoken

--> IN ENV GO put and get secrey key:
SECRET_KEY=geOjY/6p**AE9h*diYwQw&gvS4r=j->0OQ6g$`O*N9e5&W*.nX/8`bV*FZ10RF^


-->auth.controller.js
(we added an new fuction called signToken and we down identified down const token to call the function )

const User = require("../models/user.model");
const jwt = require('jsonwebtoken')

const signToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, name: user.name },
    process.env.SECRET_KEY,{expiresIn:process.env.JWT_EXPIRES_IN}
  );
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const myuser = await User.findOne({ email });
  if (!myuser) {
    return res.status(404).json({ message: "error,invalid email or password" });
  }
  const correctPassword = await myuser.correctPassword(password);
  if (!correctPassword) {
    return res.status(401).json({ message: "error,invalid email or password" });
  }
  const token=signToken(myuser);
  res.status(200).json({ message: "you are logged in" ,data:token});
  
};

///////////////let chat gpt explain this part/////////////


--> we created auth.middleware.js:

const jwt = require('jsonwebtoken')
const User= require('../models/user.model');

exports.authenticate=async (req,res)=>{
    const authHeader= req.headers.authorization
    console.log(authHeader)
}


--> then we puy it between the api to test it for example in user.route.js file:

router.get('/',authenticate,getAllUsers)


-------------------------------------------------------------

/////now we will make authrization/////////

--> we added this in authmiddleware to get the use data to see the role for the authrization:
 if (myUser) {
        req.user=myUser; //////made to be used in the next middleware for authrization
      return next();
    }


--> we create middleware called role.middleware.js:
exports.authorize=(...allowedRoles)=>{
    return (req,res,next)=>{
        const role = req.user.role;

        if (allowedRoles.includes(role)){
            return next()
        }
return res.status(403).json({message:"error,access denied"})
    }
}

--> in user.route.js we assigend the authorized role who can see users only :

router.get('/',authenticate,authorize('admin'),getAllUsers)



-------------------------------------------------------
//////////what if you want to add admin so only admin can add admin ???////

--> in user.route.js:

router.post('/addadmin',authenticate,authorize('admin'),addUser('admin'));


---------------------------------------------------------
//////what if we want only admin add and delete products??////////////////


-->so we go to product.route then we add the authentication and authorization:

router.post("/",authenticate,authorize('admin'), upload.single("img"), addProduct);

router.delete("/:id",authenticate,authorize('admin'), deleteProduct);



-----------------------------------

/////now we want to create purchase///////


--> create purchase.model.js:
const mongoose = require("mongoose");
const purchaseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  price: Number,
  quantity: Number,
  purchaseAt: {
    type: Date,
    default: Date.now,
  },
},{timestamps:true});
module.exports = mongoose.model("Purchase", purchaseSchema);


--> purchase.controller.js:

const Purchase=require('../models/purchase.model');
const Product=require('../models/product.model')
exports.createPurchase=async (req,res)=>{
    const userId=req.user._id;
    const {productId,quantity,purchaseAt}=req.body
    const myProduct= await Product.findById(productId)
if (!myProduct){
    return res.status(404).json({message:"error product not found"})
}
const myPurchase= await Purchase.create({user:userId,product:productId,price:myProduct.price,quantity,purchaseAt})
res.status(201).json({message:"purchase done",data:myProduct})
}

-->we created purchase route.js:

const express= require('express')
const router= express.Router();
const{authenticate}= require('../middlewares/auth.middleware')
const {authorize}=require('../middlewares/role.middleware')
const{createPurchase}=require('../controller/purchase.controller')


router.post('/',authenticate,authorize('user'),createPurchase);


module.exports=router;


--> we added the route to the server.js


------------------------------------------------------

////we want admin to get all products////

--> add in purchase controller:
const Purchase = require("../models/purchase.model");
const Product = require("../models/product.model");
exports.createPurchase = async (req, res) => {
  const userId = req.user._id;
  const { productId, quantity, purchaseAt } = req.body;
  const myProduct = await Product.findById(productId);
  if (!myProduct) {
    return res.status(404).json({ message: "error product not found" });
  }
  const myPurchase = await Purchase.create({
    user: userId,
    product: productId,
    price: myProduct.price,
    quantity,
    purchaseAt,
  });
  res.status(201).json({ message: "purchase done", data: myProduct });
};

exports.getAllPurchases = async (req, res) => {
  const purchases = await Purchase.find().populate('user product'); ////// ----> search about populate
    res.status(200).json({ message: "list of products", data: purchases });
};

--> in purchase.route:
router.get('/',authenticate,authorize('admin'),getAllPurchases);


////NOTE////
if i want to populate name of product and for user for example email and name so do 2 poplulate :

-->.populatee('','').populate('','')

////NOTE////
if i want to delete id from product:
-->.populatee('','-_id')



-----------------------------------------------------
//////Now we want to add sales report to gt report for sales///////////////////////////

--note--
   //mydomain.com/api/report/salesReport?startDate=1/1/2025 & endDate=1/1/2026

  -startDate=1/1/2025 & endDate=1/1/2026 this part is named Query
    -so usually filtering is made by query
    --but-- if we will use params it must be mydomain.com/startDate/endDate/category

-->so we create in controller sales-reports.controller.js:

const Purchase = require("../models/purchase.model");
const mongoose = require("mongoose");

exports.getSalesReport = async (req, res) => {
  //mydomain.com/api/report/salesReport?startDate=1/1/2025 & endDate=1/1/2026

  ///startDate=1/1/2025 & endDate=1/1/2026 this part is named Query
  //usually filtering is made by query
  ///but if we will use params it must be mydomain.com/startDate/endDate/category

  const { startDate, endDate } = req.query;
  const matchStage = {};
  if (startDate && endDate) {
    matchStage.purchaseAt = {};
    matchStage.purchaseAt.$gte = new Date(startDate); //because it comes from query string
    matchStage.purchaseAt.$lte = new Date(endDate);

    const summary = await Purchase.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $addFields: {
          totalPrice: { $multiply: ["$price", "$quantity"] },
        },
      },
      {
        $facet: {
          overallStats: [
            {
              $group: {
                _id: null,
                totalSalesAmount: { $sum: "$totalPrice" },
                totalQuantitySold: { $sum: "$quantity" },
                totalPurchases: { $sum: 1 },
              },
            },
          ],
          topProducts: [
            {
              $group: {
                _id: "$product._id",
                name: "$first:$product.name",
                revenue: { $sum: "$totalPrice" },
                quantitySold: { $sum: "$quantity" },
              },
            },
            { $sort: { revenue: -1 } },
            { $limit: 5 },
          ],
          topUsers: [
            {
              $group: {
                _id: "$user._id",
                name: { $first: "$user.name" },
                email: { $first: "$user.name" },
                totalSpent: { $sum: "$totalPrice" },
                totalQuantity: { sum: "$quanitity" },
                totalPurchases: { $sum: 1 },
              },
            },
            { $sort: { totalSpent: -1 } },
            { $limit: 5 },
          ],
          montlySales: [
            {
              $group: {
                _id: {
                  year: { $year: "$purchaseAt" },
                  month: { $month: "$purchaseAt" },
                },
                totalRevenue: { $sum: "$totalPrice" },
                totalQuantity: { $sum: "$qunatity" },
              },
            },
            { $sort: { "_id.year": 1, "_id.month": -1 } },
          ],
        },
      },
    ]);
    res.status(200).json({message:`sales report from date ${startDate} to ${endDate}`})
  }
      res.status(404).json({message:"error,start date or end date not found"})

};


--> ceate report.route.js:
const express= require('express')
const router= express.Router();
const{authenticate}= require('../middlewares/auth.middleware')
const {authorize}=require('../middlewares/role.middleware')
const{createPurchase,getAllPurchases,getUserPurchase}=require('../controller/purchase.controller')


router.post('/',authenticate,authorize('user'),createPurchase);
router.get('/getUserPurchase',authenticate,authorize('user'),getUserPurchase);
router.get('/',authenticate,authorize('admin'),getAllPurchases);




module.exports=router;


--> then add route in the server.js



-----------------------------------------------------
////////create transaction to remove for example from stock available /////////////

--> in purchase.controller.js:

we editted the creatPurchase because we needed to make transaction so :
exports.createPurchase = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const userId = req.user._id;

    const { productId, quantity, purchaseAt } = req.body;
    const myProduct = await Product.findOneAndUpdate(
      { _id: productId, stock: { $gte: quantity } },
      { $inc: { stock: -quantity } },
      { new: true, session }
    );
    if (!myProduct) {
      throw new Error("product not found or stock less than quantity");
    }

    if (!myProduct) {
      return res.status(404).json({ message: "error product not found" });
    }
    const myPurchase = await Purchase.create(
      [
        {
          user: userId,
          product: productId,
          price: myProduct.price,
          quantity,
          purchaseAt,
        },
      ],
      { session }
    );
    await session.commitTransaction();
    session.endSession();
    res.status(201).json({ message: "purchase done", data: myPurchase });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(404).json({ message: `"error ",${err.message}` });
  }
};


--> then it same in all files






---------------------------------------------------------------------
///What about if we want to create backup ??/////////////

--> we created file created folder called services and we created file called db-backup.service.js:

const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const createBackup = () => {
//   const timestamp = new Date().toISOString().replace(/[ ]/g,"-");
const timestamp = new Date()
  .toISOString()
  .replace(/[:]/g, "-")   // replace colons
  .replace(/\./g, "-");   // replace dots

  const backupFolder = path.join(
    __dirname,
    "..",
    "backups",
    `backup-${timestamp}`
  );


if(!fs.existsSync(backupFolder)){
    fs.mkdirSync(backupFolder,{recursive:true});
}
const mongoURI =process.env.MONGO_URI;
const command =`mongodump --uri="${mongoURI}" --out="${backupFolder}" --gzip`
exec(command,(error,stdout,stdrr)=>{
    if (error){
        console.log(error.message)
    }
    else{
        console.log('backup created || ',stdout)
    }
})
}

module.exports={createBackup}


--> then we created an controller called setting.controller.js:
const {createBackup} = require("../services/db-backup.service")

exports.createBackup=(req,res)=>{

    try{
        createBackup();
        res.status(201).json({message:"backup created"})

    }catch(err){
        res.status(500).json({message:`"backup failed error: ${err.message}` })

    }
}

--> then we created a setting.route.js:
const {createBackup}= require('../controller/setting.controller');
const express= require('express')
const router= express.Router();
const {authorize}=require('../middlewares/role.middleware')
const{createPurchase,getAllPurchases,getUserPurchase}=require('../controller/purchase.controller');
const { authenticate } = require('../middlewares/auth.middleware');




router.post('/backup',authorize,authenticate('admin'),createBackup)

module.exports=router


--> then add in the server folder


--------------------------------------------------
////what if restoree//////////////////















-----------------------------------------------
/////what to do since we cannot deal with cors() like this only??////////////

--> we go add inside .env the ALLOWED_ORGINS that are allowed to access our backend

ALLOWED_ORGIONS=http://localhost:3000

--> we are going to create middleware cors.middleware.js :
const cors = require("cors");
const allowedOrgins = process.env.ALLOWED_ORIGINS.split(",");
const corsOption = {
  orgin: function (orgin, callback) {
    if (!orgin) {
      return callback(null, true); // null means pass without giving error
    }
    if (allowedOrgins.includes(orgin)) {
      return callback(null, true);
    } else return callback(new Error("cors policy, origin not allowed"));
  },
  credentials:true,
  methods:['GET','POST','PUT','DELETE','PATCH'],
  allowedHeaders:['Content-Type', 'Authorization']
};

module.exports= (corsOption);


--> then inside server yoou need to do export it and put it in the top:
const corsMiddleware= require('./middlewares/cors.middleware')
const cors= require('cors');

app.use(cors(corsMiddleware));























