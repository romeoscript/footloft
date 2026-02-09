"use client";
import React, { useContext, useEffect, useState } from 'react'
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ShopContext } from '@/context/ShopContext'
import Title from '@/components/Title';

interface OrderItem {
    id: string;
    productId: string;
    product: {
        name: string;
        images: string[];
    };
    price: number;
    quantity: number;
    size: string;
    status: string;
    payment: string;
    paymentStatus: boolean;
    date: string;
}

interface Order {
    id: string;
    status: string;
    paymentMethod: string;
    paymentStatus: boolean;
    createdAt: string;
    items: OrderItem[];
}

import { Suspense } from 'react';

const OrdersContent = () => {
    const searchParams = useSearchParams();
    const receiptSent = searchParams.get('receipt') === 'sent';
    const { currency } = useContext(ShopContext);
    const [orderData, setOrderData] = useState<OrderItem[]>([]);
    const [unauthorized, setUnauthorized] = useState(false);

    const loadOrderData = async () => {
        setUnauthorized(false);
        try {
            const response = await fetch('/api/orders');
            const data = await response.json();
            if (response.status === 401) {
                setUnauthorized(true);
                return;
            }
            if (data && !data.error) {
                const allOrdersItem: OrderItem[] = [];
                data.map((order: Order) => {
                    order.items.map((item: OrderItem) => {
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

            {receiptSent && (
                <div className='mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm'>
                    Your receipt has been sent to your email.
                </div>
            )}

            {unauthorized && (
                <div className='mt-4 p-4 bg-slate-50 border border-slate-200 rounded-lg text-slate-700'>
                    <p className='font-medium'>Sign in to see your orders here.</p>
                    <p className='mt-1 text-sm text-slate-600'>You can still shop as a guest; we’ll send your receipt to your email.</p>
                    <Link href='/login' className='inline-block mt-3 text-sm font-medium text-black underline'>Sign in</Link>
                </div>
            )}

            <div>
                {orderData.map((item, index) => (
                    <div key={index} className='py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                        <div className='flex items-start gap-6 text-sm '>
                            {item.product?.images?.[0] && (
                                <Image className='w-16 sm:w-20' src={item.product.images[0]} alt={item.product?.name} width={80} height={100} />
                            )}
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

const Orders = () => {
    return (
        <Suspense fallback={<div className='min-h-[60vh] flex items-center justify-center'>Loading...</div>}>
            <OrdersContent />
        </Suspense>
    )
}

export default Orders
