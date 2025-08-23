import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/shared/navbar/Navbar";
import Footer from "./components/shared/footer/Footer";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata = {
  title: "Enayamall",
  description: "Enayamall Shopping App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <Navbar/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}
