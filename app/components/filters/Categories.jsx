"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ChevronUp, ChevronDown } from "lucide-react";

export default function Categories({
  categories = [],
  parentCategorytIds = [],
  setParentCategorytIds,
  childCategoryId,
  setChildCategoryId,
  lang = "en",
}) {
  const [show, setShow] = useState(true);
  const params = useParams();
  const categoryIdFromUrl = params?.categoryId; // expects route like /category/[categoryId]

  const [activeParentId, setActiveParentId] = useState(null);

  // keep activeParentId synced to URL param or first parent selected
  useEffect(() => {
    if (categoryIdFromUrl) {
      const found = categories.find(
        (c) => String(c.id) === String(categoryIdFromUrl)
      );
      setActiveParentId(found ? found.id : null);
    } else if (parentCategorytIds.length > 0) {
      setActiveParentId(parentCategorytIds[0]);
    }
  }, [categoryIdFromUrl, parentCategorytIds, categories]);

  const activeParent = categories.find(
    (c) => String(c.id) === String(activeParentId)
  );

  // toggle parent selection (optional, but keeps state in sync)
  const toggleParentSelection = (id) => {
    setParentCategorytIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // toggle child selection (single select)
  const toggleChildSelect = (id) => {
    setChildCategoryId((prev) => (prev === id ? null : id));
  };

  if (!activeParent) {
    return (
      <div className="p-4 text-sm text-gray-500">
        {lang === "en" ? "Category not found" : "الفئة غير موجودة"}
      </div>
    );
  }

  return (
    <section className="space-y-4">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setShow(!show)}
      >
        <h3 className="text-md font-[500] text-primaryblack">Category</h3>
        <button className="cursor-pointer">
          {show ? (
            <ChevronUp
              className="text-primaryblack"
              strokeWidth={1.5}
              size={18}
            />
          ) : (
            <ChevronDown
              className="text-primaryblack"
              strokeWidth={1.5}
              size={18}
            />
          )}
        </button>
      </div>
      {show && (
        <>
          {/* Parent */}
          <div className="border rounded-md bg-gray-50">
            <span className="font-medium text-gray-900">
              {lang === "en" ? activeParent.name : activeParent.ar_name}
            </span>
          </div>

          {/* Children */}
          {activeParent.child && activeParent.child.length > 0 && (
            <div className="space-y-2">
              {activeParent.child.map((child) => (
                <label
                  key={child.id}
                  className={`flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-gray-50 ${
                    childCategoryId === child.id ? "bg-primary/10" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="child-category"
                    value={child.id}
                    checked={childCategoryId === child.id}
                    onChange={() => toggleChildSelect(child.id)}
                    className="w-4 h-4"
                  />
                  <span
                    className={
                      childCategoryId === child.id
                        ? "text-primary font-medium"
                        : "text-gray-800"
                    }
                  >
                    {lang === "en" ? child.name : child.ar_name}
                  </span>
                </label>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
