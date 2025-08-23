import logo from "@/public/logo.webp";
import DesktopNavbar from "./DesktopNavbar";
import MobileNavbar from "./MobileNavbar";

export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 bg-white shadow-sm">
            <DesktopNavbar logo={logo} />
            <MobileNavbar logo={logo} />
        </nav>
    );
}