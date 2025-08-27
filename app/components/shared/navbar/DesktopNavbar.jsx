// DesktopNavbar.jsx
"use client";
import { ChevronDown, Heart, Menu, Phone, Search, ShoppingBag, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Container from "../Container";
import CategoryDropdown from "./CategoryDropdown";

export default function DesktopNavbar({ logo, menuItems = [], categories = [], contactInfo, cartInfo, wishlistCount }) {
    const [showCategories, setShowCategories] = useState(false);
    const [showAllCategories, setShowAllCategories] = useState(false);

    return (
        <div className="hidden lg:block">
            <Container>
                {/* Top section */}
                <div className="flex justify-between py-5">
                    {/* Logo */}
                    <Link href="/">
                        <Image src={logo} height={50} width={200} alt="Logo" />
                    </Link>

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

                            {/* All Categories Dropdown */}
                            {showAllCategories && (
                                <CategoryDropdown
                                    categories={categories}
                                    onClose={() => setShowAllCategories(false)}
                                    className="absolute top-full right-0 mt-2"
                                />
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 items-center">
                        {/* Wishlist */}
                        {/* <Link href="/wishlist">
                            <button className="bg-primary text-white size-10 rounded-full flex justify-center items-center hover:bg-primary/90 transition-colors">
                                <Heart className="size-5" />
                            </button>
                        </Link> */}

                        <Link href="/wishlist">
                            <button className="bg-primary text-white size-10 rounded-full flex justify-center items-center hover:bg-primary/90 transition-colors relative">
                                <Heart className="size-5" />
                                {wishlistCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs rounded-full size-5 flex items-center justify-center">
                                        {wishlistCount}
                                    </span>
                                )}
                            </button>
                        </Link>

                        {/* User actions */}
                        <div className="flex gap-2 items-center">
                            <Link href="/login">
                                <button className="bg-primary text-white size-10 rounded-full flex justify-center items-center hover:bg-primary/90 transition-colors">
                                    <User className="size-5" />
                                </button>
                            </Link>
                            <div className="text-gray-600 hidden xl:block">
                                <p className="text-sm">Welcome</p>
                                {contactInfo?.name ?
                                    <Link href="/account" className="font-semibold hover:text-primary transition-colors">{contactInfo?.name}</Link>
                                    :
                                    <Link href="/login" className="font-semibold hover:text-primary transition-colors">
                                        Log In / Register
                                    </Link>}
                            </div>
                        </div>

                        {/* Cart action */}
                        <div className="flex gap-2 items-center">
                            <Link href="/cart">
                                <button className="bg-primary text-white size-10 rounded-full flex justify-center items-center hover:bg-primary/90 transition-colors relative">
                                    <ShoppingBag className="size-5" />
                                    {cartInfo?.itemCount > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs rounded-full size-5 flex items-center justify-center">
                                            {cartInfo.itemCount}
                                        </span>
                                    )}
                                </button>
                            </Link>
                            <div className="text-gray-600 hidden xl:block">
                                <p className="text-sm">Cart</p>
                                <p className="font-semibold">${cartInfo?.total || "0"}</p>
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
                                className="relative flex gap-2 items-center cursor-pointer"
                                onClick={() => setShowCategories(!showCategories)}
                            >
                                <Menu className="size-5" />
                                <p>List Category</p>

                                {/* Categories Dropdown */}
                                {showCategories && (
                                    <CategoryDropdown
                                        categories={categories}
                                        onClose={() => setShowCategories(false)}
                                        className="absolute top-full left-0 mt-2"
                                    />
                                )}
                            </div>

                            {/* Dynamic menu items */}
                            {menuItems.map((item, index) => (
                                <Link
                                    key={index}
                                    href={item.href}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>

                        {/* Right side */}
                        <div className="flex gap-8 items-center">
                            {contactInfo?.phone && (
                                <div className="flex gap-2 items-center border border-white/30 py-2 px-4 rounded-full hover:bg-white/10 transition-colors">
                                    <Phone className="size-4" />
                                    <p className="text-sm">Hotline 24/7 {contactInfo.phone}</p>
                                </div>
                            )}

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