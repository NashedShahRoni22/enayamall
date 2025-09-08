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
import { useGetDataWithToken } from "../helpers/useGetDataWithToken";
import { usePathname } from "next/navigation";

const BillForm = ({ address, addressId, setAddressId, selectedDistrictId, setSelectedDistrictId }) => {
    const location = usePathname();
    const { token } = useAppContext();
    const [showForm, setShowForm] = useState(false);
    const [editableAddress, setEditableAddress] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedCountryId, setSelectedCountryId] = useState(null);

    // Fetch countries & districts (cities)
    const { data: countriesData, isLoading: isCountriesLoading } = useGetDataWithToken('countries', token);
    const { data: districtsData, isLoading: isDistrictsLoading } = useGetDataWithToken(`districts?country_id=${selectedCountryId}`, token);

    // manage address form
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        company: "",
        address1: "",
        address2: "",
        city: "",
        district: "",
        postCode: "",
        additionalInfo: "",
        isDefault: false,
    });


    // handle form errors
    const [errors, setErrors] = useState({});

    // Reset form data when starting fresh (add new address)
    const resetFormData = () => {
        setFormData({
            firstName: "",
            lastName: "",
            company: "",
            address1: "",
            address2: "",
            city: "",
            district: "",
            postCode: "",
            additionalInfo: "",
            isDefault: false,
        });
        setSelectedCountryId(null);
        setSelectedDistrictId(null);
        setErrors({});
    };

    // Update form data when editableAddress changes
    useEffect(() => {
        if (editableAddress && Object.keys(editableAddress).length > 0) {
            // Editing existing address - use the nested objects from API response
            const countryId = editableAddress?.country?.id ? Number(editableAddress.country.id) : null;
            const districtId = editableAddress?.district?.id ? Number(editableAddress.district.id) : null;

            setSelectedCountryId(countryId);
            setSelectedDistrictId(districtId);

            setFormData({
                firstName: editableAddress?.first_name || "",
                lastName: editableAddress?.last_name || "",
                company: editableAddress?.company || "",
                address1: editableAddress?.address_1 || "",
                address2: editableAddress?.address_2 || "",
                city: editableAddress?.district?.name || "", // district name goes to city field
                district: editableAddress?.country?.country_name || "", // country name goes to district field
                postCode: editableAddress?.post_code || "",
                additionalInfo: editableAddress?.additional_info || "",
                isDefault: editableAddress?.is_default === 1 || false,
            });
        } else if (editableAddress !== null) {
            resetFormData();
        }
    }, [editableAddress]);

    // Reset district when country changes (only for new addresses)
    useEffect(() => {
        if (selectedCountryId && (!editableAddress || Object.keys(editableAddress).length === 0)) {
            setSelectedDistrictId(null);
            setFormData(prev => ({ ...prev, city: "" })); // reset city (district name)
        }
    }, [selectedCountryId, editableAddress]);

    // Update form names when user selects new country/district (for new addresses only)
    useEffect(() => {
        if (!editableAddress || Object.keys(editableAddress).length === 0) {
            if (selectedCountryId && countriesData?.data) {
                const country = countriesData.data.find(c => c.id.toString() === selectedCountryId.toString());
                const countryName = country ? country.country_name || "" : "";
                setFormData(prev => ({ ...prev, district: countryName })); // country name goes to district field
            }

            if (selectedDistrictId && districtsData?.data) {
                const district = districtsData.data.find(d => d.id.toString() === selectedDistrictId.toString());
                const districtName = district ? district.name || "" : "";
                setFormData(prev => ({ ...prev, city: districtName })); // district name goes to city field
            }
        }
    }, [selectedCountryId, selectedDistrictId, countriesData, districtsData, editableAddress]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        setErrors(prev => ({ ...prev, [name]: "" }));
    };

    // Handle country change (this was previously district change)
    const handleCountryChange = (e) => {
        const countryId = e.target.value;
        const selectedCountry = countriesData?.data?.find(c => c.id.toString() === countryId);

        setSelectedCountryId(countryId ? Number(countryId) : null);
        setSelectedDistrictId(null);
        setFormData(prev => ({
            ...prev,
            district: selectedCountry ? selectedCountry.country_name || "" : "", // country name
            city: "" // reset city (district name)
        }));
        setErrors(prev => ({ ...prev, district: "", city: "" }));
    };

    // Handle district change (this was previously city change)
    const handleDistrictChange = (e) => {
        const districtId = e.target.value;
        const selectedDistrict = districtsData?.data?.find(d => d.id.toString() === districtId);

        setSelectedDistrictId(districtId ? Number(districtId) : null);
        setFormData(prev => ({
            ...prev,
            city: selectedDistrict ? selectedDistrict.name || "" : "" // district name goes to city field
        }));
        setErrors(prev => ({ ...prev, city: "" }));
    };

    // Validate form
    const validate = () => {
        const newErrors = {};

        if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
        if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
        if (!formData.address1.trim()) newErrors.address1 = "Address 1 is required";
        if (!selectedCountryId) newErrors.district = "Country is required";
        if (!selectedDistrictId) newErrors.city = "City is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // add new address
    const postAddress = usePostDataWithToken('add-address');
    const updateAddress = usePostDataWithToken('update-address');
    const queryClient = useQueryClient();

    const handleAddAddress = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        setLoading(true);

        const form = new FormData();
        form.append('first_name', formData.firstName.trim());
        form.append('last_name', formData.lastName.trim());
        form.append('company', formData.company.trim());
        form.append('address_1', formData.address1.trim());
        form.append('address_2', formData.address2.trim());
        form.append('city', selectedDistrictId.toString()); // district ID goes to city field
        form.append('country_id', selectedCountryId.toString()); // country ID
        form.append('district_id', selectedDistrictId.toString()); // district ID
        form.append('post_code', formData.postCode.trim());
        form.append('additional_info', formData.additionalInfo.trim());
        form.append('is_default', formData.isDefault ? '1' : '0');

        try {
            await toast.promise(
                postAddress.mutateAsync({ formData: form, token }),
                {
                    loading: "Submitting address...",
                    success: "Address submitted successfully!",
                    error: (err) => err.message || "Failed to submit address",
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

            updateData.append('first_name', formData.firstName.trim());
            updateData.append('last_name', formData.lastName.trim());
            updateData.append('company', formData.company.trim());
            updateData.append('address_1', formData.address1.trim());
            updateData.append('address_2', formData.address2.trim());
            updateData.append('city', selectedDistrictId.toString()); // district ID goes to city field
            updateData.append('country_id', selectedCountryId.toString()); // country ID
            updateData.append('district_id', selectedDistrictId.toString()); // district ID
            updateData.append('post_code', formData.postCode.trim());
            updateData.append('additional_info', formData.additionalInfo.trim());
            updateData.append('is_default', formData.isDefault ? '1' : '0');
            updateData.append('address_id', addressId.toString());

            await toast.promise(
                updateAddress.mutateAsync({
                    endpoint: 'update-address',
                    token,
                    formData: updateData
                }),
                {
                    loading: "Updating address...",
                    success: "Address updated successfully!",
                    error: (err) => err.message || "Failed to update address",
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
                    loading: "Deleting address...",
                    success: "Address deleted successfully!",
                    error: (err) => err.message || "Failed to delete address",
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
                            <p className="text-[18px] md:text-[20px] font-[650] text-primaryblack">Shipping Details</p>
                            <button
                                onClick={handleCancelForm}
                                className="px-[16px] py-[8px] bg-button text-white rounded-[10px] cursor-pointer"
                            >
                                Cancel
                            </button>
                        </div>
                        <div className="bg-creamline h-[1px] w-full mt-[10px] sm:mt-[30px] mb-[10px]"></div>
                        <div className="">
                            {/* Personal Information Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-[10px] sm:gap-[20px] mb-5">
                                {/* First Name */}
                                <div>
                                    <label className="flex justify-between font-medium text-gray-700">
                                        <p>First name <span className="text-button">*</span></p>
                                        {errors.firstName && (
                                            <span className="text-button ml-2">{errors.firstName}</span>
                                        )}
                                    </label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className={`w-full px-[10px] sm:px-[20px] py-[12px] border ${errors.firstName ? "border-button" : "border-gray-300"} rounded-md focus:outline-none mt-[10px] text-[16px] text-primaryblack`}
                                    />
                                </div>

                                {/* Last Name */}
                                <div>
                                    <label className="flex justify-between font-medium text-gray-700">
                                        <p>Last name <span className="text-button">*</span></p>
                                        {errors.lastName && (
                                            <span className="text-button ml-2">{errors.lastName}</span>
                                        )}
                                    </label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className={`w-full px-[10px] sm:px-[20px] py-[12px] border ${errors.lastName ? "border-button" : "border-gray-300"} rounded-md focus:outline-none mt-[10px] text-[16px] text-primaryblack`}
                                    />
                                </div>

                                {/* Company */}
                                <div>
                                    <label className="flex justify-between font-medium text-gray-700">
                                        <p>Company</p>
                                    </label>
                                    <input
                                        type="text"
                                        name="company"
                                        value={formData.company}
                                        onChange={handleChange}
                                        className="w-full px-[10px] sm:px-[20px] py-[12px] border border-gray-300 rounded-md focus:outline-none mt-[10px] text-[16px] text-primaryblack"
                                    />
                                </div>
                            </div>

                            {/* Address Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-[10px] sm:gap-[20px]">
                                {/* Address 1 */}
                                <div>
                                    <label className="flex justify-between font-medium text-gray-700">
                                        <p>Address 1 <span className="text-button">*</span></p>
                                        {errors.address1 && (
                                            <span className="text-button ml-2">{errors.address1}</span>
                                        )}
                                    </label>
                                    <input
                                        type="text"
                                        name="address1"
                                        value={formData.address1}
                                        onChange={handleChange}
                                        className={`w-full px-[10px] sm:px-[20px] py-[12px] border ${errors.address1 ? "border-button" : "border-gray-300"} rounded-md focus:outline-none mt-[10px] text-[16px] text-primaryblack`}
                                    />
                                </div>

                                {/* Address 2 */}
                                <div>
                                    <label className="flex justify-between font-medium text-gray-700">
                                        <p>Address 2</p>
                                    </label>
                                    <input
                                        type="text"
                                        name="address2"
                                        value={formData.address2}
                                        onChange={handleChange}
                                        className="w-full px-[10px] sm:px-[20px] py-[12px] border border-gray-300 rounded-md focus:outline-none mt-[10px] text-[16px] text-primaryblack"
                                    />
                                </div>

                                {/* Country Select (was District) */}
                                <div>
                                    <label className="flex justify-between font-medium text-gray-700">
                                        <p>Country <span className="text-button">*</span></p>
                                        {errors.district && (
                                            <span className="text-button ml-2">{errors.district}</span>
                                        )}
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={selectedCountryId || ""}
                                            onChange={handleCountryChange}
                                            disabled={isCountriesLoading}
                                            className={`cursor-pointer appearance-none w-full px-[10px] sm:px-[20px] py-[12px] border ${errors.district ? "border-button" : "border-gray-300"} rounded-md focus:outline-none mt-[10px] text-[16px] text-primaryblack bg-white`}
                                        >
                                            <option value="">
                                                {isCountriesLoading ? "Loading countries..." : "Select Country"}
                                            </option>
                                            {countriesData?.data?.map((country) => (
                                                <option key={country.id} value={country.id}>
                                                    {country.country_name}
                                                </option>
                                            ))}
                                        </select>
                                        <BiChevronDown className="absolute top-42/100 right-5 text-xl text-gray-300" />
                                    </div>
                                </div>

                                {/* District Select (was City) - Now labeled as City */}
                                <div className="relative">
                                    <label className="flex justify-between font-medium text-gray-700">
                                        <p>City <span className="text-button">*</span></p>
                                        {errors.city && (
                                            <span className="text-button ml-2">{errors.city}</span>
                                        )}
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={selectedDistrictId || ""}
                                            onChange={handleDistrictChange}
                                            disabled={!selectedCountryId || isDistrictsLoading}
                                            className={`cursor-pointer appearance-none w-full px-[10px] sm:px-[20px] py-[12px] border ${errors.city ? "border-button" : "border-gray-300"} rounded-md focus:outline-none mt-[10px] text-[16px] text-primaryblack bg-white`}
                                        >
                                            <option value="">
                                                {!selectedCountryId
                                                    ? "Select country first"
                                                    : isDistrictsLoading
                                                        ? "Loading cities..."
                                                        : "Select City"
                                                }
                                            </option>
                                            {districtsData?.data?.map((district) => (
                                                <option key={district.id} value={district.id}>
                                                    {district.name}
                                                </option>
                                            ))}
                                        </select>
                                        <BiChevronDown className="absolute top-42/100 right-5 text-xl text-gray-300" />
                                    </div>
                                </div>

                                {/* Post Code */}
                                <div>
                                    <label className="flex justify-between font-medium text-gray-700">
                                        <p>Post Code</p>
                                    </label>
                                    <input
                                        type="text"
                                        name="postCode"
                                        value={formData.postCode}
                                        onChange={handleChange}
                                        className="w-full px-[10px] sm:px-[20px] py-[12px] border border-gray-300 rounded-md focus:outline-none mt-[10px] text-[16px] text-primaryblack"
                                    />
                                </div>
                            </div>

                            {/* Additional Address */}
                            <div>
                                <label className="block font-medium text-gray-700 mt-[15px] sm:mt-[30px]">
                                    Additional Address
                                </label>
                                <textarea
                                    name="additionalInfo"
                                    value={formData.additionalInfo}
                                    onChange={handleChange}
                                    className="w-full px-[10px] sm:px-[20px] py-[12px] border border-gray-300 rounded-md focus:outline-none mt-[10px] text-[16px] text-primaryblack"
                                    rows={3}
                                />
                            </div>

                            {/* Default Address Checkbox */}
                            <div className="mt-[15px] sm:mt-[30px]">
                                <label className="flex items-center gap-[10px] cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="isDefault"
                                        checked={formData.isDefault}
                                        onChange={handleChange}
                                        className="w-[18px] h-[18px] text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary"
                                    />
                                    <span className="text-[16px] text-primaryblack">Set as default address</span>
                                </label>
                            </div>

                            {/* Submit Button */}
                            <div className="mt-[15px] sm:mt-[30px]">
                                {editableAddress === null || Object.keys(editableAddress).length === 0 ? (
                                    <button
                                        onClick={handleAddAddress}
                                        disabled={loading}
                                        className={`py-[12px] text-[18px] w-full ease-linear duration-300 font-medium rounded-md cursor-pointer ${loading
                                            ? 'bg-creamline text-primaryblack cursor-not-allowed'
                                            : 'bg-primary text-white cursor-pointer'
                                            }`}
                                    >
                                        {
                                            loading ? <LoadingSvg label="Saving address..." color="text-primaryblack" /> : "Save address"
                                        }
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleUpdateAddress(editableAddress.id)}
                                        disabled={loading}
                                        className={`py-[12px] text-[18px] w-full ease-linear duration-300 font-medium rounded-md cursor-pointer transition ${loading
                                            ? 'bg-creamline text-primaryblack cursor-not-allowed'
                                            : 'bg-primary text-white cursor-pointer'
                                            }`}
                                    >
                                        {
                                            loading ? <LoadingSvg label="Updating..." color="text-primaryblack" /> : "Update address"
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
                    <div className="bg-creamline p-[20px] rounded-[10px]">
                        {/* add new address button  */}
                        <div className="flex justify-between items-center">
                            <p className="text-[18px] md:text-[20px] text-primaryblack font-[650]">Shipping Details</p>
                            <button
                                onClick={() => {
                                    setEditableAddress({});
                                    setShowForm(true);
                                }}
                                className="flex items-center gap-[6px] sm:gap-[12px] px-[12px] sm:px-[24px] py-[6px] sm:py-[12px] text-[14px] sm:text-[14px] bg-primary rounded-xl text-white cursor-pointer"
                            >
                                <FaPlus />
                                <span>Add new address</span>
                            </button>
                        </div>

                        {/* shipping address  */}
                        {address?.data?.length > 0 ? (
                            <div className="mt-[10px] sm:mt-[40px] flex flex-col gap-[15px] sm:gap-[30px]">
                                {address?.data?.map((a) => (
                                    <div className="flex justify-between items-center" key={a?.id}>
                                        {
                                            location === "/account" ?
                                                <p className="flex gap-[18px] w-4/6 cursor-pointer">
                                                    <p className="text-[16px] text-ash text-left">
                                                        {[
                                                            a?.first_name,
                                                            a?.last_name,
                                                            a?.company,
                                                            a?.address_1,
                                                            a?.address_2,
                                                            a?.district?.name,
                                                            a?.country?.country_name
                                                        ]
                                                            .filter(Boolean)
                                                            .join(', ')}
                                                    </p>
                                                </p>
                                                :
                                                <button onClick={() => setAddressId(a?.id)} className="flex gap-[18px] w-4/6 cursor-pointer">
                                                    <span>
                                                        {
                                                            addressId === a?.id ?
                                                                <MdCheckCircle className="text-[20px] sm:text-[24px] text-primary" />
                                                                :
                                                                <MdOutlineRadioButtonUnchecked className="text-[20px] sm:text-[24px] text-primaryblack" />
                                                        }
                                                    </span>
                                                    <p className="text-[16px] text-ash text-left">
                                                        {[
                                                            a?.first_name,
                                                            a?.last_name,
                                                            a?.company,
                                                            a?.address_1,
                                                            a?.address_2,
                                                            a?.district?.name,
                                                            a?.country?.country_name
                                                        ]
                                                            .filter(Boolean)
                                                            .join(', ')}
                                                    </p>
                                                </button>
                                        }

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
        </section>
    );
};

export default BillForm;