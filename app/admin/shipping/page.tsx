"use client";

import React, { useEffect, useState } from "react";
import { getShippingRates, upsertShippingRate, deleteShippingRate } from "@/app/actions";
import { toast } from "react-toastify";

interface ShippingRate {
    id: string;
    state: string;
    rate: number;
}

const NIGERIAN_STATES = [
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
    "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT (Abuja)", "Gombe",
    "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos",
    "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto",
    "Taraba", "Yobe", "Zamfara"
];

const ShippingManagement = () => {
    const [rates, setRates] = useState<ShippingRate[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedState, setSelectedState] = useState("");
    const [rateValue, setRateValue] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const fetchRates = async () => {
        try {
            const data = await getShippingRates();
            setRates(data as ShippingRate[]);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load shipping rates");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRates();
    }, []);

    const handleUpsert = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedState || !rateValue) {
            toast.error("Please select a state and enter a rate");
            return;
        }

        setSubmitting(true);
        try {
            await upsertShippingRate(selectedState, parseFloat(rateValue));
            toast.success("Shipping rate updated successfully");
            setRateValue("");
            setSelectedState("");
            fetchRates();
        } catch (err) {
            console.error(err);
            toast.error("Failed to update shipping rate");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this shipping rate?")) return;

        try {
            await deleteShippingRate(id);
            toast.success("Shipping rate deleted");
            fetchRates();
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete shipping rate");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8">
            <h1 className="text-2xl font-bold text-gray-800">Shipping Rates Management</h1>

            {/* Add/Edit Form */}
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                <h2 className="text-lg font-semibold mb-4 text-gray-700">Add or Update Shipping Rate</h2>
                <form onSubmit={handleUpsert} className="flex flex-col sm:flex-row gap-4 items-end">
                    <div className="flex flex-col gap-1 flex-1">
                        <label className="text-sm font-medium text-gray-600">State</label>
                        <select
                            value={selectedState}
                            onChange={(e) => setSelectedState(e.target.value)}
                            className="border border-slate-300 rounded-md p-2 bg-white focus:outline-none focus:ring-2 focus:ring-black"
                            required
                        >
                            <option value="">Select State</option>
                            {NIGERIAN_STATES.map((state) => (
                                <option key={state} value={state}>
                                    {state}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col gap-1 flex-1">
                        <label className="text-sm font-medium text-gray-600">Rate (₦)</label>
                        <input
                            type="number"
                            value={rateValue}
                            onChange={(e) => setRateValue(e.target.value)}
                            placeholder="Enter shipping fee"
                            className="border border-slate-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="bg-black text-white px-8 py-2 rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                        {submitting ? "Saving..." : "Save Rate"}
                    </button>
                </form>
            </div>

            {/* Rates Table */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-gray-50">
                    <h2 className="text-lg font-bold text-gray-800">Existing Shipping Rates</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">State</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rate (₦)</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {rates.length > 0 ? (
                                rates.map((rate) => (
                                    <tr key={rate.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 text-sm text-gray-700 font-medium">{rate.state}</td>
                                        <td className="p-4 text-sm font-semibold text-black">₦{rate.rate.toLocaleString()}</td>
                                        <td className="p-4 text-sm text-right">
                                            <button
                                                onClick={() => {
                                                    setSelectedState(rate.state);
                                                    setRateValue(rate.rate.toString());
                                                }}
                                                className="text-blue-600 hover:text-blue-800 mr-4 font-medium"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(rate.id)}
                                                className="text-red-600 hover:text-red-800 font-medium"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className="p-8 text-center text-gray-400 italic">
                                        No specific shipping rates configured. Worldwide default will be used.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ShippingManagement;
