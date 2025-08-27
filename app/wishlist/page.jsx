'use client';
import Image from "next/image";
import Container from "../components/shared/Container";
import PageHeader from "../components/shared/PageHeader";
import errorIcon from "../resources/icons/errorIco.svg";
import ShopNowButton from "../components/shared/ShopNowButton";
import Link from "next/link";
import { useAppContext } from "../context/AppContext";
import { useGetDataWithToken } from "../components/helpers/useGetDataWithToken";
import WishlistCard from "../components/shared/cards/WishlistCard";
// import FlashDeals from "../components/home/FlashDeals";

export default function page() {
  const { token, wishlist, removeFromWishlistDB, addToCartDB } = useAppContext();
  
  return (
    <section>
      <PageHeader title={"Wishlist"} from={"Home"} to={"wishlist"} />
      <Container>
        <section className="lg:max-w-6xl lg:mx-auto">
          {
            token !== null ?
              <>
                {
                  wishlist?.length > 0 ?
                    <div className="pt-[30px] lg:pt-[60px] pb-[60px] lg:pb-[120px] flex flex-col gap-[10px] md:gap-[20px]">
                      {
                        wishlist?.map((w, index) => <WishlistCard key={index} w={w} token={token} removeFromWishlistDB={removeFromWishlistDB} addToCartDB={addToCartDB} />)
                      }
                    </div>
                    :
                    <div className="mt-[10px] h-[60px] py-[20px] bg-errorbg rounded-[5px] flex justify-center items-center gap-[10px]">
                      <Image alt="Error Icon" src={errorIcon} />
                      <p className="text-[18px] text-button">There are no products on the Wishlist!</p>
                    </div>
                }
              </>
              :
              <div>
                <div className="mt-[10px] h-[60px] py-[20px] bg-errorbg rounded-[5px] flex justify-center items-center gap-[10px]">
                  <Image alt="Error Icon" src={errorIcon} />
                  <p className="text-[18px] text-button">Please <Link href={"login"} className="font-[650] underline">login</Link> to use the wishlist.</p>
                </div>
              </div>
          }
          <div className="mt-[50px] mb-[120px] flex justify-center">
            <ShopNowButton />
          </div>
        </section>
        
        {/* Always render FlashDeals, but control visibility with showComponent prop */}
        {/* <FlashDeals showComponent={token === null} /> */}
      </Container>
    </section>
  )
}