import { Heart, Star } from "lucide-react";
import productImg from "@/public/productImg.jpeg";
import Image from "next/image";

export default function VerticalProductCard() {
  return (
    <div className="p-4 shadow rounded">
        <p className="text-center line-clamp-2 font-semibold text-gray-800 mb-2">Product name will be Header</p>
        
        {/* Rating section */}
        <div className="flex justify-center items-center gap-1 mb-3">
            <div className="flex">
                {[...Array(5)].map((_, i) => (
                    <Star 
                        key={i} 
                        size={14} 
                        className={`${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    />
                ))}
            </div>
            <span className="text-sm text-gray-600 ml-1">(4.0)</span>
        </div>
        
        {/* Product Image Here  */}
        <div>
            <Image src={productImg} alt="Product Image" height={500} width={500} />
        </div>
        
        {/* price & discount here  */}
        <div className="flex justify-center items-center gap-3 my-4">
            <p className="text-lg text-secondary font-bold">$129</p>
            <p className="line-through text-sm text-gray-500">$159</p>
            <p className="px-2 py-1 bg-secondary text-white rounded text-xs font-medium">15% OFF</p>
        </div>
        
        {/* purchases and wishlist  */}
        <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600"><span className="font-semibold text-gray-800">1,250</span> Purchases</p>
            <Heart size={18} className="text-gray-400 hover:text-red-500 cursor-pointer transition-colors"/>
        </div>
    </div>
  )
}