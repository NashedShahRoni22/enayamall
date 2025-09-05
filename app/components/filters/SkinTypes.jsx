import React, { useState } from 'react'
import { useGetData } from '../helpers/useGetData';
import { MdCheckBox, MdCheckBoxOutlineBlank } from 'react-icons/md';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

export default function SkinTypes({ skinTypes, skinTypeIds, setSkinTypeIds, }) {
    const [show, setShow] = useState(true);
    
    const handleSkinTypeCheckboxChange = (selectedSkinTypeId) => {
        if (skinTypeIds.includes(selectedSkinTypeId)) {
            // Remove from selected list
            setSkinTypeIds(skinTypeIds.filter(id => id !== selectedSkinTypeId));
        } else {
            // Add to selected list
            setSkinTypeIds([...skinTypeIds, selectedSkinTypeId]);
        }
    };
    return (
        <div className="p-[20px] flex flex-col gap-[20px] text-primaryblack rounded-[5px] border border-creamline">

            <div className="flex justify-between items-center">
                <p className="text-[20px]">Skin Type</p>
                <button onClick={() => {
                    setShow(!show)
                }} className="cursor-pointer">
                    {
                        !show ?
                            <FaChevronDown className="text-primaryblack" />
                            :
                            <FaChevronUp className="text-primaryblack" />
                    }
                </button>
            </div>

            {
                show &&
                <>
                    <div className="h-[1px] w-full bg-primaryblack"></div>
                    {/* brands option will be render here  */}
                    <div className="flex flex-col">
                        {
                            skinTypes?.map((skin, index) =>
                                <div
                                    key={index}
                                    onClick={() => handleSkinTypeCheckboxChange(skin?.id)}
                                    className="flex gap-[10px] items-center text-[16px] p-[8px] rounded-[5px] w-full cursor-pointer hover:bg-creamline">
                                    <span>
                                        {
                                            skinTypeIds.includes(skin?.id)
                                                ?
                                                <MdCheckBox className="size-[20px] text-natural" />
                                                :
                                                <MdCheckBoxOutlineBlank className="size-[20px] text-primaryblack" />
                                        }
                                    </span>
                                    <p className={skinTypeIds.includes(skin?.id) ? "text-natural" : ""}>
                                        {skin?.name}
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
