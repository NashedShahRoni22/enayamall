import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";
import { useGetData } from "../helpers/useGetData";
import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

export default function Brands({ brands, brandIds, setBrandIds }) {
    const [show, setShow ] = useState(true);

    const handleBrandCheckboxChange = (selectedBrandId) => {
        if (brandIds.includes(selectedBrandId)) {
            // Remove from selected list
            setBrandIds(brandIds.filter(id => id !== selectedBrandId));
        } else {
            // Add to selected list
            setBrandIds([...brandIds, selectedBrandId]);
        }
    };

    return (
        <div className="p-[20px] flex flex-col gap-[20px] text-primarymagenta rounded-[5px] border border-creamline">
            <div className="flex justify-between items-center">
                <p className="text-[20px]">Brands</p>
                <button onClick={() => {
                    setShow(!show)
                }} className="cursor-pointer">
                    {
                        !show ?
                            <FaChevronDown className="text-primarymagenta" />
                            :
                            <FaChevronUp className="text-primarymagenta" />
                    }
                </button>
            </div>
            {
                show &&

                <>
                    <div className="h-[1px] w-full bg-primarymagenta"></div>
                    {/* brands option will be render here  */}
                    <div className="flex flex-col">
                        {
                           brands?.map((brand, index) =>
                                <div
                                    key={index}
                                    onClick={() => handleBrandCheckboxChange(brand?.id)}
                                    className="flex gap-[10px] items-center text-[16px] p-[8px] rounded-[5px] w-full cursor-pointer hover:bg-creamline">
                                    <span>
                                        {
                                            brandIds.includes(brand?.id)
                                                ?
                                                <MdCheckBox className="size-[20px] text-natural" />
                                                :
                                                <MdCheckBoxOutlineBlank className="size-[20px] text-primarymagenta" />
                                        }
                                    </span>
                                    <p className={brandIds.includes(brand?.id)  ? "text-natural" : ""}>
                                        {brand?.name}
                                    </p>
                                </div>
                            )
                        }
                    </div>
                </>
            }
        </div>
    )
}