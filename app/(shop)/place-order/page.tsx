"use client";
import React, { useContext, useState } from 'react'
import Title from '@/components/Title'
import CartTotal from '@/components/CartTotal'
import { ShopContext } from '@/context/ShopContext'
import { placeOrder } from '@/app/actions'
import { toast } from 'react-toastify'

const PlaceOrder = () => {
    const [method, setMethod] = useState<'paystack' | 'cod'>('paystack');
    const [submitting, setSubmitting] = useState(false);
    const { navigate, cartItems, getCartAmount, delivery_fee, products } = useContext(ShopContext);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
        phone: ''
    });

    const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.name;
        const value = event.target.value;
        setFormData(data => ({ ...data, [name]: value }));
    }

    const onSubmitHandler = async (event: React.FormEvent) => {
        event.preventDefault();
        setSubmitting(true);
        try {
            const orderItems: Array<{ productId: string; quantity: number; size: string; price: number }> = [];

            for (const items in cartItems) {
                for (const item in cartItems[items]) {
                    if (cartItems[items][item] > 0) {
                        const itemInfo = structuredClone(products.find((product: { _id: string }) => product._id === items));
                        if (itemInfo) {
                            itemInfo.size = item;
                            itemInfo.quantity = cartItems[items][item];
                            orderItems.push({
                                productId: itemInfo._id,
                                quantity: itemInfo.quantity,
                                size: itemInfo.size,
                                price: itemInfo.price
                            });
                        }
                    }
                }
            }

            const amount = getCartAmount() + delivery_fee;
            if (orderItems.length === 0 || amount <= 0) {
                toast.error("Your cart is empty");
                setSubmitting(false);
                return;
            }

            if (method === 'paystack') {
                const res = await fetch('/api/paystack/initialize', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        amount,
                        email: formData.email,
                        address: formData,
                        items: orderItems,
                    }),
                });
                const data = await res.json();
                if (!res.ok) {
                    toast.error(data.error || 'Failed to start payment');
                    setSubmitting(false);
                    return;
                }
                if (data.authorization_url) {
                    toast.success("Redirecting to Paystack...");
                    window.location.href = data.authorization_url;
                    return;
                }
                toast.error("Invalid response from payment");
                setSubmitting(false);
                return;
            }

            const orderData = {
                address: formData,
                items: orderItems,
                amount,
                paymentMethod: method,
            };
            const result = await placeOrder(orderData);
            if (result.success) {
                toast.success("Order placed successfully!");
                navigate('/orders');
            } else {
                toast.error(result.error || "Failed to place order");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred while placing order");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>

            <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>

                <div className='text-xl sm:text-2xl my-3'>
                    <Title text1={'DELIVERY'} text2={'INFORMATION'} />
                </div>
                <div className='flex gap-3'>
                    <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='First name' />
                    <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Last name' />
                </div>
                <input required onChange={onChangeHandler} name='email' value={formData.email} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="email" placeholder='Email address' />
                <input required onChange={onChangeHandler} name='street' value={formData.street} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Street' />
                <div className='flex gap-3'>
                    <input required onChange={onChangeHandler} name='city' value={formData.city} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='City' />
                    <input required onChange={onChangeHandler} name='state' value={formData.state} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='State' />
                </div>
                <div className='flex gap-3'>
                    <input required onChange={onChangeHandler} name='zipcode' value={formData.zipcode} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Zipcode' />
                    <input required onChange={onChangeHandler} name='country' value={formData.country} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Country' />
                </div>
                <input required onChange={onChangeHandler} name='phone' value={formData.phone} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Phone' />
            </div>

            <div className='mt-8'>

                <div className='mt-8 min-w-80'>
                    <CartTotal />
                </div>

                <div className='mt-12'>
                    <Title text1={'PAYMENT'} text2={'METHOD'} />
                    <div className='flex gap-3 flex-col lg:flex-row'>
                        <div onClick={() => setMethod('paystack')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer rounded border-gray-200 hover:border-black transition-colors'>
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'paystack' ? 'bg-green-400' : ''}`}></p>
                            <span className='text-sm font-medium text-gray-800 mx-2'>Pay with Paystack</span>
                            <span className='text-xs text-gray-500'>(Card, Bank, USSD)</span>
                        </div>
                        <div onClick={() => setMethod('cod')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer rounded border-gray-200 hover:border-black transition-colors'>
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-400' : ''}`}></p>
                            <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
                        </div>
                    </div>
                    <div className='w-full text-end mt-8'>
                        <button type='submit' disabled={submitting} className='bg-black text-white px-16 py-3 text-sm disabled:opacity-60'>{(submitting && method === 'paystack') ? 'Redirecting...' : 'PLACE ORDER'}</button>
                    </div>

                </div>

            </div>

        </form>
    )
}

export default PlaceOrder
