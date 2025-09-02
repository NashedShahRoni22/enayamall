import Image from 'next/image';
import Link from 'next/link';
import { AiOutlineMinus } from 'react-icons/ai';
import { GoPlus } from 'react-icons/go';
import { Trash2 } from 'lucide-react';

export default function CartTableRow({
  token,
  item,
  removeFromCartDB,
  addToCartDB,
  addToCartDBGuest,
  removeFromCartDBGuest
}) {
  return (
    <>
      {/* regular product info  */}
      <tr className="border-b border-creamline text-primarymagenta relative">
        {/* Product */}
        <td className="py-[10px] lg:py-[20px] px-[10px] lg:px-[30px] lg:w-3/6">
          <div className="flex gap-[10px] lg:gap-[30px] items-center">
            {/* remove button  */}
            <button
              onClick={() => {
                token ? removeFromCartDB(item.cart_id) : removeFromCartDBGuest(item.cart_id);
              }}
              className="cursor-pointer"
            >
              <Trash2 className="text-[20px] lg:text-[24px] text-ash hover:text-button" />
            </button>

            {/* Fixed responsive image container */}
            <div className="w-[60px] h-[60px] lg:w-[80px] lg:h-[80px] 2xl:w-[100px] 2xl:h-[100px] flex items-center justify-center overflow-hidden bg-white flex-shrink-0">
              <Image
                alt={item.name}
                src={item.thumbnail_image}
                width={100}
                height={100}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {/* product name here  */}
            {
              item?.items?.length > 0 ?
                <div>
                  <Link href={`/combo/${item?.slug}`} className="text-[14px] lg:text-[16px] font-medium flex-1 hover:text-secondary line-clamp-3">{item.name} {item.variant && <span className='px-2 bg-primarycream text-button rounded-[10px]'>{item.variant}</span>} {item?.items?.length > 0 && <span className='px-4 py-0.5 bg-primarycream text-button rounded-[10px]'>Combo</span>}</Link>
                  <ul className='mt-2'>
                    {
                      item?.items?.map((product, index) =>
                        <li key={index}>
                          <Link href={`/shop/${product?.slug}?variant=${product?.variant}`} className='text-[14px] hover:text-secondary line-clamp-1'> - {product?.name} {product.variant && <span>-{product.variant}</span>}</Link>
                        </li>)
                    }
                  </ul>
                </div>
                :
                <div>
                  <Link href={`/shop/${item?.slug}?variant=${item?.variant}`} className="text-[14px] lg:text-[16px] font-medium flex-1 hover:text-secondary line-clamp-3">{item.name} {item.variant && <span className='px-2 bg-primarycream text-button rounded-[10px]'>{item.variant}</span>}</Link>
                </div>
            }


          </div>
        </td>

        {/* Price */}
        <td className="py-[10px] lg:py-[20px] px-[15px] lg:w-1/6 text-[14px] lg:text-[16px] align-middle">
          <span className="dirham-symbol">ê</span> {item.price}
        </td>

        {/* Quantity */}
        <td className="py-[10px] lg:py-[20px] px-[15px] lg:px-[30px] lg:w-1/6">
          <div className="flex items-center lg:gap-[10px] text-secondary h-[40px] lg:h-[50px] w-[100px] lg:w-[140px] rounded-[10px] justify-center bg-[#F8F8F8]">
            <button
              onClick={() =>
                token
                  ? addToCartDB(item?.combo_id ? item?.combo_id : item?.product_variant_id, 1, item?.combo_id && "combo", "decrement")
                  : addToCartDBGuest(item?.combo_id ? item?.combo_id : item?.product_variant_id, 1, item?.combo_id && "combo", "decrement")
              }
              disabled={item?.quantity === 1}
              className="cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed text-primarymagenta hover:bg-creamline hover:text-secondary rounded-full p-2"
            >
              <AiOutlineMinus className='text-[16px] lg:text-[18px]' />
            </button>
            <input
              value={item.quantity}
              readOnly
              className="w-6 text-center bg-transparent focus:outline-none text-[16px] lg:text-[18px]"
            />
            <button
              onClick={() =>
                token
                  ? addToCartDB(item?.combo_id ? item?.combo_id : item?.product_variant_id, 1, item?.combo_id && "combo")
                  : addToCartDBGuest(item?.combo_id ? item?.combo_id : item?.product_variant_id, 1, item?.combo_id && "combo")
              }
              className="cursor-pointer text-primarymagenta hover:bg-creamline hover:text-secondary rounded-full p-2"
            >
              <GoPlus className='text-[16px] lg:text-[18px]' />
            </button>
          </div>
        </td>

        {/* Subtotal */}
        <td className="py-[10px] lg:py-[20px] px-[15px] lg:px-[30px] lg:w-1/6 text-[14px] lg:text-[16px]">
          <span className="dirham-symbol">ê</span> {(item.price * item.quantity).toFixed(0)}
        </td>
      </tr>

      {/* showing combo here  */}
      {/* {
        item?.items?.length > 0 &&

        <div className='px-4 py-2 mt-2 rounded-[10px] text-primarymagenta bg-white'>
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
                  <div className='flex items-center gap-4 py-2 border-t border-creamline'>
                    <div className="relative w-[40px] h-[40px] p-[10px] rounded-[10px] overflow-hidden bg-white flex-shrink-0">
                      <Image
                        alt={product.name}
                        src={product.thumbnail_image}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <Link href={`/shop/${product?.slug}?variant=${product?.variant}`} className='text-[14px] hover:text-secondary'>{product?.name} {product.variant && <span className='px-4 py-0.5 bg-primarycream text-button rounded-[10px]'>{product.variant}</span>}</Link>
                    </div>
                  </div>)
              }
            </div>
          }
        </div>
      } */}
    </>
  );
}
