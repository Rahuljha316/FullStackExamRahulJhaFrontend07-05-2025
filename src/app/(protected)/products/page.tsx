/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import axios from "axios"
import React, { useCallback, useEffect, useState } from "react";
import ProductModal from "./components/ProductModal";

interface Product {
    _id: string,
    title: string,
    description: string,
    price: number
}

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('products');
    const [products, setProducts] = useState<Product[]>([]);
    const [carts, setCarts] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [page, setPage] = useState<number>(1);
    const [total, setTotal] = useState<number>(0);
    const [search, setSearch] = useState<string>("");
    const [limit, setLimit] = useState<number>(5);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    
    const fetchProducts = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`https://fullstackexamrahuljhabackend07-05-2025.onrender.com/api/products`, {
                headers: { "Authorization": `Bearer ${token}` },
                params: { page, limit, search }
            });
            setProducts(response.data.data);
            setTotal(response.data.total);
        } catch (error) {
            console.log(error, 'error');
        }
    },[limit, page, search]);

    
    const fetchCarts = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`https://fullstackexamrahuljhabackend07-05-2025.onrender.com/api/carts`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            setCarts([response.data.data])
        } catch (error) {
            console.log(error, 'error');
        }
    };

    
    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`https://fullstackexamrahuljhabackend07-05-2025.onrender.com/api/orders`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            setOrders(response.data.data);
        } catch (error) {
            console.log(error, 'error');
        }
    };
    const handleRemoveItem = async (cartItemId: string) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`https://fullstackexamrahuljhabackend07-05-2025.onrender.com/api/carts/item/${cartItemId}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            
            fetchCarts();
        } catch (error) {
            console.log('Error removing item from cart:', error);
        }
    };
    
    const handleCheckout = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`https://fullstackexamrahuljhabackend07-05-2025.onrender.com/api/carts/checkout`, {}, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            
            alert(`Order placed successfully! Order ID: ${response.data.orderId}`);
            fetchCarts()
        } catch (error) {
            console.log('Error during checkout:', error);
        }
    };
    

    useEffect(() => {
        if(activeTab ==="carts"){
            fetchCarts();

        }
        if(activeTab ==="orders"){
            fetchOrders();

        }
        if(activeTab ==="products"){
            fetchProducts();

        }
    }, [page, search, limit, activeTab, fetchProducts]);

    const columns: ColumnDef<Product>[] = [
        { accessorKey: 'title', header: 'Title' },
        { accessorKey: 'description', header: 'Description' },
        { accessorKey: 'price', header: 'Price' },
    ];

    const table = useReactTable({
        data: products,
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        pageCount: Math.ceil(total / limit),
    });

    return (
        <div className="flex flex-col gap-4 justify-center items-center">
            <h1 className="font-bold text-2xl">Dashboard</h1>

            
            <div className="flex gap-4">
                <Button onClick={() => setActiveTab('products')}>Products</Button>
                <Button onClick={() => setActiveTab('carts')}>Carts</Button>
                <Button onClick={() => setActiveTab('orders')}>Orders</Button>
            </div>

            
            {activeTab === 'products' && (
                <div className="flex flex-col gap-4">
                    <Input
                        placeholder="Search by title"
                        className="w-1/2"
                        value={search}
                        onChange={(e) => {
                            setPage(1);
                            setSearch(e.target.value);
                        }}
                    />
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map(headerGroup => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <TableHead key={header.id}>
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows.map(row => (
                                <TableRow key={row.id} onClick={() => {
                                    const product = row.original;
                                    setSelectedProduct(product);
                                    setModalOpen(true);
                                }} className="cursor-pointer hover:bg-gray-100">
                                    {row.getVisibleCells().map(cell => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    
                    <div className="flex items-center gap-4 mt-4">
                        <label htmlFor="limit">Rows per page:</label>
                        <select
                            id="limit"
                            value={limit}
                            onChange={(e) => {
                                setLimit(Number(e.target.value));
                                setPage(1);
                            }}
                            className="border px-2 py-1 rounded"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                        </select>
                        <Button
                            disabled={page === 1}
                            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                        >
                            Prev
                        </Button>
                        <span>Page {page}</span>
                        <Button
                            disabled={page >= Math.ceil(total / limit)}
                            onClick={() => setPage(prev => prev + 1)}
                        >
                            Next
                        </Button>
                    </div>

                    
                    {modalOpen && (
                        <ProductModal
                            product={selectedProduct}
                            onClose={() => setModalOpen(false)}
                            onUpdated={fetchProducts}
                        />
                    )}
                </div>
            )}

            {activeTab === 'carts' && (
                <div>
                    
                    {carts?.length === 0 ? <p>No carts available.</p> : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product Title</TableHead>
                                    <TableHead>price</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {carts?.map((cart) => (
                                     <React.Fragment key={cart._id}>
                                     {cart.items.map((item: { _id: React.Key | null | undefined; productId: { title: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; price: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; _id: string; }; quantity: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }) => (
                                         <TableRow key={item._id}>
                                             <TableCell>{item.productId.title}</TableCell> 
                                             <TableCell>{item.productId.price}</TableCell> 
                                             <TableCell>{item.quantity}</TableCell> 
                                             <TableCell>
                                        <Button onClick={() => handleRemoveItem(item.productId._id)}>
                                            Remove
                                        </Button>
                                    </TableCell>
                                         </TableRow>
                                     ))}
                                 </React.Fragment>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                    <Button onClick={handleCheckout}>Checkout</Button>
                </div>
            )}

{activeTab === 'orders' && (
    <div>
        {orders.length === 0 ? (
            <p>No orders found.</p>
        ) : (
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Product ID</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Total Amount</TableHead>
                        <TableHead>Placed At</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.map(order =>
                        order.OrderItems.map((item: { productId: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; quantity: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }, index: any) => (
                            <TableRow key={`${order.id}-${index}`}>
                                <TableCell>{order.id}</TableCell>
                                <TableCell>{item.productId}</TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell>{order.totalAmount}</TableCell>
                                <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        )}
    </div>
)}

        </div>
    );
}
