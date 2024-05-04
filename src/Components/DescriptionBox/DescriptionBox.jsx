import React from 'react'
import "./DescriptionBox.css"

export default function DescriptionBox() {
  return (
    <div className='descriptionbox'>
      <div className="descriptionbox-navigator">
        <div className="descriptionbox-nav-box">Description</div>
        <div className="descriptionbox-nav-box fade">Reviews (122)</div>
      </div>
      <div className="descriptionbox-description">
        <p>The market forecasts regarding fashion e-retail are more than positive: fashion is one of the largest 
        B2C market segments estimated at $525.1 billion in 2019 and 
        predicted to grow further at 9.4% per year. Such a pace 
        will attract about $953.1 billion by the end of 2024. 
        While consumer demand is sustainably high, all market entrants 
        face a challenge of standing out in the competition and winning 
        lasting trust and interest of customers.</p>

        <p>
        Essentially, social media is where you build the personality of 
        your brand and a community of interested customers. 
        Adding social buttons to your ecommerce pages, 
        you encourage prospects to move to social channels and 
        get to know your brand and team before purchasing. 
        Also, you can integrate user-generated content 
        (customer reviews and comments) from your social 
        channels to the website – it will serve as an excellent 
        trust builder for new shoppers.
        </p>
      </div>
    </div>
  )
}
