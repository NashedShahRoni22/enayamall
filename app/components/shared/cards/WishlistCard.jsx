import Image from 'next/image'
import Link from 'next/link';
import { CalendarDays, ShoppingCart, Trash2 } from 'lucide-react';

export default function WishlistCard({ w, removeFromWishlistDB, addToCartDB }) {
    return (
        <div className='relative flex justify-between items-center gap-4 px-2 sm:px-4 border border-creamline rounded-[10px] text-primarymagenta min-h-[160px]'>

            {/* Remove Button & Add to Cart - Mobile */}
            <div className='absolute top-1/2 right-3 transform -translate-y-1/2 sm:hidden'>
                <div className='flex flex-col gap-2'>
                    <button onClick={() => addToCartDB(w?.product_variant_id, 1)} className='text-[16px] p-[8px] bg-customgreen text-white rounded-full'>
                        <ShoppingCart size={18} />
                    </button>
                    <button onClick={() => removeFromWishlistDB(w.wishlist_id)} className='text-[16px] p-[8px] bg-red-100 text-red-500 rounded-full'>
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            {/* Left Section */}
            <div className='flex items-center gap-4 sm:gap-6 w-5/6 sm:w-2/3'>

                {/* Remove button - Desktop */}
                <button className='hidden sm:block cursor-pointer' onClick={() => removeFromWishlistDB(w.wishlist_id)}>
                    <Trash2 className='text-[24px] text-ash' />
                </button>

                {/* Product Info */}
                <div className='flex items-center gap-2 sm:gap-6 w-full'>
                    <div className='w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] md:w-[120px] md:h-[120px] bg-white flex items-center justify-center overflow-hidden flex-shrink-0'>
                        <Image
                            alt={w.name}
                            src={w.thumbnail_image}
                            width={100}
                            height={100}
                            className='object-contain max-w-full max-h-full'
                        />
                    </div>
                    <div className='flex flex-col justify-between min-h-[80px] overflow-hidden'>
                        {/* Name */}
                        {
                            w?.items?.length > 0 ?
                                <Link href={`/combo/${w?.slug}`} className="text-[16px] font-medium line-clamp-3 hover:text-natural">{w.name} {w?.items?.length > 0 && <span className='px-4 py-0.5 bg-primarycream text-button rounded-[10px]'>Combo</span>}</Link>
                                :
                                <Link href={`/shop/${w?.slug}?variant=${w?.variant}`} className="text-[16px] font-medium line-clamp-3 hover:text-natural">{w.name} {w.variant && <span className='px-4 py-0.5 bg-primarycream text-button rounded-[10px]'>{w.variant}</span>} </Link>
                        }
                        {/* Pricing */}
                        <div className='my-2 text-[12px] sm:text-[14px] md:text-[16px]'>
                            {
                                w?.discount !== null ?
                                    <div className='flex gap-2'>
                                        <span><span className="dirham-symbol text-[17px]">ê</span> {w?.discount?.discount_price}</span>
                                        <span className='line-through opacity-50 text-button'><span className="dirham-symbol text-[17px]">ê</span> {w?.base_price}</span>
                                    </div>
                                    :
                                    <span><span className="dirham-symbol text-[17px]">ê</span> {w?.base_price}</span>
                            }
                        </div>
                        {/* Date */}
                        <p className='text-ash flex items-center gap-2 text-[12px] sm:text-[14px] md:text-[16px]'>
                            <CalendarDays size={18}/>{w?.created_at}
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Section - From Tablet */}
            <div className='hidden sm:flex flex-col xl:flex-row xl:items-center sm:gap-4 xl:gap-12'>
                <button onClick={() => addToCartDB(w?.product_variant_id, 1)} className='cursor-pointer text-[14px] md:text-[16px] px-4 py-2 bg-primary text-white rounded-xl'>
                    Add to cart
                </button>
            </div>
        </div>
    )
}
