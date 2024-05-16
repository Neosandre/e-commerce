import React, { useContext } from 'react'
import { ShopContext } from '../Context/ShopContext'
import { useParams } from 'react-router-dom';
import Breadcrum from '../Components/Breadcrums/Breadcrum';
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay';
import DescriptionBox from '../Components/DescriptionBox/DescriptionBox';
import RelatedProducts from '../Components/RelatedProducts/RelatedProducts';

export default function Product() {
  const {all_product}= useContext(ShopContext);
  //useParams get the productId 
  //beeing passed from App.js <Route path=':productId' element={<Product></Product>}></Route>
  const {productId} = useParams();

  const product = all_product.find((e)=> e.id === Number(productId))

  // console.log("pIMAge: " + product.name)
  return (
    
    <div>
      <Breadcrum product={product}></Breadcrum>
      
      <ProductDisplay
      product={product}
      ></ProductDisplay>
      <DescriptionBox></DescriptionBox>
      <RelatedProducts></RelatedProducts>
    </div>
  )
}
