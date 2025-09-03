import { IoCloseOutline } from "react-icons/io5";
import Image from "next/image";

const BrandBannerDisplay = ({ brands, brandIds, setBrandIds }) => {
  // Function to remove a brand ID from the brandIds array
  const removeBrandId = (idToRemove) => {
    setBrandIds(prevIds => prevIds.filter(id => id !== idToRemove));
  };

  // Early return if brands is not available or brandIds is empty
  if (!brands || !Array.isArray(brands) || !brandIds || brandIds.length === 0) {
    return null;
  }

  // Filter brands based on brandIds
  const selectedBrands = brands.filter(brand => brandIds.includes(brand.id));

  // Don't render anything if no brands are selected
  if (selectedBrands.length === 0) {
    return null;
  }

  return (
    <div className="flex justify-between items-center">
      <Image src={selectedBrands[0]?.logo} alt="Banner Image" height={160} width={240} className="hidden lg:block" />
      <div>
        <Image src={selectedBrands[0]?.ar_brand_image} alt="Banner Image" height={500} width={1000} />
      </div>
    </div>
  );
};

export default BrandBannerDisplay;