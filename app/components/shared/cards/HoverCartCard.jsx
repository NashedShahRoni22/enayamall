import { IoIosCloseCircleOutline } from 'react-icons/io'
import Image from "next/image";
import { BiChevronDown, BiChevronUp } from 'react-icons/bi';
import { useState } from 'react';
import Link from 'next/link';
import { AiOutlineMinus } from 'react-icons/ai';
import { GoPlus } from 'react-icons/go';

export default function HoverCartCard({
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
      <div className={`flex flex-col md:flex-row items-center justify-between gap-[20px] text-primarymagenta bg-white p-[20px] ${item?.items?.length > 0 ? "rounded-t-[10px]" : "rounded-[10px]"}`}>

        {/* Product Info */}
        <div className="w-full md:w-4/6 flex flex-col md:flex-row gap-[20px] items-center">

          {/* Remove Button */}
          <button
            onClick={() => {
              token ? removeFromCartDB(item.cart_id) : removeFromCartDBGuest(item.cart_id);
            }}
            className="self-start md:self-center text-ash hover:text-button cursor-pointer"
          >
            <IoIosCloseCircleOutline className="text-[24px]" />
          </button>

          {/* Image Wrapper */}
          <div className="relative w-[80px] h-[80px] p-[10px] rounded-[10px] overflow-hidden bg-white flex-shrink-0">
            <Image
              alt={item.name}
              src={item.thumbnail_image}
              fill
              className="object-contain"
            />
          </div>

          {/* Product Details */}
          <div className="flex-1 min-w-0 text-center md:text-left">
            {
              item?.items?.length > 0 ?
              <Link href={`/combo/${item?.slug}`} className="leading-6 font-medium text-[14px] hover:text-natural line-clamp-2">{item.name} {item?.items?.length > 0 && <span className='px-2.5 py-0.5 bg-primarycream text-button rounded-[10px]'>Combo</span>}</Link>
              :
              <Link href={`/shop/${item?.slug}?variant=${item?.variant}`} className="leading-6 font-medium text-[14px] hover:text-natural line-clamp-2">{item.name} {item.variant && <span className='px-2.5 py-0.5 bg-primarycream text-button rounded-[10px]'>{item.variant}</span>} </Link>
            }
            <p className="mt-[8px] text-[14px]">৳ {item.price}</p>
          </div>
        </div>

        {/* Quantity Controls */}
        <div className="w-full md:w-2/6 mt-4 md:mt-0 flex items-center gap-[5px] h-[40px] md:h-[50px] rounded-[10px] justify-center bg-[#F8F8F8]">
          <button
            onClick={() =>
              token
                ? addToCartDB(item?.combo_id ? item?.combo_id : item?.product_variant_id, 1, item?.combo_id && "combo", "decrement")
                : addToCartDBGuest(item?.combo_id ? item?.combo_id : item?.product_variant_id, 1, item?.combo_id && "combo", "decrement")
            }
            disabled={item?.quantity === 1}
            className="disabled:cursor-not-allowed cursor-pointer text-primarymagenta hover:bg-creamline hover:text-natural rounded-full p-2"
          >
            <AiOutlineMinus />
          </button>
          <input
            min={1}
            value={item.quantity}
            readOnly
            className="w-8 text-center bg-transparent focus:outline-none text-natural"
          />
          <button
            onClick={() =>
              token
                ? addToCartDB(item?.combo_id ? item?.combo_id : item?.product_variant_id, 1, item?.combo_id && "combo")
                : addToCartDBGuest(item?.combo_id ? item?.combo_id : item?.product_variant_id, 1, item?.combo_id && "combo")
            }
            className="cursor-pointer text-primarymagenta hover:bg-creamline hover:text-natural rounded-full p-2 text-xl"
          >
            <GoPlus />
          </button>
        </div>
      </div>
      
      {/* showing combo here  */}
      {
        item?.items?.length > 0 &&

        <div className='px-4 py-2 rounded-b-[10px] text-primarymagenta bg-white border-t-[0.125px] border-creamline'>
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
                item?.items?.map((product, index) =>
                  <div key={index} className='flex items-center gap-4 py-2 border-t border-creamline'>
                    <div className="relative w-[40px] h-[40px] p-[10px] rounded-[10px] overflow-hidden bg-white flex-shrink-0">
                      <Image
                        alt={product.name}
                        src={product.thumbnail_image}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <Link href={`/shop/${product?.slug}?variant=${product?.variant}`} className='text-[14px] hover:text-natural'>{product?.name} {product.variant && <span className='px-4 py-0.5 bg-primarycream text-button rounded-[10px]'>{product.variant}</span>}</Link>
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
