'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import axios from "axios"
import React, { useEffect, useState } from "react";
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

    
    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:8888/api/products`, {
                headers: { "Authorization": `Bearer ${token}` },
                params: { page, limit, search }
            });
            setProducts(response.data.data);
            setTotal(response.data.total);
        } catch (error) {
            console.log(error, 'error');
        }
    };

    
    const fetchCarts = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:8888/api/carts`, {
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
            const response = await axios.get(`http://localhost:8888/api/orders`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            setOrders(response.data);
        } catch (error) {
            console.log(error, 'error');
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCarts();
        fetchOrders();
    }, [page, search, limit]);

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
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {carts?.map((cart) => (
                                     <React.Fragment key={cart._id}>
                                     {cart.items.map((item) => (
                                         <TableRow key={item._id}>
                                             <TableCell>{item.productId.title}</TableCell> 
                                             <TableCell>{item.productId.price}</TableCell> 
                                             <TableCell>{item.quantity}</TableCell> 
                                             
                                         </TableRow>
                                     ))}
                                 </React.Fragment>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>
            )}

            {activeTab === 'orders' && (
                <div>
                    
                    {orders?.length === 0 ? <p>No orders found.</p> : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order ID</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders?.map((order) => (
                                    <TableRow key={order._id}>
                                        <TableCell>{order._id}</TableCell>
                                        <TableCell>{order.status}</TableCell>
                                        <TableCell>{order.total}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>
            )}
        </div>
    );
}
