
import './App.css';
import Navbar from './Components/Navbar/Navbar';
import {BrowserRouter,Routes,Route, Navigate } from 'react-router-dom';
import Shop from "./Pages/Shop";
import ShopCategory from "./Pages/ShopCaterory";
import Product from "./Pages/Product";
import Cart from "./Pages/Cart";
import LoginSignup from "./Pages/LoginSignup";
import { redirect } from "react-router-dom";
function App() {
  return (
    <div >
    <BrowserRouter>
    <Navbar></Navbar>

   <Routes>
   
   
    <Route path='/' element={<Shop></Shop>}></Route>
    <Route path='/men' element={<ShopCategory category="men"></ShopCategory>}></Route>
    <Route path='/women' element={<ShopCategory category="women"></ShopCategory>}></Route>
    <Route path='/kids' element={<ShopCategory category="kids"></ShopCategory>}></Route>
   <Route path='/product' element={<Product></Product>}>
     <Route path=':productId' element={<Product></Product>}></Route>
   </Route>
   <Route path='/cart'  element={<Cart></Cart>}></Route>
   <Route path='/login' element={<LoginSignup></LoginSignup>}></Route>

   
   </Routes>
   

    </BrowserRouter>
    
    </div>
  );
}

export default App;
