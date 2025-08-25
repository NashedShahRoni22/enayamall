import {
    Truck,
    RotateCcw,
    Shield,
    CreditCard,
    Twitter,
    Facebook,
    Instagram,
    Youtube,
    MapPin
} from "lucide-react";
import Container from "../Container";
import Link from "next/link";

export default function Footer() {
    // Menu data arrays
    const topCategories = [
        "Pregnant & Postpartum",
        "Milks & Foods",
        "Diapers & Wipes",
        "Infant",
        "Eat & Drink Supplies",
        "Baby Fashion",
        "Baby Out",
        "Toys & Study",
        "Stroller, Crib, Chair",
        "Washes & Bath",
        "Homewares"
    ];

    const companyLinks = [
        "About",
        "Contact",
        "Career",
        "Blog",
    ];

    const helpCenterLinks = [
        "Customer Service",
        "Policy",
        "Terms & Conditions",
        "Track Order",
        "FAQs",
        "My Account",
        "Product Support"
    ];

    const partnerLinks = [
        "Become Seller",
        "Affiliate",
        "Advertise",
        "Partnership",
        "Care Services"
    ];

    const paymentMethods = [
        {
            name: "PayPal",
            icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/paypal.svg",
            bg: "bg-blue-600"
        },
        {
            name: "Mastercard",
            icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/mastercard.svg",
            bg: "bg-red-500"
        },
        {
            name: "Visa",
            icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/visa.svg",
            bg: "bg-blue-500"
        },
        {
            name: "Stripe",
            icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/stripe.svg",
            bg: "bg-purple-600"
        },
        {
            name: "Klarna",
            icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/klarna.svg",
            bg: "bg-pink-400"
        }
    ];

    const socialLinks = [
        { icon: Twitter, href: "#" },
        { icon: Facebook, href: "#" },
        { icon: Instagram, href: "#" },
        { icon: Youtube, href: "#" },
        { icon: MapPin, href: "#" }
    ];

    // Reusable menu component
    const MenuSection = ({ title, links }) => (
        <div>
            <h3 className="font-semibold text-gray-800 mb-4">{title}</h3>
            <ul className="space-y-2 text-sm text-gray-600">
                {links.map((link, index) => (
                    <li key={index}>
                        <Link href="#" className="hover:text-gray-800">
                            {link}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );

    return (
        <footer className="mt-10 md:mt-20">
            {/* Top benefits bar */}
            <div className="bg-primary text-white py-4">
                <Container>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-center lg:text-left">
                        <div className="flex items-center justify-center lg:justify-start gap-2">
                            <Truck size={20} />
                            <span className="text-sm">Free Shipping over $99</span>
                        </div>
                        <div className="flex items-center justify-center lg:justify-start gap-2">
                            <RotateCcw size={20} />
                            <span className="text-sm">30 Days money back</span>
                        </div>
                        <div className="flex items-center justify-center lg:justify-start gap-2">
                            <Shield size={20} />
                            <span className="text-sm">100% Authentic Products</span>
                        </div>
                        <div className="flex items-center justify-center lg:justify-start gap-2">
                            <CreditCard size={20} />
                            <span className="text-sm">Flexible payment options</span>
                        </div>
                    </div>
                </Container>
            </div>

            {/* Main footer content */}
            <div className="bg-gray-50 py-12">
                <Container>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                        <MenuSection title="Top Categories" links={topCategories} />
                        <MenuSection title="Company" links={companyLinks} />
                        <MenuSection title="Help Center" links={helpCenterLinks} />
                        <MenuSection title="Partner" links={partnerLinks} />

                        {/* Subscribe & Contact */}
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-4">
                                Subscribe & Get <span className="text-orange-500">10% OFF</span>
                            </h3>

                            {/* Email subscription */}
                            <div className="mb-6">
                                <div className="flex">
                                    <input
                                        type="email"
                                        placeholder="Email Address"
                                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-l focus:outline-none focus:border-primary"
                                    />
                                    <button className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-r hover:bg-teal-600">
                                        SUBSCRIBE
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    By subscribing, you accept the <Link href="#" className="text-primary">Privacy Policy</Link>
                                </p>
                            </div>

                            {/* Contact Info */}
                            <div className="mb-4">
                                <p className="text-sm text-gray-600 mb-1">
                                    <strong>Hotline 24/7:</strong> <Link href="tel:+32536862516" className="text-primary">+325) 3686 25 16</Link>
                                </p>
                                <p className="text-sm text-gray-600 mb-1">
                                    <strong>Work Hours:</strong> Monday-Saturday: 9.00am - 5.00pm
                                </p>
                                <p className="text-sm text-gray-600">
                                    <strong>Mail:</strong> <Link href="mailto:contact@enayamall.com" className="text-primary">contact@enayamall.com</Link>
                                </p>
                            </div>

                            {/* Social Media */}
                            <div className="flex gap-3">
                                {socialLinks.map((social, index) => {
                                    const IconComponent = social.icon;
                                    return (
                                        <Link key={index} href={social.href} className="text-black bg-white shadow p-2.5 rounded-full">
                                            <IconComponent size={16} />
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </Container>
            </div>

            {/* Bottom footer */}
            <div className="bg-white py-6 border-t">
                <Container>
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-4">

                        {/* Currency and Language */}
                        <div className="flex items-center gap-4">
                            <select className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none">
                                <option>USD</option>
                                <option>EUR</option>
                                <option>GBP</option>
                            </select>
                            <select className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none">
                                <option>🇺🇸 Eng</option>
                                <option>🇪🇸 Esp</option>
                                <option>🇫🇷 Fra</option>
                            </select>
                        </div>

                        {/* Payment Methods */}
                        <div className="flex items-center gap-3">
                            {paymentMethods.map((method, index) => (
                                <div key={index} className={`w-12 h-8 ${method.bg} rounded flex items-center justify-center p-1`}>
                                    <img 
                                        src={method.icon} 
                                        alt={method.name}
                                        className="w-full h-full object-contain filter brightness-0 invert"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* App Downloads */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Download App</span>
                            <div className="flex gap-2">
                                <div className="shadow bg-white px-3 py-2 rounded text-xs flex items-center gap-2 border">
                                    <img 
                                        width="20" 
                                        height="20" 
                                        src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/apple.svg" 
                                        alt="app-store" 
                                        className="filter brightness-0"
                                    />
                                    <span className="font-medium">App Store</span>
                                </div>
                                <div className="shadow bg-white px-3 py-2 rounded text-xs flex items-center gap-2 border">
                                    <img 
                                        width="20" 
                                        height="20" 
                                        src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/googleplay.svg" 
                                        alt="google-play" 
                                        className="filter brightness-0"
                                    />
                                    <span className="font-medium">Google Play</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Copyright */}
                    <div className="text-center mt-6 pt-4 border-t">
                        <p className="text-sm text-gray-500">
                            © 2024 <strong>Enayamall</strong> . All Rights Reserved
                        </p>
                    </div>
                </Container>
            </div>
        </footer>
    );
}