// MobileNavbar.jsx
"use client";
import { Heart, Menu, Phone, Search, ShoppingBag, User, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Container from "../Container";
import CategoryDropdown from "./CategoryDropdown";

export default function MobileNavbar({ logo, menuItems = [], categories = [], contactInfo, cartInfo }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [showCategories, setShowCategories] = useState(false);

    return (
        <div className="lg:hidden">
            <Container>
                {/* Mobile Header */}
                <div className="flex justify-between items-center py-4 px-4">
                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="text-gray-700 hover:text-primary transition-colors z-60"
                    >
                        {isMobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
                    </button>

                    {/* Mobile Logo */}
                    <Link href="/">
                        <Image src={logo} height={40} width={150} alt="Logo" className="mx-auto" />
                    </Link>

                    {/* Mobile Actions */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            className="text-gray-700 hover:text-primary transition-colors"
                        >
                            <Search className="size-6" />
                        </button>
                        <Link href="/cart">
                            <button className="bg-primary text-white size-8 rounded-full flex justify-center items-center relative">
                                <ShoppingBag className="size-4" />
                                {cartInfo?.itemCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs rounded-full size-4 flex items-center justify-center">
                                        {cartInfo.itemCount}
                                    </span>
                                )}
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Mobile Search Bar */}
                {isSearchOpen && (
                    <div className="px-4 pb-4">
                        <div className="flex items-center gap-2 bg-gray-100 px-4 py-3 rounded-full">
                            <input
                                type="text"
                                placeholder="Search anything..."
                                className="flex-1 text-sm bg-transparent focus:outline-none"
                            />
                            <Search className="size-4 text-gray-600" />
                        </div>
                    </div>
                )}
            </Container>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="absolute top-full left-0 right-0 bg-white shadow-lg border-t z-40">
                    <Container>
                        <div className="py-4 space-y-4">
                            {/* Mobile Menu Items */}
                            <div className="space-y-3">
                                {menuItems.map((item, index) => (
                                    <Link 
                                        key={index}
                                        href={item.href} 
                                        className="block py-2 px-4 text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors rounded"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                                
                                <div className="relative">
                                    <button 
                                        onClick={() => setShowCategories(!showCategories)}
                                        className="w-full text-left py-2 px-4 text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors rounded"
                                    >
                                        Categories
                                    </button>
                                    {showCategories && (
                                        <div className="mt-2 ml-4">
                                            <CategoryDropdown 
                                                categories={categories} 
                                                onClose={() => setShowCategories(false)}
                                                isMobile={true}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Mobile User Actions */}
                            <div className="border-t pt-4 space-y-3">
                                <Link 
                                    href="/login"
                                    className="flex items-center gap-3 py-2 px-4"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <User className="size-5 text-gray-600" />
                                    <span className="text-gray-700 hover:text-primary transition-colors">
                                        Log In / Register
                                    </span>
                                </Link>
                                
                                <Link 
                                    href="/wishlist"
                                    className="flex items-center gap-3 py-2 px-4"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <Heart className="size-5 text-gray-600" />
                                    <span className="text-gray-700">Wishlist</span>
                                </Link>
                                
                                {contactInfo?.phone && (
                                    <div className="flex items-center gap-3 py-2 px-4">
                                        <Phone className="size-5 text-gray-600" />
                                        <span className="text-gray-700">Hotline: {contactInfo.phone}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Container>
                </div>
            )}
        </div>
    );
}