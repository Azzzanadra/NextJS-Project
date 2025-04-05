'use client'

import React, { useEffect, useMemo, useState } from 'react';
import '../app/globals.css';
import axios from 'axios';
import { useRouter } from 'next/navigation';




function MainPage() {
    const router = useRouter()
    const [items, setItems] = useState([]); 
    const [Query, setQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");

    useEffect(() =>{
        apiCall();
    },[])

    const filterItems = useMemo(() => { return items.filter((item =>{
        const matchesQuery = item.title.toLowerCase().includes(Query.toLowerCase());
        const matchesCategory = selectedCategory ? item.category.toLowerCase() === selectedCategory.toLowerCase() : true;
        return matchesQuery && matchesCategory;
    }))},[items,Query, selectedCategory])


    const apiCall= async ()=>{
        try{
            const response = await axios.get("https://fakestoreapi.com/products");
            setItems(response.data);
        }
        catch(error){
            console.error("Error fetching products:", error);
        }
    }

    function desc(productId){
        
        router.push(`/products/${productId}`);
    }
  return (
    <div className='flex flex-col items-center min-h-screen bg-gray-200  text-black'>
        <nav className="flex items-center w-full bg-blue-300 justify-between">
            <img src="/Weasydoo.png" alt="#" onClick={() => router.push('/')} className='w-32 m-5 cursor-pointer'/>
            <span onClick={() => {router.push('/login')}} className='text-white font-bold text-2xl rounded-full p-3 mr-10 cursor-pointer border-2 border-white  hover:bg-white hover:text-blue-400'>Login</span>
        </nav>
        <div className="flex flex-col items-center justify-around">
            {/* welcome section */}
            <div className="flex items-center justify-center bg-[url(/display-shopping-carts-with-black-mouse-laptop-with-discount-tags-beige-background_1174726-9277.png)] w-full h-80">
                <div className="flex flex-col items-center">
                    <h1 className='text-4xl text-cyan-700 font-bold font-serif'>Welcome</h1>
                    <p className='font-bold text-cyan-700 text-center font-serif'>This is the front page, you can search for items here.</p>                    
                </div>
            </div>
            {/* Search bar */}
            <div className="flex m-10">
                <input value={Query} onChange={(e) => setQuery(e.target.value)}  type="text" name='text' placeholder='Search for the product here' className='bg-gray-300 text-center rounded-bl-2xl rounded-2xl p-5 outline-none w-64 text-sm flex-1'/>
            </div>
            {/* sort by categories */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-3 mb-10">
            {[...new Set(items.map(item => item.category))].map((category, index) => (
                <span 
                    key={index} 
                    onClick={() => setSelectedCategory(category)} 
                    className={`p-3 text-center cursor-pointer rounded-md text-white ${
                        selectedCategory === category ? 'bg-blue-600' : 'bg-blue-400'
                    }`}
                >
                    {category}
                </span>
            ))}
            {/* clear category search */}
            {selectedCategory && (
                <button onClick={() => setSelectedCategory("")} className="bg-red-400 text-white p-2 rounded-md">
                    Clear Filter
                </button>
            )}
            </div>
            {/* items */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {items.length >0?(
                    filterItems.map((item)=>(
                        <div key={item.id} className="bg-yellow-100 p-4 shadow-md">
                            <img src={item.image} alt={item.title} loading="lazy" className="w-48 h-48 object-cover mx-auto" />
                            <h2 onClick={() => desc(item.id)} className="text-lg font-bold mt-2 cursor-pointer">{item.title}</h2>
                            <p className="text-green-700">${item.price}</p>
                            <p className='font-bold'>{item.category}</p>
                        </div>
                    ))
                ):(
                    <p>Loading products....</p>
                )}
            </div>
        </div>
    </div>
  )
}

export default MainPage