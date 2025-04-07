"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

function Page() {
  const params = useParams();
  const id = params.id; //gets the id from the url
  const router = useRouter() //handles routing

  const [product, setProduct] = useState(null); //the product's variables stored here
  const [update,setUpdate] = useState({}); //stores the update inputs
  const [isAuthenticated, setIsAuthenticated] = useState(false); //authentification variable

  //code that runs when page is loaded  
  useEffect(() => {
    if (id) {
      fetchProduct();
    }
    const token = localStorage.getItem('authToken'); //get the login token from local storage
    if (!token){
        router.push('/login') //route to login page if not logged in
    }else{
        setIsAuthenticated(true);
    }
  }, [id],[]);

  //function that handles logging out  
  const handleLogout = () => {
    localStorage.removeItem("authToken"); //remove the login token from local storage
    console.log("Logged out successfully");
    router.push('/') //route to the main page
  };

  //handles changes in input values
  const handleChange = (e) => {
    setUpdate(prev => ({
        ...prev,
        [e.target.name]: e.target.value || undefined
    }));
  };

  //function that handles the updating of product's details
  const handleUpdate = async () =>{
    if (!product || Object.keys(update).length === 0) return; // Don't update if no changes
    try{
      const response = await axios.put(`https://fakestoreapi.com/products/${id}`, {...product,...update});
      setProduct(response.data); //update the product variable 
      setUpdate({});
    }catch (error) {
      console.error("Error fetching product:", error);
    }
  }

  //function that gets the product's details
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
          <span onClick={handleLogout} className='text-white font-bold text-2xl rounded-full p-3 mr-10 cursor-pointer border-2 border-white  hover:bg-white hover:text-blue-400'>Logout</span>
      </nav>
      {/* updating inputs */}
      <div className="flex flex-row gap-4 mt-10 max-md:flex-col">
        <input
          type="text" name="title" placeholder="Update product title" onChange={handleChange} className="bg-gray-100 outline-none text-sm p-2 rounded-2xl"
        />
        <input
          type="number" name="price" placeholder="Update product price" onChange={handleChange} className="bg-gray-100 outline-none text-sm p-2 rounded-2xl"
        />
        <textarea
          name="description" placeholder="Update product description" onChange={handleChange} className="bg-gray-100 outline-none text-sm p-2 rounded-2xl"
        />
        <input
          type="url" name="image" placeholder="Update product image URL" onChange={handleChange} className="bg-gray-100 outline-none text-sm p-2 rounded-2xl"
        />
        <input
          type="text" name="category" placeholder="Update product category" onChange={handleChange} className="bg-gray-100 outline-none text-sm p-2 rounded-2xl"
        />
        <button onClick={handleUpdate} className="p-4 bg-blue-400 text-white cursor-pointer rounded-2xl">
          Update Product
        </button>
      </div>
      {/* product's details */}
      <div className="flex flex-row items-center gap-5 my-20 bg-amber-300 p-10 max-md:flex-col">
        <img src={product.image} alt={product.title} loading="lazy" className="w-128 h-128 object-cover max-md:w-64 max-md:h-64" />
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold mb-4 max-md:text-2xl">{product.title}</h1>
          <p className="text-lg mt-4">{product.description}</p>
          <p className="text-2xl text-blue-600 mt-2">Category:{product.category}</p>
          <p className="text-2xl text-green-600 mt-2">Price: ${product.price}</p>
          <p className="text-2xl text-yellow-600 mt-2">Rating: 3/5</p>
          <h2 className="text-lg mt-4">Review: Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit earum quam eum, quos accusantium quibusdam repellat similique ipsam id consectetur in saepe ex sed inventore obcaecati architecto consequatur quo facere.</h2>        
        </div>
      </div>
    </div>
  )
}

export default Page