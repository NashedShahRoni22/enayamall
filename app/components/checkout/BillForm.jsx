'use client'

import { useEffect, useState } from "react";
import { useAppContext } from "@/app/context/AppContext";
import { usePostDataWithToken } from "../helpers/usePostDataWithToken";
import { useGetData } from "../helpers/useGetData";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { FaPlus } from 'react-icons/fa';
import { MdCheckCircle, MdDeleteOutline, MdEdit, MdOutlineRadioButtonUnchecked } from "react-icons/md";
import { useDeleteDataWithToken } from "../helpers/useDeleteDataWithToken";
import LoadingSvg from "../shared/LoadingSvg";
import { BiChevronDown } from "react-icons/bi";

const BillForm = ({ address, addressId, setAddressId, method, setMethod, selectedDistrictId, setSelectedDistrictId }) => {
    const { token } = useAppContext();
    const [showForm, setShowForm] = useState(false);
    const [editableAddress, setEditableAddress] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedCityId, setSelectedCityId] = useState(null);

    // manage address form
    const [formData, setFormData] = useState({
        fullName: "",
        mobileNumber: "",
        flatNumber: "",
        houseNumber: "",
        area: "",
        city: "",
        district: "",
        postCode: "",
        roadNumber: "",
        block: "",
        additionalAddress: "",
    });

    // handle form errors
    const [errors, setErrors] = useState({});

    // Fetch districts & cities
    const { data: districtsData, isLoading: isDistrictsLoading } = useGetData('get-districts');

    const { data: citiesData, isLoading: isCitiesLoading } = useGetData(`get-cities/${selectedDistrictId}`);

    // Helper function to get district name by ID
    const getDistrictNameById = (districtId) => {
        if (!districtsData?.data || !districtId) return '';
        const district = districtsData.data.find(d => d.id.toString() === districtId.toString());
        return district?.name || '';
    };

    // Reset form data when starting fresh (add new address)
    const resetFormData = () => {
        setFormData({
            fullName: "",
            mobileNumber: "",
            flatNumber: "",
            houseNumber: "",
            area: "",
            city: "",
            district: "",
            postCode: "",
            roadNumber: "",
            block: "",
            additionalAddress: "",
        });
        setSelectedDistrictId(null);
        setSelectedCityId(null);
        setErrors({});
    };

    // Update form data when editableAddress changes
    useEffect(() => {
        if (editableAddress && Object.keys(editableAddress).length > 0) {
            // Editing existing address
            const districtId = editableAddress?.district ? Number(editableAddress.district) : null;
            const cityId = editableAddress?.city ? Number(editableAddress.city) : null;

            setSelectedDistrictId(districtId);
            setSelectedCityId(cityId);

            // Use the name fields from response for display
            setFormData({
                fullName: editableAddress?.name || "",
                mobileNumber: editableAddress?.phone || "",
                flatNumber: editableAddress?.house_name_or_flat_number || "",
                houseNumber: editableAddress?.house_number || "",
                area: editableAddress?.area || "",
                city: editableAddress?.city_name || "", 
                district: editableAddress?.district_name || "", 
                postCode: editableAddress?.post_code || "",
                roadNumber: editableAddress?.road_number || "",
                block: editableAddress?.block || "",
                additionalAddress: editableAddress?.additional_info || "",
            });
        } else if (editableAddress !== null) {
            resetFormData();
        }
    }, [editableAddress]);

    // Reset city when district changes (only for new addresses)
    useEffect(() => {
        if (selectedDistrictId && (!editableAddress || Object.keys(editableAddress).length === 0)) {
            setSelectedCityId(null);
            setFormData(prev => ({ ...prev, city: "" }));
        }
    }, [selectedDistrictId, editableAddress]);

    // Update form names when user selects new district/city (for new addresses only)
    useEffect(() => {
        if (!editableAddress || Object.keys(editableAddress).length === 0) {
            if (selectedDistrictId && districtsData?.data) {
                const districtName = getDistrictNameById(selectedDistrictId);
                setFormData(prev => ({ ...prev, district: districtName }));
            }

            if (selectedCityId && citiesData?.data) {
                const cityName = citiesData.data.find(c => c.id.toString() === selectedCityId.toString())?.name || "";
                setFormData(prev => ({ ...prev, city: cityName }));
            }
        }
    }, [selectedDistrictId, selectedCityId, districtsData, citiesData, editableAddress]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: "" }));
    };

    // Handle district change
    const handleDistrictChange = (e) => {
        const districtId = e.target.value;
        const selectedDistrict = districtsData?.data?.find(d => d.id.toString() === districtId);

        setSelectedDistrictId(districtId ? Number(districtId) : null);
        setSelectedCityId(null); // Reset city when district changes
        setFormData(prev => ({
            ...prev,
            district: selectedDistrict?.name || "",
            city: "" // Reset city name
        }));
        setErrors(prev => ({ ...prev, district: "", city: "" }));
    };

    // Handle city change
    const handleCityChange = (e) => {
        const cityId = e.target.value;
        const selectedCity = citiesData?.data?.find(c => c.id.toString() === cityId);

        setSelectedCityId(cityId ? Number(cityId) : null);
        setFormData(prev => ({
            ...prev,
            city: selectedCity?.name || ""
        }));
        setErrors(prev => ({ ...prev, city: "" }));
    };

    // Validate form
    const validate = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) newErrors.fullName = "Name is required";
        if (!formData.mobileNumber.trim()) newErrors.mobileNumber = "Mobile number is required";
        if (!formData.flatNumber.trim()) newErrors.flatNumber = "Flat number is required";
        if (!formData.houseNumber.trim()) newErrors.houseNumber = "House number is required";
        if (!formData.area.trim()) newErrors.area = "Area is required";
        if (!selectedDistrictId) newErrors.district = "District is required";
        if (!selectedCityId) newErrors.city = "City is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // add new address
    const postAddress = usePostDataWithToken('address');
    const updateAddress = usePostDataWithToken('update-address');
    const queryClient = useQueryClient();

    const handleAddAddress = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        setLoading(true);

        const form = new FormData();
        form.append('name', formData.fullName.trim());
        form.append('phone', formData.mobileNumber.trim());
        form.append('house_name_or_flat_number', formData.flatNumber.trim());
        form.append('house_number', formData.houseNumber.trim());
        form.append('road_number', formData.roadNumber.trim() || '');
        form.append('block', formData.block.trim() || '');
        form.append('area', formData.area.trim());
        form.append('city', selectedCityId.toString()); 
        form.append('district', selectedDistrictId.toString()); 
        form.append('post_code', formData.postCode.trim());
        form.append('additional_info', formData.additionalAddress.trim() || '');

        try {
            await toast.promise(
                postAddress.mutateAsync({ formData: form, token }),
                {
                    loading: 'Submitting address...',
                    success: 'Address submitted successfully!',
                    error: (err) => err.message || 'Failed to submit address',
                }
            );
            setShowForm(false);
            setEditableAddress(null);
            resetFormData();
            queryClient.invalidateQueries({ queryKey: ['address'] });
        } catch (err) {
            console.error("Submission error:", err);
        } finally {
            setLoading(false)
        }
    };

    // update address 
    const handleUpdateAddress = async (addressId) => {
        if (!validate()) return;
        setLoading(true);
        try {
            const updateData = new FormData();

            // Add all required fields 
            updateData.append('house_name_or_flat_number', formData.flatNumber.trim());
            updateData.append('house_number', formData.houseNumber.trim());
            updateData.append('road_number', formData.roadNumber.trim() || '');
            updateData.append('block', formData.block.trim() || '');
            updateData.append('area', formData.area.trim());
            updateData.append('city', selectedCityId.toString()); // Send city ID
            updateData.append('district', selectedDistrictId.toString()); // Send district ID
            updateData.append('post_code', formData.postCode.trim());
            updateData.append('additional_info', formData.additionalAddress.trim() || '');
            updateData.append('name', formData.fullName.trim());
            updateData.append('phone', formData.mobileNumber.trim());
            updateData.append('address_id', addressId.toString());

            await toast.promise(
                updateAddress.mutateAsync({
                    endpoint: 'update-address',
                    token,
                    formData: updateData
                }),
                {
                    loading: 'Updating address...',
                    success: 'Address updated successfully!',
                    error: (err) => err.message || 'Failed to update address',
                }
            );

            queryClient.invalidateQueries({ queryKey: ['address'] });
            setShowForm(false);
            setEditableAddress(null);
            resetFormData();

        } catch (error) {
            console.error("Update error:", error);
        } finally {
            setLoading(false)
        }
    };

    // Remove address
    const deleteItem = useDeleteDataWithToken();
    const removeAddress = async (id) => {
        try {
            await toast.promise(
                deleteItem.mutateAsync({
                    endpoint: `address/${id}`,
                    token,
                }),
                {
                    loading: 'Deleting address...',
                    success: 'Address deleted successfully!',
                    error: (err) => err.message || 'Failed to delete address',
                }
            );
            queryClient.invalidateQueries({ queryKey: ['address'] });
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    // Handle form cancellation
    const handleCancelForm = () => {
        setShowForm(false);
        setEditableAddress(null);
        resetFormData();
    };

    return (
        <section>
            {showForm ? (
                <>
                    {/* address form  */}
                    <div>
                        <div className="flex justify-between items-center">
                            <p className="text-[18px] md:text-[20px] font-[650] text-primarymagenta">Shipping details</p>
                            <button
                                onClick={handleCancelForm}
                                className="px-[16px] py-[8px] bg-button text-white rounded-[10px] cursor-pointer"
                            >
                                Cancel
                            </button>
                        </div>
                        <div className="bg-natural h-[1px] w-full mt-[10px] sm:mt-[20px] mb-[20px]  sm:mb-[40px]"></div>
                        <div className="">
                            {/* Personal Information Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-[10px] sm:gap-[20px]">
                                {/* Full Name */}
                                <div>
                                    <label className="flex justify-between font-medium text-gray-700 mt-[15px] sm:mt-[30px]">
                                        <p>Full name <span className="text-button">*</span></p>
                                        {errors.fullName && (
                                            <span className="text-button ml-2">{errors.fullName}</span>
                                        )}
                                    </label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        className={`w-full px-[10px] sm:px-[20px] py-[12px] sm:py-[24px] border ${errors.fullName ? "border-button" : "border-gray-300"} rounded-md focus:outline-none mt-[20px] text-[16px] text-primarymagenta`}
                                    />
                                </div>

                                {/* Mobile Number */}
                                <div>
                                    <label className="flex justify-between font-medium text-gray-700 mt-[15px] sm:mt-[30px]">
                                        <p>Mobile number <span className="text-button">*</span></p>
                                        {errors.mobileNumber && (
                                            <span className="text-button ml-2">{errors.mobileNumber}</span>
                                        )}
                                    </label>
                                    <input
                                        type="tel"
                                        name="mobileNumber"
                                        value={formData.mobileNumber}
                                        onChange={handleChange}
                                        className={`w-full px-[10px] sm:px-[20px] py-[12px] sm:py-[24px] border ${errors.mobileNumber ? "border-button" : "border-gray-300"} rounded-md focus:outline-none mt-[20px] text-[16px] text-primarymagenta`}
                                    />
                                </div>
                            </div>

                            {/* Address Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-[10px] sm:gap-[20px]">
                                {[
                                    { label: "Flat number", name: "flatNumber" },
                                    { label: "House Number", name: "houseNumber" },
                                    { label: "Road number", name: "roadNumber" },
                                    { label: "Block", name: "block" },
                                    { label: "Area", name: "area" },
                                    { label: "Post code", name: "postCode" },
                                ].map((field) => (
                                    <div key={field.name}>
                                        <label className="flex justify-between font-medium text-gray-700 mt-[15px] sm:mt-[30px]">
                                            <p>{field.label}
                                                {["flatNumber", "houseNumber", "area"].includes(field.name) && (
                                                    <span className="text-button"> *</span>
                                                )}
                                            </p>
                                            {errors[field.name] && (
                                                <span className="text-button ml-2">{errors[field.name]}</span>
                                            )}
                                        </label>
                                        <input
                                            type="text"
                                            name={field.name}
                                            value={formData[field.name]}
                                            onChange={handleChange}
                                            className={`w-full px-[10px] sm:px-[20px] py-[12px] sm:py-[24px] border ${errors[field.name] ? "border-button" : "border-gray-300"} rounded-md focus:outline-none mt-[20px] text-[16px] text-primarymagenta`}
                                        />
                                    </div>
                                ))}

                                {/* District Select */}
                                <div>
                                    <label className="flex justify-between font-medium text-gray-700 mt-[15px] sm:mt-[30px]">
                                        <p>District <span className="text-button">*</span></p>
                                        {errors.district && (
                                            <span className="text-button ml-2">{errors.district}</span>
                                        )}
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={selectedDistrictId || ""}
                                            onChange={handleDistrictChange}
                                            disabled={isDistrictsLoading}
                                            className={`cursor-pointer appearance-none w-full px-[10px] sm:px-[20px] py-[12px] sm:py-[24px] border ${errors.district ? "border-button" : "border-gray-300"} rounded-md focus:outline-none mt-[20px] text-[16px] text-primarymagenta bg-white`}
                                        >
                                            <option value="">
                                                {isDistrictsLoading ? "Loading districts..." : "Select District"}
                                            </option>
                                            {districtsData?.data?.map((district) => (
                                                <option key={district.id} value={district.id}>
                                                    {district.name}
                                                </option>
                                            ))}
                                        </select>
                                        <BiChevronDown className="absolute top-1/2 right-5 text-xl text-natural" />
                                    </div>
                                </div>

                                {/* City Select */}
                                <div className="relative">
                                    <label className="flex justify-between font-medium text-gray-700 mt-[15px] sm:mt-[30px]">
                                        <p>City <span className="text-button">*</span></p>
                                        {errors.city && (
                                            <span className="text-button ml-2">{errors.city}</span>
                                        )}
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={selectedCityId || ""}
                                            onChange={handleCityChange}
                                            disabled={!selectedDistrictId || isCitiesLoading}
                                            className={`cursor-pointer appearance-none w-full px-[10px] sm:px-[20px] py-[12px] sm:py-[24px] border ${errors.city ? "border-button" : "border-gray-300"} rounded-md focus:outline-none mt-[20px] text-[16px] text-primarymagenta bg-white`}
                                        >
                                            <option value="">
                                                {!selectedDistrictId
                                                    ? "Select district first"
                                                    : isCitiesLoading
                                                        ? "Loading cities..."
                                                        : "Select City"
                                                }
                                            </option>
                                            {citiesData?.data?.map((city) => (
                                                <option key={city.id} value={city.id}>
                                                    {city.name}
                                                </option>
                                            ))}
                                        </select>
                                        <BiChevronDown className="absolute top-1/2 right-5 text-xl text-natural" />
                                    </div>
                                </div>
                            </div>

                            {/* Additional Address */}
                            <div>
                                <label className="block font-medium text-gray-700 mt-[15px] sm:mt-[30px]">
                                    Additional Address for better finding
                                </label>
                                <textarea
                                    name="additionalAddress"
                                    value={formData.additionalAddress}
                                    onChange={handleChange}
                                    className="w-full px-[10px] sm:px-[20px] py-[12px] sm:py-[24px] border border-gray-300 rounded-md focus:outline-none mt-[20px] text-[16px] text-primarymagenta"
                                    rows={3}
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="mt-[15px] sm:mt-[30px]">
                                {editableAddress === null || Object.keys(editableAddress).length === 0 ? (
                                    <button
                                        onClick={handleAddAddress}
                                        disabled={loading}
                                        className={`py-[12px] sm:py-[24px] text-[18px] w-full ease-linear duration-300 font-medium rounded-md cursor-pointer ${loading
                                            ? 'bg-creamline text-primarymagenta cursor-not-allowed'
                                            : 'bg-natural text-white hover:bg-creamline hover:text-primarymagenta cursor-pointer'
                                            }`}
                                    >
                                        {
                                            loading ? <LoadingSvg label="Saving address" color="text-primarymagenta" /> : "Save address"
                                        }
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleUpdateAddress(editableAddress.id)}
                                        disabled={loading}
                                        className={`py-[12px] sm:py-[24px] text-[18px] w-full ease-linear duration-300 font-medium rounded-md cursor-pointer transition ${loading
                                            ? 'bg-creamline text-primarymagenta cursor-not-allowed'
                                            : 'bg-natural text-white hover:bg-creamline hover:text-primarymagenta cursor-pointer'
                                            }`}
                                    >
                                        {
                                            loading ? <LoadingSvg label="Updating" color="text-primarymagenta" /> : "Update address"
                                        }
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    {/* shipping details management  */}
                    <div className="bg-[#FCF7EE]  py-[16px] sm:py-[20px]  px-[20px] sm:px-[40px] rounded-[10px]">
                        {/* add new address button  */}
                        <div className="flex justify-between items-center">
                            <p className="text-[18px] md:text-[20px] text-primarymagenta font-[650]">Shipping details</p>
                            <button
                                onClick={() => {
                                    setEditableAddress({});
                                    setShowForm(true);
                                }}
                                className="flex items-center gap-[6px] sm:gap-[12px] px-[12px] sm:px-[24px] py-[6px] sm:py-[12px] text-[14px] sm:text-[18px] bg-white rounded-[10px] text-natural cursor-pointer"
                            >
                                <FaPlus />
                                <span>Add new address</span>
                            </button>
                        </div>

                        {/* shipping address  */}
                        {address?.is_completed ? (
                            <div className="mt-[20px] sm:mt-[40px] flex flex-col gap-[15px] sm:gap-[30px]">
                                {address?.data?.map((a) => (
                                    <div className="flex justify-between items-center" key={a?.id}>
                                        <button onClick={() => setAddressId(a?.id)} className="flex gap-[18px] w-4/6 cursor-pointer">
                                            <span>
                                                {
                                                    addressId === a?.id ?
                                                        <MdCheckCircle className="text-[20px] sm:text-[24px] text-natural" />
                                                        :
                                                        <MdOutlineRadioButtonUnchecked className="text-[20px] sm:text-[24px] text-primarymagenta" />
                                                }
                                            </span>
                                            <p className="text-[16px] text-ash text-left">
                                                {[
                                                    a?.name,
                                                    a?.phone,
                                                    a?.house_name_or_flat_number,
                                                    a?.house_number,
                                                    // Use the city_name and district_name from response for display
                                                    a?.city_name,
                                                    a?.district_name
                                                ]
                                                    .filter(Boolean)
                                                    .join(', ')}
                                            </p>
                                        </button>
                                        <div className="flex gap-[16px]">
                                            <button
                                                onClick={() => {
                                                    setEditableAddress(a);
                                                    setShowForm(true);
                                                }}
                                                className="p-[10px] rounded-full bg-orange-100 hover:bg-orange-200 cursor-pointer"
                                            >
                                                <MdEdit className="text-[16px] text-orange-500" />
                                            </button>
                                            <button
                                                onClick={() => removeAddress(a.id)}
                                                className="p-[10px] rounded-full bg-red-100 hover:bg-red-200 cursor-pointer"
                                            >
                                                <MdDeleteOutline className="text-[16px] text-red-500" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-[40px] flex items-center justify-center">
                                <p className="text-[14px] text-button">No address found</p>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* choose options  */}
            <div className="bg-[#F9F9F9] py-[20px]  px-[20px] sm:px-[40px] rounded-[10px] mt-[30px]">
                <p className='text-[18px] text-primarymagenta font-[650]'>
                    Select Payment method
                </p>
                <div className="flex flex-col sm:flex-row gap-[20px] sm:gap-[40px] mt-[15px] sm:mt-[30px]">
                    <button onClick={() => setMethod("cod")} className="flex items-center gap-[6px] sm:gap-[12px] cursor-pointer">
                        <span>
                            {
                                method === "cod" ?
                                    <MdCheckCircle className="text-[20px] sm:text-[24px] text-customgreen" />
                                    :
                                    <MdOutlineRadioButtonUnchecked className="text-[20px] sm:text-[24px] text-primarymagenta" />
                            }
                        </span>
                        <span className={`text-[16px] sm:text-[18px] ${method === "cod" ? "text-customgreen font-[650]" : "text-ash"}`}>Cash on delivery</span>
                    </button>

                    <button onClick={() => setMethod("online")} className="flex items-center gap-[6px] sm:gap-[12px] cursor-pointer">
                        <span>
                            {
                                method === "online" ?
                                    <MdCheckCircle className="text-[20px] sm:text-[24px] text-customgreen" />
                                    :
                                    <MdOutlineRadioButtonUnchecked className="text-[20px] sm:text-[24px] text-primarymagenta" />
                            }
                        </span>
                        <span className={`text-[16px] sm:text-[18px] ${method === "online" ? "text-customgreen font-[650]" : "text-ash"}`}>Pay online</span>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default BillForm;