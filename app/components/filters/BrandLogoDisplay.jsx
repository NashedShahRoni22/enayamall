import { IoCloseOutline } from "react-icons/io5";
import Image from "next/image";

const BrandLogoDisplay = ({ brands, brandIds, setBrandIds }) => {
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
    <div className="flex flex-wrap gap-[12px] mb-[20px]">
      {selectedBrands.map((brand) => (
        <div 
          key={brand.id} 
          className="relative bg-white rounded-[10px] border border-creamline hover:border-natural shadow-sm"
        >
          {/* Close button */}
          <button
            onClick={() => removeBrandId(brand.id)}
            className="absolute -top-[8px] -right-[8px] bg-natural text-white rounded-full size-[20px] shadow-md transition-colors duration-200 z-50 cursor-pointer"
          >
          </button>
          
          {/* Brand logo */}
          <div className="w-[120px] h-[60px]">
            <Image
              src={brand.logo}
              alt={brand.name}
              fill
              className="object-contain"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default BrandLogoDisplay;