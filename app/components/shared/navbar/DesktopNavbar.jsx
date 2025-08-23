"use client";
import { ChevronDown, Heart, Menu, Phone, Search, ShoppingBag, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Container from "../Container";
import CategoryDropdown from "./CategoryDropdown";

export default function DesktopNavbar({ logo }) {
    const [showCategories, setShowCategories] = useState(false);
    const [showAllCategories, setShowAllCategories] = useState(false);
    return (
        <div className="hidden lg:block">
            <Container>
                {/* Top section */}
                <div className="flex justify-between py-5">
                    {/* Logo */}
                    <Image src={logo} height={50} width={200} alt="Logo" />

                    {/* Search */}
                    <div className="flex items-center gap-4 bg-gray-100 px-5 rounded-full max-w-md flex-1 mx-8">
                        <div className="flex items-center gap-2 flex-1">
                            <input
                                type="text"
                                placeholder="Search anything..."
                                className="w-full text-sm px-1.5 py-2 bg-transparent focus:outline-none"
                            />
                            <Search className="size-4 text-gray-600" />
                        </div>

                        <div className="h-6 w-0.5 bg-gray-400"></div>

                        <div 
                            className="relative flex items-center text-gray-600 gap-2 cursor-pointer"
                            onClick={() => setShowAllCategories(!showAllCategories)}
                        >
                            <p className="text-sm whitespace-nowrap">All Categories</p>
                            <ChevronDown className="size-4" />
                            <CategoryDropdown 
                                isDesktop={true}
                                isOpen={showAllCategories}
                                onToggle={() => setShowAllCategories(!showAllCategories)}
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 items-center">
                        {/* Wishlist */}
                        <button className="bg-primary text-white size-10 rounded-full flex justify-center items-center hover:bg-primary/90 transition-colors">
                            <Heart className="size-5" />
                        </button>

                        {/* User actions */}
                        <div className="flex gap-2 items-center">
                            <button className="bg-primary text-white size-10 rounded-full flex justify-center items-center hover:bg-primary/90 transition-colors">
                                <User className="size-5" />
                            </button>
                            <div className="text-gray-600 hidden xl:block">
                                <p className="text-sm">Welcome</p>
                                <Link href="" className="font-semibold hover:text-primary transition-colors">Log In / Register</Link>
                            </div>
                        </div>

                        {/* Cart action */}
                        <div className="flex gap-2 items-center">
                            <button className="bg-primary text-white size-10 rounded-full flex justify-center items-center hover:bg-primary/90 transition-colors relative">
                                <ShoppingBag className="size-5" />
                                <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs rounded-full size-5 flex items-center justify-center">3</span>
                            </button>
                            <div className="text-gray-600 hidden xl:block">
                                <p className="text-sm">Cart</p>
                                <p className="font-semibold">$5000</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>

            {/* Menu Section */}
            <div className="bg-primary text-white py-5">
                <Container>
                    <div className="flex justify-between items-center">
                        {/* Left side */}
                        <div className="flex gap-8 items-center">
                            {/* Category */}
                            <div 
                                className="relative flex gap-2 items-center cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => setShowCategories(!showCategories)}
                            >
                                <Menu className="size-5" />
                                <p>List Category</p>
                                <CategoryDropdown 
                                    isDesktop={true}
                                    isOpen={showCategories}
                                    onToggle={() => setShowCategories(!showCategories)}
                                />
                            </div>
                            {/* Desktop menus */}
                            <Link href="" className="hover:opacity-80 transition-opacity">Home</Link>
                            <Link href="" className="hover:opacity-80 transition-opacity">About</Link>
                            <Link href="" className="hover:opacity-80 transition-opacity">Contact</Link>
                        </div>

                        {/* Right side */}
                        <div className="flex gap-8 items-center">
                            <div className="flex gap-2 items-center border border-white/30 py-2 px-4 rounded-full hover:bg-white/10 transition-colors">
                                <Phone className="size-4" />
                                <p className="text-sm">Hotline 24/7 (088) 1321456</p>
                            </div>
                            {/* Language */}
                            <div className="flex gap-2 items-center cursor-pointer hover:opacity-80 transition-opacity">
                                <p className="text-sm">Eng</p>
                                <ChevronDown className="size-4" />
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
        </div>
    );
}