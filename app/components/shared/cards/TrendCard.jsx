import Image from "next/image";
import Link from "next/link";
import { FaPlay } from "react-icons/fa";

export default function TrendCard({ index, tip }) {
    return (
        <div className="relative group rounded-[10px] overflow-hidden">
            <Image
                key={index}
                src={tip?.image}
                alt={tip?.title}
                height={500}
                width={500}
                className="rounded-[10px] object-cover w-full h-full"
            />
            
            {/* Light overlay for default state */}
            {/* <div className="absolute inset-0 bg-black/20 rounded-[10px] group-hover:opacity-0 transition-opacity duration-500"></div> */}
            
            {/* Default state - Bottom left play button with views */}
            <div className="absolute bottom-4 left-4 group-hover:opacity-0 transition-opacity duration-500">
                <Link 
                    href={tip?.target_url} 
                    target="_blank" 
                    className="flex items-center gap-2 bg-black/20 backdrop-blur-sm text-white p-4 rounded-full hover:bg-black/80 transition-all duration-300"
                >
                    <FaPlay className="text-sm" />
                </Link>
            </div>

            {/* Hover state - Center play button with dark overlay */}
            <div className="absolute inset-0 bg-black/80 rounded-[10px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex justify-center items-center">
                <Link 
                    href={tip?.target_url} 
                    target="_blank" 
                    className="opacity-0 translate-y-4 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out bg-creamline text-button p-4 rounded-full border border-creamline hover:scale-110"
                >
                    <FaPlay className="text-2xl" />
                </Link>
            </div>
        </div>
    )
}