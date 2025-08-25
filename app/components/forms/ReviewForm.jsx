'use client'

import { useState, useRef } from 'react'
import { MdOutlineCheckBoxOutlineBlank } from 'react-icons/md'
import { TiStarFullOutline, TiStarOutline } from 'react-icons/ti'
import { IoClose } from 'react-icons/io5'
import { usePostDataWithToken } from '../helpers/usePostDataWithToken'
import toast from 'react-hot-toast'
import LoadingSvg from '../shared/LoadingSvg'
import { useGetData } from '../helpers/useGetData'
import { useGetDataWithToken } from '../helpers/useGetDataWithToken'

export default function ReviewForm({ variantId, token, productType }) {
    const [loading, setLoading] = useState(false);
    const [rating, setRating] = useState(0)
    const [reviewText, setReviewText] = useState('');
    const [reviewTitleId, setReviewTitleId] = useState('');
    const [hoverRating, setHoverRating] = useState(0)
    const [images, setImages] = useState([])
    const inputRef = useRef(null)

    const { data } = useGetDataWithToken("get-review-title", token);
    const reviewTitles = data?.data;


    const handleRating = (value) => setRating(value)
    const handleMouseEnter = (value) => setHoverRating(value)
    const handleMouseLeave = () => setHoverRating(0)

    const handleDrop = (e) => {
        e.preventDefault()
        const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'))
        setImages(prev => [...prev, ...files])
        // Clear the file input after drop
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    }

    const handleImageRemove = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index))
    }

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files).filter(file => file.type.startsWith('image/'))
        setImages(prev => [...prev, ...files])
        // Clear the file input after selection
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    }

    const triggerFileInput = () => {
        inputRef.current?.click()
    }

    // Function to reset form
    const resetForm = () => {
        setRating(0);
        setReviewText('');
        setReviewTitleId('');
        setImages([]);
        setHoverRating(0);
        // Clear file input
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    }

    //place review
    const postReview = usePostDataWithToken("review");

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(productType);

        if (!rating || !reviewText.trim() || !reviewTitleId.trim()) {
            toast.error("Please provide a rating, title and review.");
            return;
        }

        const form = new FormData();
        if (productType === "combo") {
            form.append('combo_id', variantId);
        }
        else {
            form.append('product_variant_id', variantId);
        }
        form.append('rating', rating);
        form.append('review', reviewText);
        form.append('rating_title_id', reviewTitleId);

        images.forEach((image, index) => {
            form.append(`images[${index}]`, image);
        });

        try {
            setLoading(true);
            await toast.promise(
                postReview.mutateAsync({ formData: form, token }),
                {
                    loading: 'Placing review...',
                    success: 'Review placed successfully!',
                    error: (err) => err.message || 'Failed to submit review',
                }
            );
            // Reset form after successful submission
            resetForm();
        } catch (err) {
            console.error("Submission error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className='border-t border-[#D0D0D0] pt-[50px] flex flex-col gap-[30px] lg:gap-[40px]'>
            <p className='text-primarymagenta text-[18px] lg:text-[20px] font-[650]'>Share the Vibe!</p>
            <p className='text-natural text-[20px] lg:text-[26px] font-[650]'>Loved your experience? Tell us how it made you feel!</p>
            <p className='text-ash text-[14px]'>
                Your email address will not be published. Required fields are marked <span className='text-button'>*</span>
            </p>

            <form className='flex flex-col gap-[20px] lg:gap-[40px] xl:w-1/2' onSubmit={handleSubmit}>
                {/* Rating */}
                <div className='flex flex-col gap-[20px]'>
                    <p className='text-primarymagenta text-[18px] font-[650]'>Your rating<span className='text-button'>*</span></p>
                    <div className='flex gap-[4px]'>
                        {[1, 2, 3, 4, 5].map((value) => (
                            <button
                                key={value}
                                type='button'
                                onClick={() => handleRating(value)}
                                onMouseEnter={() => handleMouseEnter(value)}
                                onMouseLeave={handleMouseLeave}
                                className='focus:outline-none cursor-pointer'
                            >
                                {(hoverRating || rating) >= value ? (
                                    <TiStarFullOutline className='text-orange text-[24px]' />
                                ) : (
                                    <TiStarOutline className='text-orange text-[24px]' />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Review Title */}
                <div className='flex flex-col gap-[10px] md:gap-[20px]'>
                    <p className='text-primarymagenta text-[18px] lg:text-[20px] font-[650]'>Your title<span className='text-button'>*</span></p>

                    <select onChange={e => setReviewTitleId(e.target.value)} className='p-2.5 sm:p-5 focus:outline-none border border-creamline rounded-[5px] cursor-pointer' >
                        <option value={""}> Choose a title </option>
                        {
                            reviewTitles?.map((rt) => <option value={rt?.id} key={rt?.id}>{rt?.title}</option>)
                        }
                    </select>
                </div>

                {/* Review Text */}
                <div className='flex flex-col gap-[10px] md:gap-[20px]'>
                    <p className='text-primarymagenta text-[18px] lg:text-[20px] font-[650]'>Your review<span className='text-button'>*</span></p>
                    <input
                        value={reviewText}
                        onChange={e => setReviewText(e.target.value)}
                        className='p-2.5 sm:p-5 focus:outline-none border border-creamline rounded-[5px]'
                        placeholder="Write your review here..."
                    />
                </div>

                {/* Image Dropzone */}
                <div className='flex flex-col gap-[10px]'>
                    <p className='text-primarymagenta text-[18px] lg:text-[20px] font-[650]'>Upload images (optional)</p>

                    <div
                        onDrop={handleDrop}
                        onDragOver={(e) => e.preventDefault()}
                        onClick={triggerFileInput}
                        className='border-2 border-dashed border-creamline rounded-[8px] p-6 text-center cursor-pointer bg-[#fafafa] hover:bg-[#f0f0f0] transition-colors'
                    >
                        <p className='text-ash text-[14px]'>Drag & drop or <span className='text-primarymagenta underline'>click to upload</span></p>
                        <input
                            type='file'
                            multiple
                            accept='image/*'
                            ref={inputRef}
                            onChange={handleFileSelect}
                            className='hidden'
                        />
                    </div>

                    {/* Preview Thumbnails */}
                    {images.length > 0 && (
                        <div className='flex flex-wrap gap-4 mt-2'>
                            {images.map((img, idx) => (
                                <div key={idx} className='relative w-[80px] h-[80px] rounded overflow-hidden border border-creamline'>
                                    <img
                                        src={URL.createObjectURL(img)}
                                        alt={`preview-${idx}`}
                                        className='w-full h-full object-cover rounded'
                                    />
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent triggering file input
                                            handleImageRemove(idx);
                                        }}
                                        type='button'
                                        className='absolute top-1 right-1 bg-white bg-opacity-75 p-1 rounded-full shadow-sm hover:bg-opacity-100 transition'
                                    >
                                        <IoClose className='text-primarymagenta text-[16px]' />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className={`px-[24px] sm:px-[48px] py-[8px] sm:py-[16px] rounded-[5px] mt-[30px] text-[16px] sm:text-[18px] transition ease-linear duration-300
                        ${loading
                            ? 'bg-creamline text-primarymagenta cursor-not-allowed'
                            : 'bg-natural text-white hover:bg-creamline hover:text-natural cursor-pointer'
                        }`}
                >
                    {loading ? (
                        <LoadingSvg label="Submitting" />
                    ) : (
                        "Submit"
                    )}
                </button>
            </form>
        </section>
    )
}