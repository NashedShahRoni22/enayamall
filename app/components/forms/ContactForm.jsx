"use client"
import toast from 'react-hot-toast';
import { usePostData } from '../helpers/usePostData';
import { useState } from 'react';

export default function ContactForm() {
    const postContact = usePostData('contact-us');
    const [form, setForm] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const [errors, setErrors] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (value.trim()) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = { ...errors };

        if (!form.name.trim()) {
            newErrors.name = 'Name is required';
            isValid = false;
        }
        if (!form.email.trim()) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            newErrors.email = 'Please enter a valid email';
            isValid = false;
        }
        if (!form.subject.trim()) {
            newErrors.subject = 'Subject is required';
            isValid = false;
        }
        if (!form.message.trim()) {
            newErrors.message = 'Message is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };
    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            const formData = new FormData();
            formData.append('name', form.name);
            formData.append('email', form.email);
            formData.append('subject', form.subject);
            formData.append('message', form.message);

            toast.promise(
                postContact.mutateAsync(formData)
                    .then((data) => {
                        setForm({ name: '', email: '', subject: '', message: '' });
                    }),
                {
                    loading: 'Sending your message...',
                    success: 'Message sent successfully!',
                    error: (err) => err.message || 'Failed to send message',
                }
            );
        }
    };
    return (
        <form onSubmit={handleSubmit} className='lg:w-1/2'>
            <h5 className='text-[20px] lg:text-[26px] text-primarymagenta'>Get in touch</h5>
            <p className='text-[14px] lg:text-[18px] text-ash mt-[30px] sm:w-2/3'>
                Please enter the details of your request. A member of our support staff will respond as soon as possible.
            </p>

            <div className='mt-[40px] grid lg:grid-cols-2 gap-[15px] sm:gap-[30px]'>
                <div>
                    <div className='flex justify-between items-center'>
                        <p className='text-[14px] lg:text-[18px] text-primarymagenta'>Your Name <span className='text-danger'>*</span></p>
                        {errors.name && <span className='text-[12px] lg:text-[14px] text-button'>{errors.name}</span>}
                    </div>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className='mt-[20px] text-ash rounded-[5px] w-full px-[10px] sm:px-[20px] py-[10px] sm:py-[20px] border border-creamline focus:outline-none'
                    />
                </div>

                <div>
                    <div className='flex justify-between items-center'>
                        <p className='text-[14px] lg:text-[18px] text-primarymagenta'>Email address <span className='text-danger'>*</span></p>
                        {errors.email && <span className='text-[12px] lg:text-[14px] text-button'>{errors.email}</span>}
                    </div>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className='mt-[20px] text-ash rounded-[5px] w-full px-[10px] sm:px-[20px] py-[10px] sm:py-[20px] border border-creamline focus:outline-none'
                    />
                </div>
            </div>

            <div className='mt-[15px] sm:mt-[30px]'>
                <div className='flex justify-between items-center'>
                    <p className='text-[14px] lg:text-[18px] text-primarymagenta'>Subject <span className='text-danger'>*</span></p>
                    {errors.subject && <span className='text-[12px] lg:text-[14px] text-button'>{errors.subject}</span>}
                </div>
                <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    className='mt-[20px] text-ash rounded-[5px] w-full px-[10px] sm:px-[20px] py-[10px] sm:py-[20px] border border-creamline focus:outline-none'
                />
            </div>

            <div className='mt-[15px] sm:mt-[30px]'>
                <div className='flex justify-between items-center'>
                    <p className='text-[14px] lg:text-[18px] text-primarymagenta'>Message <span className='text-danger'>*</span></p>
                    {errors.message && <span className='text-[12px] lg:text-[14px] text-button'>{errors.message}</span>}
                </div>
                <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    className='mt-[20px] text-ash rounded-[5px] w-full px-[10px] sm:px-[20px] py-[10px] sm:py-[20px] border border-creamline focus:outline-none'
                />
            </div>

            <button
                type="submit"
                className="mt-[15px] sm:mt-[30px] transition-all ease-linear duration-300 text-[18px] w-full rounded-[5px] flex justify-center items-center bg-natural text-white py-[10px] sm:py-[20px] cursor-pointer"
            >
                Send
            </button>
        </form>
    )
}
