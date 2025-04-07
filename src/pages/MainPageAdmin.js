'use client'

import React, { useMemo, useState, useEffect } from 'react';
import axios from 'axios';
import '../app/globals.css';
import { useRouter } from 'next/navigation';

function MainPageAdmin() {
    const router = useRouter() //handles routing
    const [items, setItems] = useState([]) //variable to store the products
    const [add,setAdd] = useState({
        title: '',
        price: 0.0,
        description: '',
        category: '',
        image: '#'
    }) //variable for adding a new product
    const [Query, setQuery] = useState(""); //variable for handling search filter
    const [selectedCategory, setSelectedCategory] = useState(""); //variale for categories
    const [isAuthenticated, setIsAuthenticated] = useState(false); //for authentification

    //function that handles logging out
    const handleLogout = () => {
        localStorage.removeItem("authToken"); //remove the login token from local storage
        console.log("Logged out successfully");
        router.push('/'); //route to the main page
    };
    
    //function that calls all product from the API    
    const apiCall= async ()=>{
        try{
            const response = await axios.get("https://fakestoreapi.com/products");
            setItems(response.data); //puts the products in the items variable.       
        }
        catch(error){
            console.error("Error fetching products:", error);
        }
    }

    //code that runs when the page loads
    useEffect(() =>{
        const token = localStorage.getItem('authToken'); //finds the login token in local storage
        if (!token){
            router.push('/login') //route to login page if login token doesn't exist
        }else{
            setIsAuthenticated(true);
            apiCall();
        }
    },[])

    //handles changes in input values
    const handleChange = (e) => {
        setAdd(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    //function that handles adding new products
    const handleAdd = async () => {
        try {
            const response = await axios.post('https://fakestoreapi.com/products', add);
            setItems(prev => [...prev, response.data]); //add the new product
            setAdd({ title: '', price: 0.0, description: '', category: '', image: '' }); //reset the add variable
        } catch (error) {
            console.error("Error adding product:", error);
        }
    };

    //function that handles deleting the product
    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://fakestoreapi.com/products/${id}`)
            setItems(prevItems => prevItems.filter(item => item.id !== id)); //filter the product from the products list
        } catch (error) {
            console.error("Error adding product:", error);
        }
    }

    //handles items filtering for search bar and categories
    const filterItems = useMemo(() => { return items.filter((item =>{
        const matchesQuery = item.title.toLowerCase().includes(Query.toLowerCase()); //for the search bar
        const matchesCategory = selectedCategory ? item.category.toLowerCase() === selectedCategory.toLowerCase() : true;
        return matchesQuery && matchesCategory; //for the categories
    }))},[items,Query, selectedCategory])

    //function that routes to the specific product's page    
    function desc(productId){
        router.push(`/productsAdmin/${productId}`);
    }

  return (
    <div className='flex flex-col items-center min-h-screen bg-gray-200  text-black'>
        {/* nav bar */}
        <nav className="flex items-center w-full bg-blue-300 justify-between">
            <img src="/Weasydoo.png" alt="#" onClick={() => router.push('/MainPageAdmin')} className='w-32 m-5 cursor-pointer'/>
            <span onClick={handleLogout} className='text-white font-bold text-2xl rounded-full p-3 mr-10 cursor-pointer border-2 border-white  hover:bg-white hover:text-blue-400'>Logout</span>
        </nav>
        <div className="flex flex-col items-center justify-around">
            {/* welcome section */}
            <div className="flex items-center justify-center bg-blue-200 w-full h-80">
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