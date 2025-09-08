import Image from "next/image";
import Link from "next/link";
import { AiOutlineMinus } from "react-icons/ai";
import { GoPlus } from "react-icons/go";
import { Trash2 } from "lucide-react";

export default function CartTableRow({
  lang,
  token,
  item,
  removeFromCartDB,
  addToCartDB,
  addToCartDBGuest,
  removeFromCartDBGuest,
}) {
  return (
    <div className="mb-3 last:mb-0">
      {/* regular product info  */}
      <div className="p-b-0 p-4 rounded-md bg-white shadow-sm">
        <div className={`flex items-center justify-between border-b border-creamline pb-4 ${lang === 'en' ? '' : 'flex-row-reverse'}`}>
          <div className={`flex gap-[10px] lg:gap-[30px] ${lang === 'en' ? 'flex-row' : 'flex-row-reverse'}`}>
            {/* Fixed responsive image container */}
            <div className="w-[60px] h-[60px] lg:w-[80px] lg:h-[80px] flex items-center justify-center overflow-hidden bg-white flex-shrink-0">
              <Image
                alt={item.name}
                src={item.thumbnail_image}
                width={80}
                height={80}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {/* product name here  */}
            {item?.items?.length > 0 ? (
              <div>
                <Link
                  href={`/combo/${item?.slug}`}
                  className="text-[14px] lg:text-[16px] font-medium flex-1 hover:text-secondary line-clamp-3"
                >
                  {lang === 'en' ? item.name : item.ar_name}{" "}
                  {item.variant && (
                    <span className="px-2 bg-primarycream text-button rounded-[10px]">
                      {item.variant}
                    </span>
                  )}{" "}
                  {item?.items?.length > 0 && (
                    <span className="px-4 py-0.5 bg-primarycream text-button rounded-[10px]">
                      {lang === 'en' ? 'Combo' : 'كومبو'}
                    </span>
                  )}
                </Link>

                <ul className="mt-2">
                  {item?.items?.map((product, index) => (
                    <li key={index}>
                      <Link
                        href={`/shop/${product?.slug}?variant=${product?.variant}`}
                        className="text-[14px] hover:text-secondary line-clamp-1"
                      >
                        {" "}
                        - {lang === 'en' ? product.name : product.ar_name}{" "}
                        {product.variant && <span>-{product.variant}</span>}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div>
                <Link
                  href={`/shop/${item?.slug}?variant=${item?.variant}`}
                  className="text-[14px] lg:text-[16px] font-medium flex-1 hover:text-secondary line-clamp-3"
                >
                  {lang === 'en' ? item.name : item.ar_name}{" "}
                  {item.variant && (
                    <span className="px-2 bg-primarycream text-button rounded-[10px]">
                      {item.variant}
                    </span>
                  )}
                </Link>
              </div>
            )}
          </div>

          <div className={`flex flex-col gap-4 ${lang === 'en' ? 'items-end' : 'items-start'}`}>
            <div className="text-[14px] lg:text-[16px] flex items-center gap-1">
              <span className="dirham-symbol text-[14px]">ê</span> {item?.price}
              <span className="line-through text-ash text-[14px]">{item?.price != item?.original_price ? item?.original_price : null}</span>
              {/* {(item.price * item.quantity).toFixed(0)} */}
            </div>
            <div className="flex items-center text-secondary h-[40px] rounded-[10px] justify-center bg-[#F8F8F8]">
              <button
                onClick={() =>
                  token
                    ? addToCartDB(
                      item?.combo_id
                        ? item?.combo_id
                        : item?.product_variant_id,
                      1,
                      item?.combo_id && "combo",
                      "decrement"
                    )
                    : addToCartDBGuest(
                      item?.combo_id
                        ? item?.combo_id
                        : item?.product_variant_id,
                      1,
                      item?.combo_id && "combo",
                      "decrement"
                    )
                }
                disabled={item?.quantity === 1}
                className="cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed text-primaryblack p-2"
              >
                <AiOutlineMinus className="text-[16px] lg:text-[18px]" />
              </button>
              <input
                value={item.quantity}
                readOnly
                className="w-6 text-center bg-transparent font-semibold focus:outline-none text-primaryblack text-[16px] lg:text-[18px]"
              />
              <button
                onClick={() =>
                  token
                    ? addToCartDB(
                      item?.combo_id
                        ? item?.combo_id
                        : item?.product_variant_id,
                      1,
                      item?.combo_id && "combo"
                    )
                    : addToCartDBGuest(
                      item?.combo_id
                        ? item?.combo_id
                        : item?.product_variant_id,
                      1,
                      item?.combo_id && "combo"
                    )
                }
                className="cursor-pointer text-primaryblack p-2"
              >
                <GoPlus className="text-[16px] lg:text-[18px]" />
              </button>
            </div>
          </div>
        </div>
        {/* remove button  */}
        <div className={`mt-4 flex items-center justify-between ${lang === 'en' ? '' : 'flex-row-reverse'}`}>
          <button
            onClick={() => {
              token
                ? removeFromCartDB(item.cart_id)
                : removeFromCartDBGuest(item.cart_id);
            }}
            className={`cursor-pointer text-[14px] flex items-center gap-1 text-ash ${lang === 'en' ? '' : 'flex-row-reverse'}`}
          >
            <Trash2 size={18} className="text-ash" /> {lang === 'en' ? 'Remove' : 'حذف'}
          </button>
          <div className={`text-[14px] lg:text-[16px] flex items-center gap-1 ${lang === 'en' ? '' : 'flex-row-reverse'}`}>
            <span className="text-[16px] text-ash">
              {lang === 'en' ? 'Sub-total:' : ':المجموع الفرعي'}
            </span>{" "}
            <div className="flex items-center">
              <span className="dirham-symbol text-[14px] mr-1">ê</span>{" "}
              {item?.sub_total}
            </div>
          </div>
        </div>

      </div>

      {/* showing combo here  */}
      {/* {
        item?.items?.length > 0 &&

        <div className='px-4 py-2 mt-2 rounded-[10px] text-primaryblack bg-white'>
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
    </div>
  );
}
