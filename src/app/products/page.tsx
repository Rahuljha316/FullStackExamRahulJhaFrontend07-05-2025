'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import axios from "axios"
import { useEffect, useState } from "react";


interface Product{
    _id: string,
    title: string,
    description:string,
    price: number
}
export default function Products( ){
    const [products, setProducts] = useState<Product[]>([]);
    const [page,setPage] = useState<number>(1)
    const [total,setTotal] = useState<number>(0)
    const [search, setSearch]= useState<string>("");
    const [limit, setLimit] =useState<number>(5);

    const fetchProducts = async () =>{
        try{
            const token = localStorage.getItem('token')
            const response = await axios.get(`http://localhost:8888/api/products`,{
                headers:{
                    "Authorization": `Bearer ${token}`
                },params: {
                    page,
                    limit,
                    search
                  }
            });
            // console.log(response)
            setProducts(response.data.data)
            setTotal(response.data.total);

        }catch(error){
            console.log(error, 'error')
        }
    }
    
    useEffect(() => {
        fetchProducts()
    },[page,search, limit])

    const columns: ColumnDef<Product>[] =[
        {accessorKey:'title', header: 'title',},
        { accessorKey: 'description', header: 'Description' },
        { accessorKey: 'price', header: 'Price' },
    ]
    const table = useReactTable({
        data:products,
        columns,
        getCoreRowModel:getCoreRowModel(),
        manualPagination: true,
    pageCount: Math.ceil(total / limit),
    })
    return (
        <div className="flex flex-col gap-4 justify-center items-center">
            <h1 className="font-bold text-2xl">Products</h1>
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
                        <TableRow key={row.id}>
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
            </div>

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
        </div>
    )
}