'use client'

import React, { useMemo, useState, useEffect } from 'react';
import axios from 'axios';
import '../app/globals.css';
import { useRouter } from 'next/navigation';

function MainPageAdmin() {
    const router = useRouter()
    const [items, setItems] = useState([])
    const [add,setAdd] = useState({
        title: '',
        price: 0.0,
        description: '',
        category: '',
        image: '#'
    })
    const [Query, setQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        console.log("Logged out successfully");
        router.push('/')
      };
    const apiCall= async ()=>{
        try{
            const response = await axios.get("https://fakestoreapi.com/products");
            setItems(response.data);            
        }
        catch(error){
            console.error("Error fetching products:", error);
        }
    }

    useEffect(() =>{
        const token = localStorage.getItem('authToken');
        if (!token){
            router.push('/login')
        }else{
            setIsAuthenticated(true);
            apiCall();            
        }
    },[])
    const handleChange = (e) => {
        setAdd(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleAdd = async () => {
        try {
            const response = await axios.post('https://fakestoreapi.com/products', add);
            
            setItems(prev => [...prev, response.data]); 
            
            setAdd({ title: '', price: 0.0, description: '', category: '', image: '' });
        } catch (error) {
            console.error("Error adding product:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://fakestoreapi.com/products/${id}`)
            setItems(prevItems => prevItems.filter(item => item.id !== id));
        } catch (error) {
            console.error("Error adding product:", error);
        }
    }

    const filterItems = useMemo(() => { return items.filter((item =>{
        const matchesQuery = item.title.toLowerCase().includes(Query.toLowerCase());
        const matchesCategory = selectedCategory ? item.category.toLowerCase() === selectedCategory.toLowerCase() : true;
        return matchesQuery && matchesCategory;
    }))},[items,Query, selectedCategory])

    function desc(productId){

        router.push(`/productsAdmin/${productId}`);
    }

    //     const axios = require('axios');
    //   const product = {id:21, title: 'New Product', price: 29.99 };
    //   axios.post('https://fakestoreapi.com/products', product)
    //     .then(response => console.log(response.data));
  return (
    <div className='flex flex-col items-center min-h-screen bg-gray-200  text-black'>
        <nav className="flex items-center w-full bg-blue-300 justify-between">
            <img src="/Weasydoo.png" alt="#" onClick={() => router.push('/MainPageAdmin')} className='w-32 m-5 cursor-pointer'/>
            <span onClick={handleLogout} className='text-white font-bold text-2xl rounded-full p-3 mr-10 cursor-pointer border-2 border-white  hover:bg-white hover:text-blue-400'>Logout</span>
        </nav>
        <div className="flex flex-col items-center justify-around">
            {/* welcome section */}
            <div className="flex items-center justify-center bg-[url(/display-shopping-carts-with-black-mouse-laptop-with-discount-tags-beige-background_1174726-9277.png)] w-full h-80">
                <div className="flex flex-col items-center">
                    <h1 className='text-4xl text-cyan-700 font-bold font-serif'>Welcome</h1>
                    <p className='font-bold text-center text-cyan-700 font-serif'>This is the Admin page, you can control products here.</p>                    
                </div>
            </div>
            {/* Search bar */}
            <div className="flex m-10">
                <input value={Query} onChange={(e) => setQuery(e.target.value)}  type="text" name='text' placeholder='Search for the product here' className='bg-gray-300 text-center rounded-bl-2xl rounded-2xl p-5 outline-none w-64 text-sm flex-1'/>
            </div>
            {/* add products */}
            <div className='grid grid-cols-1 md:grid-cols-6 gap-4 my-2 mb-10'>
                <input onChange={handleChange}  type="text" name='title' placeholder='Add product title' className='bg-gray-300 text-center outline-none rounded-2xl text-sm flex-1 p-3'/>
                <input onChange={handleChange}  type="price" name='price' placeholder='Add product price' className='bg-gray-300 text-center outline-none rounded-2xl text-sm flex-1 p-3'/>
                <input onChange={handleChange}  type="description" name='description' placeholder='Add product description' className='bg-gray-300 text-center rounded-2xl outline-none text-sm flex-1 p-3'/>
                <input onChange={handleChange}  type="category" name='category' placeholder='Add product category' className='bg-gray-300 text-center outline-none rounded-2xl text-sm flex-1 p-3'/>
                <input onChange={handleChange}  type="url" name='image' placeholder='Add product image' className='bg-gray-300 text-center outline-none rounded-2xl text-sm flex-1 p-3'/>
                <button onClick={handleAdd} className='p-3 text-center bg-blue-400 text-white rounded-2xl cursor-pointer'>Add</button>
            </div>
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
                             <button className='bg-red-500 border-white p-2 text-white rounded-sm cursor-pointer' onClick={() =>handleDelete(item.id)}>X</button>
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

export default MainPageAdmin