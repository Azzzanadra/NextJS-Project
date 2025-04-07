"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

function Page() {

  const params = useParams();
  const router = useRouter(); //handles routing
  const id = params.id;  //gets the id from the url
  const [product, setProduct] = useState(null); //the product's variables stored here

  //code that runs when page is loaded
  useEffect(() => {
    if (id) {
      fetchProduct(); //if the id exists, run this function
    }
  }, [id]);

  //fetches the product's data
  const fetchProduct = async () => {
    try {
      const response = await axios.get(`https://fakestoreapi.com/products/${id}`);
      setProduct(response.data); //puts the product's object in the product variable
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  //returns a loading screen until the product is loaded
  if (!product) return <p className="text-center">Loading product details...</p>;

  return (
    <div className="flex flex-col items-center min-h-screen bg-amber-300  text-black">
      {/* nav bar */}
      <nav className="flex items-center w-full bg-blue-300 justify-between">
          <img src="/Weasydoo.png" alt="#" onClick={() => router.push('/MainPageAdmin')} className='w-32 m-5 cursor-pointer'/>
          <span onClick={() => {router.push('/login')}} className='text-white font-bold text-2xl rounded-full p-3 mr-10 cursor-pointer border-2 border-white  hover:bg-white hover:text-blue-400'>Login</span>
      </nav>
      {/* product's details */}
      <div className="flex flex-row items-center gap-5 my-20 bg-amber-300 p-10 max-md:flex-col">
        <img src={product.image} alt={product.title} loading="lazy" className="w-128 h-128 object-cover max-md:w-64 max-md:h-64" />
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold mb-4 max-md:text-2xl">{product.title}</h1>
          <p className="text-lg mt-4">{product.description}</p>
          <p className="text-2xl text-green-600 mt-2">Price: ${product.price}</p>
          <p className="text-2xl text-blue-600 mt-2">Category:{product.category}</p>
          <p className="text-2xl text-yellow-600 mt-2">Rating: 3/5</p>
          <h2 className="text-lg mt-4">Review: Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit earum quam eum, quos accusantium quibusdam repellat similique ipsam id consectetur in saepe ex sed inventore obcaecati architecto consequatur quo facere.</h2>       
        </div>
      </div>
    </div>
  )
}

export default Page