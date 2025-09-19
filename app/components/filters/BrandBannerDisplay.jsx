import { IoCloseOutline } from "react-icons/io5";
import Image from "next/image";

const BrandBannerDisplay = ({ brands, brandIds, setBrandIds, lang }) => {
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
    <div className={`flex justify-between items-center flex-col gap-4 mb-6 ${lang == "en" ? "lg:flex-row" : "lg:flex-row-reverse"}`}>
      <Image src={selectedBrands[0]?.logo} alt={selectedBrands[0]?.name} height={200} width={200}/>
      <div>
        <Image src={lang == "en" ? selectedBrands[0]?.brand_image : selectedBrands[0]?.ar_brand_image} alt={selectedBrands[0]?.name} height={220} width={1070} />
      </div>
    </div>
  );
};

export default BrandBannerDisplay;