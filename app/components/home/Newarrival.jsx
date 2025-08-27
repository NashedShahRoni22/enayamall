"use client";
import React, { useState } from 'react'
import Container from '../shared/Container'
import VerticalProductCard from '../shared/cards/VerticalProductCard'
import { useAppContext } from '@/app/context/AppContext';

export default function Newarrival() {
    const { categories } = useAppContext();
    const [activeCategory, setActiveCategory] = useState('featured');

    return (
        <Container>
            <div className="py-10 md:py-20">
                {/* Header with View All */}
                <div className="flex justify-between items-center mb-8 md:mb-12">
                    <h5 className="text-xl md:text-3xl font-semibold text-gray-800">
                        <span className="text-primary">New</span> Arrival
                    </h5>
                    <button className="text-gray-600 hover:text-primary text-sm font-medium">
                        View All
                    </button>
                </div>

                {/* Category Tabs */}
                <div className="mb-8 md:mb-12">
                    {/* Mobile Dropdown */}
                    <div className="md:hidden mb-6">
                        <select
                            value={activeCategory}
                            onChange={(e) => setActiveCategory(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                        >
                            {categories?.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Desktop Tabs */}
                    <div className="hidden md:flex gap-2 overflow-x-auto">
                        {categories?.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setActiveCategory(category.id)}
                                className={`px-4 lg:px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${activeCategory === category.id
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
                    {
                        Array(4).fill(0).map((_, index) => <VerticalProductCard key={index} />)
                    }
                </div>
            </div>
        </Container>
    )
}