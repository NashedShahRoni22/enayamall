"use client";
import {
  Truck,
  RotateCcw,
  Shield,
  CreditCard,
  Twitter,
  Facebook,
  Instagram,
  Youtube,
  MapPin,
} from "lucide-react";
import Container from "../Container";
import Link from "next/link";
import { useAppContext } from "@/app/context/AppContext";

export default function Footer() {
  // Get language and categories from context
  const { lang, categories = [] } = useAppContext();

    // Translation object
    const translations = {
        en: {
            // Benefits section
            freeShipping: "Free shipping for orders 200 AED and above",
            freeReturns: "Free Returns within 7 days",
            paymentOptions: "Cash or credit card payment on delivery is available",
            authenticity: "We only sell authentic products with Brand Warranty",

            // Section titles
            topCategories: "Top Categories",
            company: "Company",
            helpCenter: "Help Center",
            partner: "Partner",
            subscribeOffer: "Subscribe & Get",
            off: "OFF",

            // Company links
            about: "About",
            contact: "Contact",
            // career: "Career",
            blog: "Blog",

            // Help center links
            customerService: "Delivery Information",
            policy: "Privacy Policy",
            termsConditions: "Terms & Conditions",
            returnRefund: "Return & Refund",
            faqs: "FAQs",
            trackOrder: "Track Order",
            myAccount: "My Account",

            // Partner links
            // becomeSeller: "Become Seller",
            affiliate: "Affiliate",
            advertise: "Advertise",
            partnership: "Partnership",
            careServices: "Care Services",

            // Subscribe section
            emailPlaceholder: "Email Address",
            subscribe: "SUBSCRIBE",
            privacyPolicy: "By subscribing, you accept the Privacy Policy",

            // Contact info
            hotline: "Hotline 24/7:",
            workHours: "Work Hours:",
            workHoursText: "Monday-Saturday: 9.00am - 5.00pm",
            mail: "Mail:",

            // Copyright
            copyright: "© 2025 Enayamall. All Rights Reserved."
        },
        ar: {
            // Benefits section
            freeShipping: "شحن مجاني للطلبات 200 درهم فما فوق",
            freeReturns: "إرجاع مجاني خلال 7 أيام",
            paymentOptions: "الدفع نقداً أو بالبطاقة الائتمانية عند التسليم متاح",
            authenticity: "نبيع فقط منتجات أصلية مع ضمان العلامة التجارية",

            // Section titles
            topCategories: "أهم الفئات",
            company: "الشركة",
            helpCenter: "مركز المساعدة",
            partner: "الشركاء",
            subscribeOffer: "اشترك واحصل على",
            off: "خصم",

            // Company links
            about: "من نحن",
            contact: "اتصل بنا",
            // career: "الوظائف",
            blog: "المدونة",

            // Help center links
            customerService: "خدمة العملاء",
            policy: "السياسة",
            termsConditions: "الشروط والأحكام",
            returnRefund: "تتبع الطلب",
            faqs: "الأسئلة الشائعة",
            myAccount: "حسابي",
            productSupport: "دعم المنتج",

            // Partner links
            // becomeSeller: "كن بائعاً",
            affiliate: "التسويق بالعمولة",
            advertise: "الإعلان",
            partnership: "الشراكة",
            careServices: "خدمات الرعاية",

            // Subscribe section
            emailPlaceholder: "عنوان البريد الإلكتروني",
            subscribe: "اشتراك",
            privacyPolicy: "بالاشتراك، فإنك توافق على سياسة الخصوصية",

            // Contact info
            hotline: "الخط الساخن 24/7:",
            workHours: "ساعات العمل:",
            workHoursText: "الاثنين-السبت: 9.00ص - 5.00م",
            mail: "البريد الإلكتروني:",

            // Copyright
            copyright: "© 2025 إنايا مول. جميع الحقوق محفوظة."
        }
    };

  // Get current translations
  const t = translations[lang] || translations.en;

  // Static menu data with translations
  const companyLinks = [
    { en: t.about, ar: t.about, href: "/about" },
    { en: t.contact, ar: t.contact, href: "/contact" },
    { en: t.career, ar: t.career, href: "/career" },
    { en: t.blog, ar: t.blog, href: "/blog" },
  ];

    const helpCenterLinks = [
        { en: t.customerService, ar: t.customerService, href: "/delivery-information" },
        { en: t.policy, ar: t.policy, href: "/privacy-policy" },
        { en: t.termsConditions, ar: t.termsConditions, href: "/terms-and-conditions" },
        { en: t.returnRefund, ar: t.returnRefund, href: "/return-refund" },
        { en: t.faqs, ar: t.faqs, href: "/faqs" },
        { en: t.trackOrder, ar: t.trackOrder, href: "/track-order" },
        { en: t.myAccount, ar: t.myAccount, href: "/account" },
    ];

  const partnerLinks = [
    { en: t.becomeSeller, ar: t.becomeSeller, href: "/become-seller" },
    { en: t.affiliate, ar: t.affiliate, href: "/affiliate" },
    { en: t.advertise, ar: t.advertise, href: "/advertise" },
    { en: t.partnership, ar: t.partnership, href: "/partnership" },
    { en: t.careServices, ar: t.careServices, href: "/care-services" },
  ];

  const socialLinks = [
    { icon: Twitter, href: "#" },
    { icon: Facebook, href: "#" },
    { icon: Instagram, href: "#" },
    { icon: Youtube, href: "#" },
    { icon: MapPin, href: "#" },
  ];

  // Function to get category name based on language
  const getCategoryName = (category) => {
    return lang === "ar" && category.ar_name ? category.ar_name : category.name;
  };

  // Reusable menu component for static links
  const MenuSection = ({ title, links }) => (
    <div>
      <h3
        className={`font-semibold text-gray-800 mb-4 ${
          lang === "ar" ? "text-right" : "text-left"
        }`}
      >
        {title}
      </h3>
      <ul
        className={`space-y-2 text-sm text-gray-600 ${
          lang === "ar" ? "text-right" : "text-left"
        }`}
      >
        {links.map((link, index) => (
          <li key={index}>
            <Link href={link.href || "#"} className="hover:text-gray-800">
              {lang === "ar" ? link.ar : link.en}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );

  // Dynamic categories menu component
  const CategoriesSection = () => (
    <div>
      <h3
        className={`font-semibold text-gray-800 mb-4 ${
          lang === "ar" ? "text-right" : "text-left"
        }`}
      >
        {t.topCategories}
      </h3>
      <ul
        className={`space-y-2 text-sm text-gray-600 ${
          lang === "ar" ? "text-right" : "text-left"
        }`}
      >
        {categories.slice(0, 11).map((category) => (
          <li key={category.id}>
            <Link
              href={`/category/${category.slug}`}
              className="hover:text-gray-800"
            >
              {getCategoryName(category)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <footer className={`{lang === "ar" ? "rtl" : "ltr"} mt-10`}>
      {/* Top benefits bar */}
      <div className="bg-primary text-white py-4">
        <Container>
          <div
            dir={lang === "ar" ? "rtl" : "ltr"}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:text-left"
          >
            <div className="flex flex-row items-center gap-2">
              <Truck size={20} />
              <span className="text-sm">{t.freeShipping}</span>
            </div>
            <div className="flex flex-row items-center gap-2">
              <RotateCcw size={20} />
              <span className="text-sm">{t.freeReturns}</span>
            </div>
            <div className="flex flex-row items-center gap-2">
              <CreditCard size={20} />
              <span className="text-sm">{t.paymentOptions}</span>
            </div>
            <div className="flex flex-row items-center gap-2">
              <Shield size={20} />
              <span className="text-sm">{t.authenticity}</span>
            </div>
          </div>
        </Container>
      </div>

      {/* Main footer content */}
      <div className="bg-gray-50 py-12">
        <Container>
          <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 ${
              lang === "ar" ? "lg:grid-flow-col-reverse" : ""
            }`}
          >
            <CategoriesSection />
            <MenuSection title={t.company} links={companyLinks} />
            <MenuSection title={t.helpCenter} links={helpCenterLinks} />
            <MenuSection title={t.partner} links={partnerLinks} />

                        {/* Subscribe & Contact */}
                        <div>
                            {/* Contact Info */}
                            <div className={`mb-4 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                                <p className="text-sm text-gray-600 mb-1">
                                    <strong>{t.hotline}</strong> <Link href="tel:+971506065857" className="text-primary">+971506065857</Link>
                                </p>
                                <p className="text-sm text-gray-600 mb-1">
                                    <strong>Address: </strong>
                                    <span className="text-primary">P.O.Box 27042, Dubai United Arab Emirates</span>
                                </p>
                                <p className="text-sm text-gray-600">
                                    <strong>{t.mail}</strong> <Link href="mailto:info@enayamall.com" className="text-primary">info@enayamall.com</Link>
                                </p>
                            </div>

              {/* Social Media */}
              <div
                className={`flex gap-3 ${
                  lang === "ar" ? "justify-end" : "justify-start"
                }`}
              >
                {socialLinks.map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                    <Link
                      key={index}
                      href={social.href}
                      className="text-black bg-white shadow p-2.5 rounded-full"
                    >
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
      <div className="bg-white py-6 border-t border-gray-200">
        <Container>
          {/* Copyright */}
          <div className="text-center">
            <p className="text-sm text-gray-500">{t.copyright}</p>
          </div>
        </Container>
      </div>
    </footer>
  );
}
