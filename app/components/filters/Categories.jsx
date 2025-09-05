import { ChevronDown, ChevronRight, ChevronUp } from "lucide-react";
import { useState } from "react";
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";

export default function Categories({ categories, parentCategorytIds, setParentCategorytIds, childCategoryId, setChildCategoryId, lang }) {
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
        <div className="border-b border-gray-300 pb-6 px-2">
            <div className="flex justify-between items-center cursor-pointer" onClick={() => setShow(!show)}>
                <h3 className="text-md font-[500] text-primaryblack">{lang === "en" ? "Categories" : "فئات"}</h3>
                <button onClick={() => {
                    setShow(!show)
                }} className="cursor-pointer">
                    {
                        !show ?
                            <ChevronDown className="text-primaryblack" size={18} strokeWidth={1.5} />
                            :
                            <ChevronUp className="text-primaryblack" size={18} strokeWidth={1.5} />
                    }
                </button>
            </div>
            {
                show &&

                <>
                    <div className="flex flex-col pt-2">
                        {
                            categories?.map((category, index) =>
                                <div key={index}>
                                    {/* parent category  */}
                                    <div
                                        onClick={() => handleParentCheckboxChange(category?.id)}
                                        className="text-[15px] flex justify-between w-full items-center cursor-pointer py-[1px]">
                                        <div className="flex gap-[10px] items-center">
                                            <span>
                                                {parentCategorytIds.includes(category?.id)
                                                    ? <MdCheckBox className="size-[16px] text-primary" />
                                                    : <MdCheckBoxOutlineBlank className="size-[16px] text-primaryblack" />}

                                            </span>
                                            <p className={parentCategorytIds.includes(category?.id) ? "text-primary font-[300] text-[15px]" : "text-primaryblack"}>
                                                {/* {category?.name} */}
                                                {lang === "en" ? category?.name : category?.ar_name }
                                            </p>
                                        </div>
                                        {
                                            category?.child?.length > 0 &&
                                            <>{parentCategorytIds.includes(category?.id) ?
                                                <ChevronUp className="text-primary" size={14} /> :
                                                <ChevronRight size={14} />
                                            }</>
                                        }
                                    </div>
                                    {/* child category  */}
                                    {(category?.child?.length > 0 && parentCategorytIds.includes(category?.id)) && (
                                        <div className="mt-[4px] ml-[10px] mb-[8px] text-[14px] flex flex-col">
                                            {category?.child?.map((categoryChild, i) => (
                                                <div
                                                    key={i}
                                                    className="flex gap-[10px] items-center w-full cursor-pointer"
                                                    onClick={() => handleChildCheckboxChange(categoryChild?.id)}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        name={categoryChild?.name}
                                                        id={categoryChild?.id}
                                                        checked={childCategoryId === categoryChild?.id}
                                                        onChange={(e) => e.stopPropagation()}
                                                        className={`appearance-none w-4 h-4 border border-primaryblack rounded-full text-[14px] ${childCategoryId === categoryChild?.id
                                                            ? "bg-primary !border-primary"
                                                            : "bg-white"
                                                            }`}
                                                    />
                                                    <span className={childCategoryId === categoryChild?.id ? "text-primary" : "text-primaryblack"}>
                                                        {/* {categoryChild?.name} */}
                                                        {lang === "en" ? categoryChild?.name : categoryChild?.ar_name }
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