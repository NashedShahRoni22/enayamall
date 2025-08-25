import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";

export default function Categories({ categories, parentCategorytIds, setParentCategorytIds, childCategoryId, setChildCategoryId }) {
    const [show, setShow] = useState(true);

    const handleParentCheckboxChange = (categoryId) => {
        if (parentCategorytIds.includes(categoryId)) {
            // Remove from selected list
            setParentCategorytIds(parentCategorytIds.filter(id => id !== categoryId));
        } else {
            // Add to selected list
            setParentCategorytIds([...parentCategorytIds, categoryId]);
        }
    };


    const handleChildCheckboxChange = (childId) => {
        if (childCategoryId === childId) {
            // If clicking the same child checkbox, uncheck it
            setChildCategoryId(null);
        } else {
            // Check the new child checkbox
            setChildCategoryId(childId);
        }
    };

    return (
        <div className="p-[20px] flex flex-col gap-[20px] text-primarymagenta rounded-[5px] border border-creamline">
            <div className="flex justify-between items-center">
                <p className="text-[20px]">Categories</p>
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
                    <div className="h-[1px] w-full bg-creamline"></div>
                    <div className="flex flex-col">
                        {
                            categories?.map((category, index) =>
                                <div key={index}>
                                    {/* parent category  */}
                                    <div
                                        onClick={() => handleParentCheckboxChange(category?.id)}
                                        className="text-[16px] flex justify-between p-[8px] rounded-[5px] w-full items-center cursor-pointer hover:bg-creamline">
                                        <div className="flex gap-[10px] items-center">
                                            <span>
                                                {parentCategorytIds.includes(category?.id)
                                                    ? <MdCheckBox className="size-[20px] text-secondary" />
                                                    : <MdCheckBoxOutlineBlank className="size-[20px] text-primarymagenta" />}

                                            </span>
                                            <p className={parentCategorytIds.includes(category?.id) ? "text-secondary" : ""}>
                                                {category?.name}
                                            </p>
                                        </div>
                                        {
                                            category?.child?.length > 0 &&
                                            <>{parentCategorytIds.includes(category?.id) ?
                                                <FaChevronUp className="text-secondary" /> :
                                                <FaChevronDown />
                                            }</>
                                        }
                                    </div>
                                    {/* child category  */}
                                    {(category?.child?.length > 0 && parentCategorytIds.includes(category?.id)) && (
                                        <div className="mt-[10px] ml-[20px] text-[14px] flex flex-col">
                                            {category?.child?.map((categoryChild, i) => (
                                                <div
                                                    key={i}
                                                    className="flex gap-[10px] items-center p-[8px] rounded-[5px] w-full cursor-pointer hover:bg-creamline"
                                                    onClick={() => handleChildCheckboxChange(categoryChild?.id)}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        name={categoryChild?.name}
                                                        id={categoryChild?.id}
                                                        checked={childCategoryId === categoryChild?.id}
                                                        onChange={(e) => e.stopPropagation()}
                                                        className={`appearance-none w-4 h-4 border border-primarymagenta rounded-full ${childCategoryId === categoryChild?.id
                                                            ? "bg-secondary !border-secondary"
                                                            : "bg-white"
                                                            }`}
                                                    />
                                                    <span className={childCategoryId === categoryChild?.id ? "text-secondary" : ""}>
                                                        {categoryChild?.name}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                </div>
                            )
                        }
                    </div>
                </>
            }

        </div>
    )
}