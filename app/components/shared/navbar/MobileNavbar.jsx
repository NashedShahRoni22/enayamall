// MobileNavbar.jsx
"use client";
import { LogOut, Mail, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useEffect, useRef } from "react";
import Container from "../Container";
import CategoryDropdown from "./CategoryDropdown";
import GlobalSearch from "./GlobalSearch";
import { useAppContext } from "@/app/context/AppContext";
import { useRouter } from "next/navigation";

export default function MobileNavbar({
  logo,
  menuItems = [],
  categories = [],
  contactInfo,
  cartInfo,
  handleLogout,
  token,
}) {
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
      hotline: "Hotline:",
    },
    ar: {
      categories: "الفئات",
      loginRegister: "تسجيل الدخول / التسجيل",
      wishlist: "قائمة الأمنيات",
      hotline: "الخط الساخن:",
    },
  };

  // Get current translations
  const t = translations[lang] || translations.en;

  const searchRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false); // close modal
      }
    }

    if (showSearch) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSearch]);

  const [searchInput, setSearchInput] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (searchInput.trim()) {
      router.push(`/search/${encodeURIComponent(searchInput.trim())}`);
      setShowSearch(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <>
      <div className={`lg:hidden ${lang === "ar" ? "rtl" : "ltr"}`}>
        <Container>
          {/* Mobile Header */}
          <div className="flex justify-between items-center py-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-primary transition-colors z-60"
            >
              {isMobileMenuOpen ? (
                <X className="size-6" />
              ) : (
                <Menu className="size-6" />
              )}
            </button>

            {/* Mobile Logo */}
            <Link href="/">
              <Image
                src={logo}
                height={40}
                width={150}
                alt="Logo"
                className="mx-auto"
              />
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
                      style={{ textAlign: lang === "ar" ? "right" : "left" }}
                    >
                      {lang === "ar" && item.nameAr ? item.nameAr : item.name}
                    </Link>
                  ))}

                  <div className="relative">
                    <button
                      onClick={() => setShowCategories(!showCategories)}
                      className="w-full text-left py-2 px-4 text-gray-700 hover:text-primary transition-colors rounded"
                      style={{ textAlign: lang === "ar" ? "right" : "left" }}
                    >
                      {t.categories}
                    </button>
                    {showCategories && (
                      <div
                        className={`mt-2 ${lang === "ar" ? "mr-4" : "ml-4"}`}
                      >
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
                  {token ? (
                    <div>
                      <Link
                        onClick={() => setIsMobileMenuOpen(false)}
                        href={"/account"}
                        className="text-gray-500 inline-block"
                      >
                        <p className={`flex items-center gap-3 py-2 px-4`}>
                          <User className="size-5 text-gray-600" />
                          <span className="text-gray-700">
                            {contactInfo?.name}
                          </span>
                        </p>
                        <p className={`flex items-center gap-3 py-2 px-4`}>
                          <Mail className="size-5 text-gray-600" />
                          <span className="text-gray-700">
                            {contactInfo?.email}
                          </span>
                        </p>
                      </Link>
                      <button
                        className={`flex items-center gap-3 py-2 px-4 cursor-pointer`}
                        onClick={() => {
                          handleLogout();
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <LogOut className="size-5 text-red-600" />
                        <span className="text-red-700">Log Out</span>
                      </button>
                    </div>
                  ) : (
                    <Link
                      href="/login"
                      className={`flex items-center gap-3 py-2 px-4 ${
                        lang === "ar" ? "flex-row-reverse" : ""
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="size-5 text-gray-600" />
                      <span className="text-gray-700 hover:text-primary transition-colors">
                        {t.loginRegister}
                      </span>
                    </Link>
                  )}
                </div>
              </div>
            </Container>
          </div>
        )}
      </div>

      {/* Search Modal */}
      {showSearch && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50">
          <div
            ref={searchRef}
            className="relative w-full max-w-lg mx-auto mt-20 bg-white rounded-xl shadow-lg p-4"
          >
            {/* Search input */}
            <div
              className={`flex items-center gap-3 bg-gray-50 rounded-full px-4 py-3 focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/20 border border-transparent focus-within:border-primary/30 transition-all ${
                lang === "ar" ? "flex-row-reverse" : ""
              }`}
            >
              <input
                type="text"
                placeholder={translations.searchPlaceholder}
                className={`flex-1 bg-transparent focus:outline-none text-gray-700 placeholder:text-gray-500 ${
                  lang === "ar" ? "text-right" : "text-left"
                }`}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                dir={lang === "ar" ? "rtl" : "ltr"}
              />

              {searchInput && (
                <button
                  onClick={() => setSearchInput("")}
                  className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 p-1 rounded-full transition-all"
                >
                  <X className="size-4" />
                </button>
              )}

              <button
                onClick={handleSearch}
                className="text-gray-400 hover:text-primary transition-all cursor-pointer"
              >
                <Search className="size-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
