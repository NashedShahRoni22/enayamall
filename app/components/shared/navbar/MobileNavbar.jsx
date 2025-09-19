// MobileNavbar.jsx
"use client";
import { LogOut, Mail, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Container from "../Container";
import CategoryDropdown from "./CategoryDropdown";
import GlobalSearch from "./GlobalSearch";
import { useAppContext } from "@/app/context/AppContext";

export default function MobileNavbar({ logo, menuItems = [], categories = [], contactInfo, cartInfo, handleLogout, token }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [showCategories, setShowCategories] = useState(false);

    // Get language state from context
    const { lang } = useAppContext();

    // Translation object
    const translations = {
        en: {
            categories: "Categories",
            loginRegister: "Log In / Register",
            wishlist: "Wishlist",
            hotline: "Hotline:"
        },
        ar: {
            categories: "الفئات",
            loginRegister: "تسجيل الدخول / التسجيل",
            wishlist: "قائمة الأمنيات",
            hotline: "الخط الساخن:"
        }
    };

    // Get current translations
    const t = translations[lang] || translations.en;

    return (
        <>
            <div className={`lg:hidden ${lang === 'ar' ? 'rtl' : 'ltr'}`}>
                <Container>
                    {/* Mobile Header */}
                    <div className="flex justify-between items-center py-4">
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
                                onClick={() => setShowSearch(true)}
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
                </Container>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="left-0 right-0 bg-white shadow-lg border-t z-40">
                        <Container>
                            <div className="py-4 space-y-4">
                                {/* Mobile Menu Items */}
                                <div className="space-y-3">
                                    {menuItems.map((item, index) => (
                                        <Link
                                            key={index}
                                            href={item.href}
                                            className="block py-2 px-4 text-gray-700 hover:text-primary transition-colors rounded"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}
                                        >
                                            {lang === 'ar' && item.nameAr ? item.nameAr : item.name}
                                        </Link>
                                    ))}

                                    <div className="relative">
                                        <button
                                            onClick={() => setShowCategories(!showCategories)}
                                            className="w-full text-left py-2 px-4 text-gray-700 hover:text-primary transition-colors rounded"
                                            style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}
                                        >
                                            {t.categories}
                                        </button>
                                        {showCategories && (
                                            <div className={`mt-2 ${lang === 'ar' ? 'mr-4' : 'ml-4'}`}>
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
                                <div className="">
                                    {
                                        token ?
                                            <div>
                                                <Link onClick={() => setIsMobileMenuOpen(false)} href={"/account"} className="text-gray-500 inline-block">
                                                    <p
                                                        className={`flex items-center gap-3 py-2 px-4`}
                                                    >
                                                        <User className="size-5 text-gray-600" />
                                                        <span className="text-gray-700">{contactInfo?.name}</span>
                                                    </p>
                                                    <p
                                                        className={`flex items-center gap-3 py-2 px-4`}
                                                    >
                                                        <Mail className="size-5 text-gray-600" />
                                                        <span className="text-gray-700">{contactInfo?.email}</span>
                                                    </p>
                                                </Link>
                                                <button
                                                    className={`flex items-center gap-3 py-2 px-4 cursor-pointer`}
                                                    onClick={() => {
                                                        handleLogout(); setIsMobileMenuOpen(false);
                                                    }}
                                                >
                                                    <LogOut className="size-5 text-red-600" />
                                                    <span className="text-red-700">
                                                        Log Out
                                                    </span>
                                                </button>
                                            </div>
                                            :
                                            <Link
                                                href="/login"
                                                className={`flex items-center gap-3 py-2 px-4 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                <User className="size-5 text-gray-600" />
                                                <span className="text-gray-700 hover:text-primary transition-colors">
                                                    {t.loginRegister}
                                                </span>
                                            </Link>
                                    }


                                </div>
                            </div>
                        </Container>
                    </div>
                )}
            </div>

            {/* Search Modal */}
            <GlobalSearch
                isOpen={showSearch}
                onClose={() => setShowSearch(false)}
                isMobile={true}
            />
        </>
    );
}