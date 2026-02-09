"use client";
import React, { useContext, useEffect, useState } from 'react'
import Image from 'next/image';
import { ShopContext } from '@/context/ShopContext'
import Title from '@/components/Title';

interface Product {
    _id: string;
    name: string;
    price: number;
    image: string[];
}

const Orders = () => {

    const { currency } = useContext(ShopContext);
    const [orderData, setOrderData] = useState([]);

    const loadOrderData = async () => {
        try {
            const response = await fetch('/api/orders');
            const data = await response.json();
            if (data && !data.error) {
                let allOrdersItem = [];
                data.map((order) => {
                    order.items.map((item) => {
                        item['status'] = order.status;
                        item['payment'] = order.paymentMethod;
                        item['paymentStatus'] = order.paymentStatus;
                        item['date'] = order.createdAt;
                        allOrdersItem.push(item);
                    })
                })
                setOrderData(allOrdersItem.reverse());
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        loadOrderData();
    }, []);

    return (
        <div className='border-t pt-16'>

            <div className='text-2xl'>
                <Title text1={'MY'} text2={'ORDERS'} />
            </div>

            <div>
                {orderData.map((item, index) => (
                    <div key={index} className='py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                        <div className='flex items-start gap-6 text-sm '>
                            <Image className='w-16 sm:w-20' src={item.product?.images?.[0]} alt={item.product?.name} width={80} height={100} />
                            <div>
                                <p className='sm:text-base font-medium'>{item.product?.name}</p>
                                <div className='flex items-center gap-3 mt-2 text-base text-gray-700'>
                                    <p className='text-lg'>{currency}{item.price}</p>
                                    <p>Quantity: {item.quantity}</p>
                                    <p>Size: {item.size}</p>
                                </div>
                                <p className='mt-2'>Date: <span className='text-gray-400'>{new Date(item.date).toDateString()}</span></p>
                                <p className='mt-2'>Payment: <span className='text-gray-400'>{item.payment}</span></p>
                            </div>
                        </div>
                        <div className='md:w-1/2 flex justify-between'>
                            <div className='flex items-center gap-2'>
                                <p className={`min-w-2 h-2 rounded-full ${item.status === 'Pending' ? 'bg-orange-500' : 'bg-green-500'}`}></p>
                                <p className='text-sm md:text-base'>{item.status}</p>
                            </div>
                            <button onClick={loadOrderData} className='border px-4 py-2 text-sm font-medium rounded-sm'>Track Order</button>
                        </div>

                    </div>
                ))}
            </div>


        </div>
    )
}

export default Orders
