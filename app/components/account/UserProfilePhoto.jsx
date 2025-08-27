import { useRef } from "react";
import Image from "next/image";
import defaultUserIcon from "../../resources/user profile photo.png";
import imgUploadIcon from "../../resources/icons/icon img upload.svg";
import { BiUser } from "react-icons/bi";

const UserProfilePhoto = ({ userPhoto, setUserPhoto, previewPhoto, setPreviewPhoto }) => {
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }

      // Validate file size (e.g., max 5MB)
      const maxSize = 2 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        alert('Image size should be less than 2MB');
        return;
      }

      // Set the actual file (used for uploading)
      setUserPhoto(file);

      // Also create and set preview for displaying
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewPhoto(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Determine what image to show
  const getImageSource = () => {
    if (previewPhoto) {
      // If it's a data URL (new upload) or existing URL
      return previewPhoto;
    }
    return defaultUserIcon;
  };

  const isDataURL = previewPhoto && previewPhoto.startsWith('data:');

  return (
    <div className="flex justify-center mb-[60px]">
      <div className="relative">
        {
          previewPhoto ?
            <Image
              src={getImageSource()}
              className="size-[200px] rounded-full object-cover border-2 border-gray-200"
              alt="user profile image"
              width={200}
              height={200}
              unoptimized={isDataURL}
            />
            :
            <div className='size-[200px] flex justify-center items-center bg-creamline rounded-full'>
              <BiUser className='text-[100px] text-primarymagenta' />
            </div>

        }

        <div
          className="size-[50px] bg-creamline shadow ease-linear duration-300 rounded-full flex justify-center items-center absolute right-0 bottom-0 cursor-pointer hover:bg-opacity-80 transition-opacity"
          onClick={triggerFileInput}
          title="Upload new profile photo"
        >
          <Image
            src={imgUploadIcon}
            className="size-[24px]"
            alt="upload icon"
            width={24}
            height={24}
          />
        </div>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleImageChange}
        />
      </div>
    </div>
  );
};

export default UserProfilePhoto;