import { useState, useEffect } from "react";
import { useAppContext } from "@/app/context/AppContext";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import UserProfilePhoto from "./UserProfilePhoto";
import LoadingSvg from "../shared/LoadingSvg";
import { usePostDataWithToken } from "../helpers/usePostDataWithToken";
import { useGetData } from "../helpers/useGetData";
import { BiChevronDown } from "react-icons/bi";

const Profile = ({ address }) => {
    const { user, token } = useAppContext();
    const queryClient = useQueryClient();
    const [userPhoto, setUserPhoto] = useState(null);
    const [previewPhoto, setPreviewPhoto] = useState(address?.photo);
    const [loading, setLoading] = useState(false);
    const [selectedDistrictId, setSelectedDistrictId] = useState(null);
    const [selectedCityId, setSelectedCityId] = useState(null);

    // update address 
    const postAddress = usePostDataWithToken('update-address');

    // Fetch districts & cities
    const { data: districtsData, isLoading: isDistrictsLoading } = useGetData('get-districts');
    const { data: citiesData, isLoading: isCitiesLoading } = useGetData(`get-cities/${selectedDistrictId}`);

    const [formData, setFormData] = useState({
        fullName: "",
        dob: "",
        mobileNumber: "",
        flatNumber: "",
        houseNumber: "",
        roadNumber: "",
        block: "",
        area: "",
        city: "",
        district: "",
        postCode: "",
        additionalAddress: "",
    });

    // Handle form errors
    const [errors, setErrors] = useState({});

    // Helper function to get district name by ID
    const getDistrictNameById = (districtId) => {
        if (!districtsData?.data || !districtId) return '';
        const district = districtsData.data.find(d => d.id.toString() === districtId.toString());
        return district?.name || '';
    };

    // Helper function to get city name by ID
    const getCityNameById = (cityId) => {
        if (!citiesData?.data || !cityId) return '';
        const city = citiesData.data.find(c => c.id.toString() === cityId.toString());
        return city?.name || '';
    };

    useEffect(() => {
        if (address) {
            // Extract district and city IDs from the address data
            const districtId = address?.district ? Number(address.district) : null;
            const cityId = address?.city ? Number(address.city) : null;

            setSelectedDistrictId(districtId);
            setSelectedCityId(cityId);

            setFormData({
                fullName: address.name || "",
                dob: address.date_of_birth || "",
                mobileNumber: address.phone || "",
                flatNumber: address.house_name_or_flat_number || "",
                houseNumber: address.house_number || "",
                roadNumber: address.road_number || "",
                block: address.block || "",
                area: address.area || "",
                // Use the name fields from response for display
                city: address.city_name || "",
                district: address.district_name || "",
                postCode: address.post_code || "",
                additionalAddress: address.additional_info || "",
            });
            // Set preview photo from existing address
            setPreviewPhoto(address.photo);
        }
    }, [address]);

    // Reset city when district changes
    useEffect(() => {
        if (selectedDistrictId && address) {
            // Only reset city if we're changing district for existing address
            const currentDistrictId = address?.district ? Number(address.district) : null;
            if (selectedDistrictId !== currentDistrictId) {
                setSelectedCityId(null);
                setFormData(prev => ({ ...prev, city: "" }));
            }
        }
    }, [selectedDistrictId, address]);

    // Update form names when user selects new district/city
    useEffect(() => {
        if (selectedDistrictId && districtsData?.data) {
            const districtName = getDistrictNameById(selectedDistrictId);
            setFormData(prev => ({ ...prev, district: districtName }));
        }

        if (selectedCityId && citiesData?.data) {
            const cityName = getCityNameById(selectedCityId);
            setFormData(prev => ({ ...prev, city: cityName }));
        }
    }, [selectedDistrictId, selectedCityId, districtsData, citiesData]);

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

        if (Object.keys(newErrors).length > 0) {
            toast.error("Please fill all required fields");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);

        try {
            // Use FormData for file uploads
            const updateData = new FormData();

            // Add all form fields
            updateData.append('house_name_or_flat_number', formData.flatNumber.trim());
            updateData.append('date_of_birth', formData.dob.trim());
            updateData.append('house_number', formData.houseNumber.trim());
            updateData.append('road_number', formData.roadNumber.trim() || '');
            updateData.append('block', formData.block.trim() || '');
            updateData.append('area', formData.area.trim());
            updateData.append('city', selectedCityId.toString());
            updateData.append('district', selectedDistrictId.toString());
            updateData.append('post_code', formData.postCode.trim());
            updateData.append('additional_info', formData.additionalAddress.trim() || '');
            updateData.append('name', formData.fullName.trim());
            updateData.append('phone', formData.mobileNumber.trim());
            updateData.append('address_id', address.id.toString());

            // Handle photo upload
            if (userPhoto && userPhoto instanceof File) {
                // New photo file selected
                updateData.append('photo', userPhoto);
            } else if (previewPhoto && typeof previewPhoto === 'string' && !previewPhoto.startsWith('data:')) {
                // Existing photo URL (not a data URL)
                updateData.append('photo', previewPhoto);
            }
            // If no photo or it's a data URL, don't append photo field

            await toast.promise(
                postAddress.mutateAsync({
                    endpoint: 'update-address',
                    token,
                    formData: updateData,
                }),
                {
                    loading: 'Updating address...',
                    success: 'Address updated successfully!',
                    error: (err) => err.message || 'Failed to update address',
                }
            );

            queryClient.invalidateQueries({ queryKey: ['profile-address'] });

        } catch (err) {
            console.error("Update error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            className="bg-white rounded-lg p-[10px] lg:p-[40px]"
            onSubmit={handleSubmit}
        >
            <UserProfilePhoto
                userPhoto={userPhoto}
                setUserPhoto={setUserPhoto}
                previewPhoto={previewPhoto}
                setPreviewPhoto={setPreviewPhoto}
            />

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[10px] sm:gap-[20px]">
                <div>
                    <label className="flex justify-between font-medium text-gray-700 mt-[15px] sm:mt-[30px]">
                        <p>Full name <span className="text-red-500">*</span></p>
                        {errors.fullName && (
                            <span className="text-red-500 ml-2">{errors.fullName}</span>
                        )}
                    </label>
                    <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className={`w-full px-[10px] sm:px-[20px] py-[12px] sm:py-[24px] border ${errors.fullName ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none mt-[10px] sm:mt-[20px] text-[16px] text-primaryblack`}
                    />
                </div>

                <div>
                    <label className="block font-medium text-gray-700 mt-[15px] sm:mt-[30px]">
                        Email address <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        value={user?.email}
                        readOnly
                        className="w-full px-[10px] sm:px-[20px] py-[12px] sm:py-[24px] border border-gray-300 rounded-md focus:outline-none mt-[10px] sm:mt-[20px] text-[16px] text-primaryblack bg-gray-50"
                    />
                </div>
            </div>

            {/* Contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[10px] sm:gap-[20px]">
                <div>
                    <label className="block font-medium text-gray-700 mt-[15px] sm:mt-[30px]">Date of birth</label>
                    <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        className="w-full px-[10px] sm:px-[20px] py-[12px] sm:py-[24px] border border-gray-300 rounded-md focus:outline-none mt-[10px] sm:mt-[20px] text-[16px] text-primaryblack"
                    />
                </div>
                <div>
                    <label className="flex justify-between font-medium text-gray-700 mt-[15px] sm:mt-[30px]">
                        <p>Mobile number <span className="text-red-500">*</span></p>
                        {errors.mobileNumber && (
                            <span className="text-red-500 ml-2">{errors.mobileNumber}</span>
                        )}
                    </label>
                    <input
                        type="tel"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleChange}
                        className={`w-full px-[10px] sm:px-[20px] py-[12px] sm:py-[24px] border ${errors.mobileNumber ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none mt-[10px] sm:mt-[20px] text-[16px] text-primaryblack`}
                    />
                </div>
            </div>

            {/* Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[10px] sm:gap-[20px]">
                {[
                    { label: "Flat number", name: "flatNumber", required: true },
                    { label: "House Number", name: "houseNumber", required: true },
                    { label: "Road number", name: "roadNumber" },
                    { label: "Block", name: "block" },
                    { label: "Area", name: "area", required: true },
                    { label: "Post code", name: "postCode" },
                ].map(({ label, name, required }) => (
                    <div key={name}>
                        <label className="flex justify-between font-medium text-gray-700 mt-[15px] sm:mt-[30px]">
                            <p>{label} {required && <span className="text-red-500">*</span>}</p>
                            {errors[name] && (
                                <span className="text-red-500 ml-2">{errors[name]}</span>
                            )}
                        </label>
                        <input
                            type="text"
                            name={name}
                            value={formData[name]}
                            onChange={handleChange}
                            className={`w-full px-[10px] sm:px-[20px] py-[12px] sm:py-[24px] border ${errors[name] ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none mt-[10px] sm:mt-[20px] text-[16px] text-primaryblack`}
                        />
                    </div>
                ))}

                {/* District Select */}
                <div>
                    <label className="flex justify-between font-medium text-gray-700 mt-[15px] sm:mt-[30px]">
                        <p>District <span className="text-red-500">*</span></p>
                        {errors.district && (
                            <span className="text-red-500 ml-2">{errors.district}</span>
                        )}
                    </label>
                    <div className="relative">
                        <select
                            value={selectedDistrictId || ""}
                            onChange={handleDistrictChange}
                            disabled={isDistrictsLoading}
                            className={`cursor-pointer appearance-none w-full px-[10px] sm:px-[20px] py-[12px] sm:py-[24px] border ${errors.district ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none mt-[10px] sm:mt-[20px] text-[16px] text-primaryblack bg-white`}
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
                <div>
                    <label className="flex justify-between font-medium text-gray-700 mt-[15px] sm:mt-[30px]">
                        <p>City <span className="text-red-500">*</span></p>
                        {errors.city && (
                            <span className="text-red-500 ml-2">{errors.city}</span>
                        )}
                    </label>
                    <div className="relative">
                        <select
                            value={selectedCityId || ""}
                            onChange={handleCityChange}
                            disabled={!selectedDistrictId || isCitiesLoading}
                            className={`cursor-pointer appearance-none w-full px-[10px] sm:px-[20px] py-[12px] sm:py-[24px] border ${errors.city ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none mt-[10px] sm:mt-[20px] text-[16px] text-primaryblack bg-white`}
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
                    rows={3}
                    className="w-full px-[10px] sm:px-[20px] py-[12px] sm:py-[24px] border border-gray-300 rounded-md focus:outline-none mt-[10px] sm:mt-[20px] text-[16px] text-primaryblack"
                />
            </div>

            {/* Submit */}
            <div className="mt-[20px] md:mt-[40px]">
                <button
                    type="submit"
                    disabled={loading}
                    className={`py-[12px] md:py-[24px] text-[18px] ease-linear duration-300 w-full font-medium rounded-md ${loading ? 'bg-creamline cursor-not-allowed' : 'bg-natural hover:bg-creamline hover:text-primaryblack text-white cursor-pointer'}`}
                >
                    {loading ? <LoadingSvg label="Updating profile" color='text-primaryblack' /> : "Update profile"}
                </button>
            </div>
        </form>
    );
};

export default Profile;