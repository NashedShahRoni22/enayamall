// Navbar.jsx (Root component)
"use client";
import logo from "@/public/logo.webp";
import DesktopNavbar from "./DesktopNavbar";
import MobileNavbar from "./MobileNavbar";
import { useAppContext } from '@/app/context/AppContext';

export default function Navbar() {
    const { categories, cartDBCount, cartDBCountGuest, totalDB, totalDBGuest, user, wishlistCount } = useAppContext();
    
    // Dynamic menu items
    const menuItems = [
        { name: "Home", href: "/" },
        { name: "About", href: "/about" },
        { name: "Contact", href: "/contact" },
        { name: "Shop", href: "/shop" },
        { name: "Blog", href: "/blog" }
    ];

    // Contact info
    const contactInfo = {
       ...user
    };

    // Cart info (this could come from a cart context)
    const cartInfo = {
        itemCount: cartDBCount ? cartDBCount : cartDBCountGuest,
        total: totalDB ? totalDB : totalDBGuest
    };

    return (
        <nav className="sticky top-0 z-50 bg-white shadow-sm">
            <DesktopNavbar 
                logo={logo} 
                menuItems={menuItems}
                categories={categories}
                contactInfo={contactInfo}
                cartInfo={cartInfo}
                wishlistCount={wishlistCount}
            />
            <MobileNavbar 
                logo={logo} 
                menuItems={menuItems}
                categories={categories}
                contactInfo={contactInfo}
                cartInfo={cartInfo}
            />
        </nav>
    );
}