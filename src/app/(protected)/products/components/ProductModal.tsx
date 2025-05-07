'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
}

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onUpdated: () => void;
}

export default function ProductModal({ product, onClose, onUpdated }: ProductModalProps) {
  const [form, setForm] = useState<Product>({
    _id: product?._id || '',
    title: product?.title || '',
    description: product?.description || '',
    price: product?.price || 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

//   const handleUpdate = async () => {
//     try{
//         const token = localStorage.getItem('token')
//         await axios.put(`https://fullstackexamrahuljhabackend07-05-2025.onrender.com/api/products/api/products/${form._id}`, form,{
//             headers: {
//             "Authorization": `Bearer ${token}`
//         }});
//         onUpdated();
//         onClose();
//     }catch (error) {
//             console.log(error, 'error')
//         }
    
//   };

//   const handleDelete = async () => {
//     try{
//         const token = localStorage.getItem('token')
//         await axios.delete(`https://fullstackexamrahuljhabackend07-05-2025.onrender.com/api/products/api/products/${form._id}`,{
//             headers: {
//             "Authorization": `Bearer ${token}`
//         }});
//         onUpdated();
//         onClose();
//     }catch (error) {
//             console.log(error, 'error')
//         }
    
//   };

const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:8888/api/carts`,
        { productId: form._id, quantity: 1 },
        {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      );
      alert("Added to cart");
    } catch (error) {
      console.log(error, 'error');
    }
  };
  

  if (!product) return null;

  return (
    <div className="fixed  flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md space-y-4">
        <h2 className="text-xl font-bold">Edit Product</h2>
        <Input name="title" value={form.title} onChange={handleChange} placeholder="Title" />
        <Input name="description" value={form.description} onChange={handleChange} placeholder="Description" />
        <Input name="price" value={form.price} onChange={handleChange} type="number" placeholder="Price" />
        <div className="flex gap-4 justify-end mt-4">
          {/* <Button onClick={handleUpdate}>Update</Button>
          <Button variant="destructive" onClick={handleDelete}>Delete</Button> */}
          <Button onClick={handleAddToCart}>Add to Cart</Button> 
          <Button variant="outline" onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </div>
  );
}
