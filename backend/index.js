const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { type } = require("os");
const { error } = require("console");


app.use(express.json());
app.use(cors());

//Data connection with MongoDB
mongoose.connect("mongodb+srv://neosandre:gihau89f3XqL25mj@e-commerce.z7avvp0.mongodb.net/e-commerce");

//api creation
app.get("/",(req,res)=>{
    res.send("express App in Rinning");

});

//image storing engine
const storage = multer.diskStorage({
    destination: "./upload/images",
    filename:(req,file,cb)=>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({storage:storage});

//creating upload endpoint for images
app.use('/images',express.static('upload/images'));

app.post('/upload',upload.single('product'),(req, res)=>{
    res.json({
        success:1,
        image_url:`http://localhost:${port}/images/${req.file.filename}`
    });
});

//schema for creating products/data model
const Product = mongoose.model("Product",{
    id:{
        type: Number,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    new_price:{
        type: Number,
        required:true,
    },
    old_price:{
        type: Number,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now,
    },
    avelaible:{
        type:Boolean,
        default:true,
    },

});

//posting to database
app.post("/addproduct", async (req,res)=>{

//reteaving all products in a array
const products = await Product.find({});
let id;

//continueing to increasing id number is there are already products
if(products.length>0){
    //getting the last product from an array
    let last_product_array= products.slice(-1);
    //generating auto id 
    let last_product = last_product_array[0];
    id = last_product.id + 1;
}else{
    id=1;
}

    //adding data to schema/model
    const product = new Product({
        id: id,
        name: req.body.name,
        image: req.body.image,
        category: req.body.category,
        new_price: req.body.new_price,
        old_price: req.body.old_price,
    });

    console.log(product);
    await product.save();
    console.log("Saved");

    res.json(
       { 
        success: true,
        name: req.body.name,
      }
    );
});

//creating API for deleting Products
app.post("/removeproduct", async (req,res)=>{
    await Product.findOneAndDelete({id:req.body.id});
    console.log("Removed");
    res.json({
        success:true,
        name:req.body.name
    });
});

//creating API for getting all products
app.get("/allproducts", async (req,res)=>{
      let products = await Product.find({});
     console.log("All Products Fetched");
     res.send(products);
});

//schema creating for user model
const Users= mongoose.model("Users",{
    name:{
        type:String,  
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    },
    cartData:{
        type:Object,
    },
    date:{
        type:Date,
        default:Date.now,
    }
})

//Creating EndPoint for Registering
app.post("/signup",async(req,res)=>{
    let check = await Users.findOne({email:req.body.email});
    if(check){
        return res.status(400)
        .json({success:false,errors:"existing user found with same email address"});
    }
    let cart = {};

    for (let i = 0; i < 300; i++) {
        cart[i]=0;
        }
        
        //fetch data to Users model
        const user = new Users({
            name:req.body.username,
            email:req.body.email,
            password:req.body.password,
            cartData:cart,
        })

        await user.save();
        //creating user object
        const data = {
            user:{
                id:user.id
            }
        }
         
        //creating token
        const token = jwt.sign(data,"secret_ecom");
        res.json({success:true,token})
})

//creating endpoint for login
app.post("/login",async (req,res)=>{
    let user = await Users.findOne({email:req.body.email});
    if(user){
        const passCompare = req.body.password === user.password;
        if(passCompare){
            const data = {
                user:{
                    id:user.id
                }
            }
            const token = jwt.sign(data,"secret_ecom");
            res.json({success:true,token});
        }
        else {
          res.json({success:false,errors:"Wrong Password"});
        }

    }
    else {
        res.json({success:false,errors:"Email address DOES NOT exist"});
    }

})

//creating endpoint for newcollection data
app.get("/newcollections", async (req,res)=>{
      let products = await Product.find({});
      let newcollection = products.slice(1).slice(-8);
      console.log("NewCollection Fetched");
      res.send(newcollection);
})

//creating endpoint for Popular in women
app.get("/popularinwomen", async (req,res)=>{
    let products = await Product.find({category:"women"});
    let popular_in_women = products.slice(0,4);
    console.log("Popular in women fetch");
    res.send(popular_in_women);
})

//creating middleware to fetch user
const fetchUser = async (req,res,next)=>{
   const token = req.header("auth-token");
   if (!token){
    res.status(401).send({errors:"Please authenticate using valid token"})
   }
   else{
    try{
         const data = jwt.verify(token,"secret_ecom");
         req.user = data.user;
         next();
    } catch (error) {
        res.status(401).send({errors:"please authenticate using a valid token"})
    }
   }
}

//creating endpoint for adding products in cartdata
app.post("/addtocart",fetchUser,async (req,res)=>{
    console.log("added", req.body.itemId);
   let userData = await Users.findOne({_id:req.user.id});
   userData.cartData[req.body.itemId] += 1;
   await Users.findOneAndUpdate({_id:req.user.id}, {cartData:userData.cartData});
   res.send("Added");
    console.log(req.body,req.user);
    // res.send(popular_in_women);
})

//creating endpoint to remove product
app.post("/removefromcart", fetchUser,async(req,res)=>{
     console.log("removed", req.body.itemId);
    let userData = await Users.findOne({_id:req.user.id});
    if(userData.cartData[req.body.itemId]>0)
    userData.cartData[req.body.itemId] -= 1;
    await Users.findOneAndUpdate({_id:req.user.id}, {cartData:userData.cartData});
    res.send("Removed");
})

//creating endpoint to get cartdata
app.post("/getcart",fetchUser,async (req,res)=>{
   console.log("GetCart");
   let userData = await Users.findOne({_id:req.user.id});
   res.json(userData.cartData);
})

//listening to server/port
app.listen(port,(error)=>{
    if(!error){
        console.log("Server Running on port: "+port);
    }
    else{
        console.log("Error: "+error);
    }
})
