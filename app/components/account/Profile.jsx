import { useState, useEffect } from "react";
import { useAppContext } from "@/app/context/AppContext";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import UserProfilePhoto from "./UserProfilePhoto";
import LoadingSvg from "../shared/LoadingSvg";
import { usePostDataWithToken } from "../helpers/usePostDataWithToken";
import { useGetDataWithToken } from "../helpers/useGetDataWithToken";
import { BiEdit, BiCheck, BiX, BiChevronDown } from "react-icons/bi";

const Profile = ({ profile }) => {
    const { token } = useAppContext();
    const queryClient = useQueryClient();
    const [userPhoto, setUserPhoto] = useState(null);
    const [previewPhoto, setPreviewPhoto] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedCountryId, setSelectedCountryId] = useState(null);

    // Update profile mutation
    const updateProfile = usePostDataWithToken('profile');
    
    // Fetch countries data
    const { data: countriesData, isLoading: isCountriesLoading } = useGetDataWithToken('countries', token);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        gender: "",
        dateOfBirth: "",
        country: ""
    });

    // Handle form errors
    const [errors, setErrors] = useState({});

    // Helper function to get country name by ID
    const getCountryNameById = (countryId) => {
        if (!countriesData?.data || !countryId) return '';
        const country = countriesData.data.find(c => c.id.toString() === countryId.toString());
        return country?.country_name || '';
    };

    // Initialize form data when profile loads
    useEffect(() => {
        if (profile) {
            // Extract country ID from nested country object
            const countryId = profile.country?.id ? Number(profile.country.id) : null;
            setSelectedCountryId(countryId);

            setFormData({
                name: profile.name || "",
                email: profile.email || "",
                phone: profile.phone || "",
                gender: profile.gender || "",
                dateOfBirth: profile.date_of_birth || "",
                country: profile.country?.country_name || ""
            });
            setPreviewPhoto(profile.photo);
        }
    }, [profile]);

    // Update country name when countries data loads or country selection changes
    useEffect(() => {
        if (selectedCountryId && countriesData?.data) {
            const countryName = getCountryNameById(selectedCountryId);
            setFormData(prev => ({ ...prev, country: countryName }));
        }
    }, [selectedCountryId, countriesData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: "" }));
    };

    // Handle country change
    const handleCountryChange = (e) => {
        const countryId = e.target.value;
        const selectedCountry = countriesData?.data?.find(c => c.id.toString() === countryId);

        setSelectedCountryId(countryId ? Number(countryId) : null);
        setFormData(prev => ({
            ...prev,
            country: selectedCountry?.country_name || ""
        }));
        setErrors(prev => ({ ...prev, country: "" }));
    };

    const handleEditToggle = () => {
        if (isEditing) {
            // Cancel editing - reset form data
            if (profile) {
                const countryId = profile.country?.id ? Number(profile.country.id) : null;
                setSelectedCountryId(countryId);
                
                setFormData({
                    name: profile.name || "",
                    email: profile.email || "",
                    phone: profile.phone || "",
                    gender: profile.gender || "",
                    dateOfBirth: profile.date_of_birth || "",
                    country: profile.country?.country_name || ""
                });
                setPreviewPhoto(profile.photo);
                setUserPhoto(null);
                setErrors({});
            }
        }
        setIsEditing(!isEditing);
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        if (!formData.phone.trim()) newErrors.phone = "Phone number is required";

        // Email validation
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            toast.error("Please fill all required fields correctly");
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
            updateData.append('name', formData.name.trim());
            updateData.append('email', formData.email.trim());
            updateData.append('phone', formData.phone.trim());
            updateData.append('gender', formData.gender.trim() || '');
            updateData.append('date_of_birth', formData.dateOfBirth.trim() || '');
            updateData.append('country_id', selectedCountryId ? selectedCountryId.toString() : '');

            // Handle photo upload
            if (userPhoto && userPhoto instanceof File) {
                updateData.append('photo', userPhoto);
            }

            await toast.promise(
                updateProfile.mutateAsync({
                    endpoint: 'profile',
                    token,
                    formData: updateData,
                }),
                {
                    loading: 'Updating profile...',
                    success: 'Profile updated successfully!',
                    error: (err) => err.message || 'Failed to update profile',
                }
            );

            // Invalidate queries to refresh data
            queryClient.invalidateQueries({ queryKey: ['profile'] });
            setIsEditing(false);

        } catch (err) {
            console.error("Update error:", err);
        } finally {
            setLoading(false);
        }
    };

    if (!profile) {
        return (
            <div className="bg-white rounded-lg p-[10px] lg:p-[40px] flex justify-center items-center h-64">
                <p className="text-gray-500">Loading profile...</p>
            </div>
        );
    }

    const DisplayField = ({ label, value, required = false }) => (
        <div className="py-[15px] border-b border-gray-100">
            <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700 text-[14px] lg:text-[16px]">
                    {label} {required && <span className="text-red-500">*</span>}
                </span>
                <span className="text-primaryblack text-[14px] lg:text-[16px]">
                    {value || <span className="text-gray-400">Not set</span>}
                </span>
            </div>
        </div>
    );

    const EditField = ({ label, name, type = "text", required = false, options = null, isCountry = false }) => (
        <div>
            <label className="flex justify-between font-medium text-gray-700">
                <p className="text-[14px] lg:text-[16px]">
                    {label} {required && <span className="text-red-500">*</span>}
                </p>
                {errors[name] && (
                    <span className="text-red-500 text-sm">{errors[name]}</span>
                )}
            </label>
            {isCountry ? (
                <div className="relative">
                    <select
                        value={selectedCountryId || ""}
                        onChange={handleCountryChange}
                        disabled={isCountriesLoading}
                        className={`cursor-pointer appearance-none w-full px-[10px] sm:px-[20px] py-[12px] sm:py-[16px] border ${
                            errors[name] ? "border-red-500" : "border-gray-300"
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 mt-[8px] text-[14px] lg:text-[16px] text-primaryblack bg-white`}
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
                    <BiChevronDown className="absolute top-1/2 right-3 text-xl text-gray-300 pointer-events-none" />
                </div>
            ) : options ? (
                <select
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className={`w-full px-[10px] sm:px-[20px] py-[12px] sm:py-[16px] border ${
                        errors[name] ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 mt-[8px] text-[14px] lg:text-[16px] text-primaryblack bg-white`}
                >
                    <option value="">{`Select ${label}`}</option>
                    {options.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className={`w-full px-[10px] sm:px-[20px] py-[12px] sm:py-[16px] border ${
                        errors[name] ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 mt-[8px] text-[14px] lg:text-[16px] text-primaryblack`}
                    placeholder={`Enter your ${label.toLowerCase()}`}
                />
            )}
        </div>
    );

    return (
        <div className="bg-white rounded-lg p-[10px] lg:p-[40px]">
            {/* Header with Edit Button */}
            <div className="flex justify-between items-center mb-[30px]">
                <h2 className="text-[20px] lg:text-[24px] font-bold text-primaryblack">
                    Profile Information
                </h2>
                {!isEditing ? (
                    <button
                        onClick={handleEditToggle}
                        className="flex items-center gap-2 px-[16px] py-[8px] bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                    >
                        <BiEdit className="text-[18px]" />
                        <span className="text-[14px] lg:text-[16px]">Edit Profile</span>
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <button
                            onClick={handleEditToggle}
                            className="flex items-center gap-2 px-[16px] py-[8px] bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                        >
                            <BiX className="text-[18px]" />
                            <span className="text-[14px] lg:text-[16px]">Cancel</span>
                        </button>
                    </div>
                )}
            </div>

            {!isEditing ? (
                /* VIEW MODE */
                <div>
                    {/* Profile Photo Display */}
                    <div className="flex justify-center mb-[30px]">
                        <div className="relative">
                            <div className="w-[80px] h-[80px] lg:w-[120px] lg:h-[120px] rounded-full overflow-hidden border-4 border-gray-200">
                                {profile.photo ? (
                                    <img
                                        src={profile.photo}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                        <span className="text-gray-500 text-[24px] lg:text-[36px] font-bold">
                                            {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Profile Information Display */}
                    <div className="space-y-2">
                        <DisplayField label="Full Name" value={profile.name} required />
                        <DisplayField label="Email Address" value={profile.email} required />
                        <DisplayField label="Phone Number" value={profile.phone} required />
                        <DisplayField label="Gender" value={profile.gender} />
                        <DisplayField label="Date of Birth" value={profile.date_of_birth} />
                        <DisplayField label="Country" value={profile.country?.country_name} />
                        <DisplayField label="Profile ID" value={profile.id} />
                    </div>
                </div>
            ) : (
                /* EDIT MODE */
                <form onSubmit={handleSubmit}>
                    {/* Profile Photo Edit */}
                    <UserProfilePhoto
                        userPhoto={userPhoto}
                        setUserPhoto={setUserPhoto}
                        previewPhoto={previewPhoto}
                        setPreviewPhoto={setPreviewPhoto}
                    />

                    {/* Edit Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-[15px] lg:gap-[20px] mt-[30px]">
                        <EditField
                            label="Full Name"
                            name="name"
                            required
                        />
                        <EditField
                            label="Email Address"
                            name="email"
                            type="email"
                            required
                        />
                        <EditField
                            label="Phone Number"
                            name="phone"
                            type="tel"
                            required
                        />
                        <EditField
                            label="Gender"
                            name="gender"
                            options={[
                                { value: "male", label: "Male" },
                                { value: "female", label: "Female" },
                                { value: "other", label: "Other" }
                            ]}
                        />
                        <EditField
                            label="Date of Birth"
                            name="dateOfBirth"
                            type="date"
                        />
                        <EditField
                            label="Country"
                            name="country"
                            isCountry={true}
                        />
                    </div>

                    {/* Save Button */}
                    <div className="mt-[30px] lg:mt-[40px]">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex items-center justify-center gap-2 py-[12px] md:py-[18px] text-[16px] lg:text-[18px] ease-linear duration-300 w-full font-medium rounded-md ${
                                loading 
                                    ? 'bg-creamline cursor-not-allowed text-gray-400' 
                                    : 'bg-customgreen hover:bg-customgreen/90 text-white cursor-pointer'
                            }`}
                        >
                            {loading ? (
                                <LoadingSvg label="Updating profile" color='text-primaryblack' />
                            ) : (
                                <>
                                    <BiCheck className="text-[20px]" />
                                    <span>Save Changes</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default Profile;