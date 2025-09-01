// DesktopNavbar.jsx
"use client";
import { ChevronDown, Heart, Menu, Phone, Search, ShoppingBag, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Container from "../Container";
import CategoryDropdown from "./CategoryDropdown";
import GlobalSearch from "./GlobalSearch";
import { useAppContext } from "@/app/context/AppContext";

export default function DesktopNavbar({ logo, menuItems = [], categories = [], contactInfo, cartInfo, wishlistCount }) {
    const [showCategories, setShowCategories] = useState(false);
    const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    
    // Get language state and setter from context
    const { lang, setLang } = useAppContext();

    // Language options
    const languages = [
        { code: 'en', label: 'English', },
        { code: 'ar', label: 'العربية', }
    ];

    // Handle language change
    const handleLanguageChange = (languageCode) => {
        setLang(languageCode);
        localStorage.setItem('EnayamallLang', languageCode);
        setShowLanguageDropdown(false);
    };

    // Get current language display
    const currentLanguage = languages.find(l => l.code === lang) || languages[0];

    return (
        <>
            <div className="hidden lg:block relative">
                <Container>
                    {/* Top section */}
                    <div className="flex justify-between py-5">
                        {/* Logo */}
                        <Link href="/">
                            <Image src={logo} height={50} width={200} alt="Logo" />
                        </Link>

                        {/* Search */}
                        <div className="flex-1 max-w-md mx-8">
                            <button 
                                onClick={() => setShowSearch(true)}
                                className="w-full flex items-center gap-3 bg-gray-100 hover:bg-gray-50 px-5 py-3 rounded-full transition-colors group"
                            >
                                <Search className="size-5 text-gray-500 group-hover:text-primary transition-colors" />
                                <span className="flex-1 text-left text-sm text-gray-500">Search anything...</span>
                            </button>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4 items-center">
                            {/* Wishlist */}
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
                                    <p className="font-semibold flex items-center gap-1"> <span className="dirham-symbol">ê</span> {cartInfo?.total || "0"}</p>
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
                                        className="hover:text-gray-200 transition-colors"
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

                                {/* Language Selector */}
                                <div className="relative">
                                    <div 
                                        className="flex gap-2 items-center cursor-pointer hover:opacity-80 transition-opacity"
                                        onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                                    >
                                        <p className="text-sm">{currentLanguage.label}</p>
                                        <ChevronDown className={`size-4 transition-transform ${showLanguageDropdown ? 'rotate-180' : ''}`} />
                                    </div>

                                    {/* Language Dropdown */}
                                    {showLanguageDropdown && (
                                        <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[120px] z-50">
                                            {languages.map((language) => (
                                                <button
                                                    key={language.code}
                                                    onClick={() => handleLanguageChange(language.code)}
                                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors flex items-center gap-2 ${
                                                        lang === language.code 
                                                            ? 'text-primary font-medium bg-gray-50' 
                                                            : 'text-gray-700'
                                                    }`}
                                                >
                                                    <span>{language.label}</span>
                                                    {lang === language.code && (
                                                        <span className="ml-auto text-primary">✓</span>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {/* Overlay to close dropdown when clicking outside */}
                                    {showLanguageDropdown && (
                                        <div 
                                            className="fixed inset-0 z-40"
                                            onClick={() => setShowLanguageDropdown(false)}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </Container>
                </div>
            </div>

            {/* Search Modal */}
            <GlobalSearch 
                isOpen={showSearch}
                onClose={() => setShowSearch(false)}
                isMobile={false}
            />
        </>
    );
}