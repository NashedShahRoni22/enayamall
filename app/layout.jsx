import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/shared/navbar/Navbar";
import Footer from "./components/shared/footer/Footer";
import { AppProvider } from "./context/AppContext";
import QuereyProvider from "./providers/QueryProvider"
import { Toaster } from "react-hot-toast";

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
        <QuereyProvider>
          <AppProvider>
            <Navbar />
            <Toaster position="top-center" />
            {children}
            <Footer />
          </AppProvider>
        </QuereyProvider>
      </body>
    </html>
  );
}
