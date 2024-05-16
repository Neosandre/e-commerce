import React,{createContext} from 'react';
import { useEffect } from 'react';
// import all_product from "../Components/Assets/all_product"
import { useState } from 'react';

export const ShopContext = createContext(null);
const getDefaultCart = ()=>{
    let cart = {};

    //use this to and import all products ;index < all_product.length + 1; to use local assets
    for (let index= 0; index < 300 + 1; index++) {
        cart[index] = 0;

    }
    return cart;
}

const ShopContextProvider = (props)=>{

    //GETTING ALL PRODUCTS FROM DATABASE0
    //delete this to use assets all_product & IMPORT ALL PRODUCT
    const [all_product,setAll_product] = useState([]);


    const [cartItems, setCartItems] = useState(getDefaultCart());
    
    //delete this to use aasets all_product
    useEffect(()=>{
         fetch("http://localhost:4000/allproducts")
         .then((response)=>response.json())
         .then((data)=>setAll_product(data))
         
         //saving the get cart items to data base with sesh/token id
         if(localStorage.getItem("auth-token")){
            fetch("http://localhost:4000/getcart",{
                method:"POST",
                headers:{
                    Accept:"application/form-data",
                    "auth-token":`${localStorage.getItem("auth-token")}`,
                    "Content-Type":"application/json",

                },
                body:"",
            })
            .then((response)=>response.json())
            .then((data)=>setCartItems(data));
         }
    },[]);

    const addToCart = (itemId,i)=>{
        setCartItems((prev)=>({...prev,[itemId]:prev[itemId] + 1}));
        // console.log(cartItems)
        if(localStorage.getItem("auth-token")){
            fetch("http://localhost:4000/addtocart",{
                method:"POST",
                headers:{
                    Accept:"application/form-data",
                    "auth-token":`${localStorage.getItem("auth-token")}`,
                    "Content-Type":"application/json",
                },
                body:JSON.stringify({"itemId":itemId}),
            })
            .then((response)=>response.json())
            .then((data)=>console.log(data))
        }
    }
    const removeFromCart = (itemId)=>{
        
        setCartItems((prev)=>({...prev,[itemId]:prev[itemId] - 1}));
        if(localStorage.getItem("auth-token")){
            fetch("http://localhost:4000/removefromcart",{
                method:"POST",
                headers:{
                    Accept:"application/form-data",
                    "auth-token":`${localStorage.getItem("auth-token")}`,
                    "Content-Type":"application/json",
                },
                body:JSON.stringify({"itemId":itemId}),
            })
            .then((response)=>response.json())
            .then((data)=>console.log(data))
        }
    }


    const getTotalCartAmount = ()=> {
        let totalAmount = 0;
       

        for (const item in cartItems)
        {
    
            if( cartItems[item]> 0)
            {
                
               let itemInfo = all_product.find((product)=>product.id===Number(item));
               totalAmount += itemInfo.new_price * cartItems[item];
               
            }
         
        }
        return totalAmount;
    }

    const getTotalCartItems= () => {
          let totalItem=0;

          for (const item in cartItems){
            if(cartItems[item]>0){
                totalItem+= cartItems[item]
            }
          }
          return totalItem;
    }

    const contextValue = {getTotalCartItems,getTotalCartAmount,all_product,cartItems,addToCart,removeFromCart};
    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;