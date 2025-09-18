import { FaMinus, FaPlus } from 'react-icons/fa'
import Image from "next/image";
import { BiChevronDown, BiChevronUp } from 'react-icons/bi';
import { useState } from 'react';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';

export default function CartCard({
  token,
  item,
  removeFromCartDB,
  addToCartDB,
  addToCartDBGuest,
  removeFromCartDBGuest
}) {
  const [showCombo, setShowCombo] = useState(false);
  return (
    <div>
      {/* regular product info  */}
      <div className="flex w-full bg-white items-center gap-4 py-4 px-4 border-b border-gray-200 text-primaryblack">

        {/* Remove button */}
        <button
          className="text-xl text-gray-400 hover:text-red-500"
          onClick={() => {
            token ? removeFromCartDB(item.cart_id) : removeFromCartDBGuest(item.cart_id);
          }}
        >
          <Trash2 />
        </button>

        {/* Product Image */}
        <div className="relative w-[80px] h-[120px] flex-shrink-0 rounded overflow-hidden bg-[#FAFAFA]">
          <Image
            alt={item.name}
            src={item.thumbnail_image}
            layout="fill"
            objectFit="contain"
            className="rounded py-[16px]"
          />
        </div>

        {/* Info & Controls */}
        <div className="flex-1 flex flex-col justify-between h-full text-primaryblack">
          {/* Name and Price */}
          <div>
            {
              item?.items?.length > 0 ?
                <Link href={`/combo/${item?.slug}`} className="text-sm font-medium line-clamp-2">{item.name} {item.variant && <span className='px-2 bg-primarycream text-button rounded-[10px]'>{item.variant}</span>}</Link>
                :
                <Link href={`/shop/${item?.slug}?variant=${item?.variant}`} className="text-sm font-medium line-clamp-2">{item.name} {item.variant && <span className='px-2 bg-primarycream text-button rounded-[10px]'>{item.variant}</span>}</Link>
            }
            <p className="text-sm mt-1"> <span className="dirham-symbol">ê</span> {item.price}</p>
          </div>

          {/* Quantity Controls */}
          <div className="mt-3 w-fit bg-creamline text-black rounded-[10px] flex items-center px-3 py-2.5">
            <button
              onClick={() =>
                token
                  ? addToCartDB(item?.combo_id ? item?.combo_id : item?.product_variant_id, 1, item?.combo_id && "combo", "decrement")
                  : addToCartDBGuest(item?.combo_id ? item?.combo_id : item?.product_variant_id, 1, item?.combo_id && "combo", "decrement")
              }
              disabled={item?.quantity === 1}
              className="p-1 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <FaMinus className="text-xs" />
            </button>

            <span className="mx-3 text-md font-medium">{item.quantity}</span>

            <button
              onClick={() =>
                token
                  ? addToCartDB(item?.combo_id ? item?.combo_id : item?.product_variant_id, 1, item?.combo_id && "combo")
                  : addToCartDBGuest(item?.combo_id ? item?.combo_id : item?.product_variant_id, 1, item?.combo_id && "combo")
              }
              className="p-1"
            >
              <FaPlus className="text-xs" />
            </button>
          </div>
        </div>
      </div>

      {/* showing combo here  */}
      {
        item?.items?.length > 0 &&

        <div className='py-2 mt-2 rounded-[10px] text-primaryblack bg-white'>
          <button onClick={() => setShowCombo(!showCombo)} className='cursor-pointer w-full flex justify-between items-center text-[14px]'>
            Show Items
            {
              showCombo ?
                <BiChevronUp className='text-2xl' />
                :

                <BiChevronDown className='text-2xl' />
            }
          </button>

          {
            showCombo &&
            <div className='mt-4'>
              {
                item?.items?.map((product) =>
                  <div className='flex items-center gap-4 py-2 border-t-[0.125px] border-creamline'>
                    <div className="relative w-[40px] h-[40px] p-[10px] rounded-[10px] overflow-hidden bg-creamline flex-shrink-0">
                      <Image
                        alt={product.name}
                        src={product.thumbnail_image}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <Link href={`/shop/${product?.slug}`} className='text-[14px] hover:text-natural'>{product?.name} {product.variant && <span className='px-4 py-0.5 bg-primarycream text-button rounded-[10px]'>{product.variant}</span>}</Link>
                    </div>
                  </div>)
              }
            </div>
          }
        </div>
      }
    </div>
  );
}
