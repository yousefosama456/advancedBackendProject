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




