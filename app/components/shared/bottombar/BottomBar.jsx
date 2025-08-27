"use client"
import { useAppContext } from "@/app/context/AppContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BiSolidUser } from "react-icons/bi";
import { HiMiniHome } from "react-icons/hi2";
import { IoBagHandle } from "react-icons/io5";
import { TiStarFullOutline } from "react-icons/ti";

export default function BottomBar() {
    const { token, cartDBCount, wishlistCount, cartDBCountGuest } = useAppContext();
    const currentCount = token ? cartDBCount : cartDBCountGuest;
    const pathname = usePathname();
    const menus = [
        {
            icon: <HiMiniHome />,
            link: "/",
        },
        {
            icon: <BiSolidUser />,
            link: "/account",
        },
        {
            icon: <IoBagHandle />,
            link: "/cart",
            count: currentCount.toString(),
        },
        {
            icon: <TiStarFullOutline />,
            link: "/wishlist",
            count: wishlistCount.toString(),
        },
    ]
    return (
        <div className='h-[56px] w-full bg-white border border-creamline flex justify-between py-[18px] px-5'>
            {
                menus.map((menu, index) =>
                    <Link href={menu.link} key={index} className={`relative text-[24px] text-creamline ${pathname === menu.link ? "text-primary" : "text-secondary"
                        }`}>
                        {menu.icon}
                        {
                            menu?.count > 0 &&
                            <span className="absolute -top-4 -right-4 bg-secondary size-6 rounded-full text-white text-xs flex justify-center items-center">
                                {menu.count}
                            </span>
                        }
                    </Link>)
            }
        </div>
    )
}
