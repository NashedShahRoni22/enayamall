import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube, FaTiktok } from "react-icons/fa";
import PageHeader from '../components/shared/PageHeader';
import Container from '../components/shared/Container';
import ContactForm from "../components/forms/ContactForm";
import Link from "next/link";

export default function Page() {
  const socialLinks = [
    { name: "Facebook", icon: <FaFacebookF />, link: "https://www.facebook.com/LaminaxOfficial1" },
    { name: "Tiktok ", icon: <FaTiktok />, link: "https://www.tiktok.com/@laminaxofficial" },
    { name: "Instagram", icon: <FaInstagram />, link: "https://www.instagram.com/laminaxofficial" },
    { name: "LinkedIn", icon: <FaLinkedinIn />, link: "https://www.linkedin.com/company/laminaxlimited" },
    { name: "YouTube", icon: <FaYoutube />, link: "https://www.youtube.com/@laminaxofficial" }
  ];

  return (
    <section>
      {/* <PageHeader title={"Contact us"} from={"Home"} to={"contact"} /> */}
      <Container>
        <div className='py-[50px] lg:pt-[60px] lg:pb-[120px] flex flex-col gap-[50px] lg:flex-row lg:gap-[44px]'>
          {/* Left form */}
          <ContactForm/>

          {/* Right side info */}
          <div className='lg:w-1/2'>
            <div>
              <h5 className='text-[26px] text-primarymagenta'>Address</h5>
              <p className='mt-[15px] sm:mt-[30px] text-ash text-[14px] lg:text-[18px] sm:w-2/3'>
                Kazi Morning Glory, Level 8, House 15, Road 3, Block A, Mirpur 11, Dhaka 1216
              </p>
            </div>

            <div className='mt-[20px] sm:mt-[40px]'>
              <h5 className='text-[20px] lg:text-[26px] text-primarymagenta'>Email</h5>
              <p className='mt-[8px] sm:mt-[16px] text-ash text-[14px] lg:text-[18px]'>
                <span className='text-primarymagenta'>Customer care:</span> <Link className="hover:text-primary" href="mailto:care@laminax.com.bd">care@laminax.com.bd</Link>
              </p>
              <p className='mt-[8px] sm:mt-[16px] text-ash text-[14px] lg:text-[18px]'>
                <span className='text-primarymagenta'>Office:</span> <Link className="hover:text-primary" href="mailto:hello@laminax.com.bd">hello@laminax.com.bd</Link>
              </p>
            </div>

            <div className='mt-[20px] sm:mt-[40px]'>
              <h5 className='text-[20px] lg:text-[26px] text-primarymagenta'>Call us</h5>
              <p className='mt-[8px] sm:mt-[16px] text-ash text-[14px] lg:text-[18px]'>
                <span className='text-primarymagenta'>Customer care:</span> <Link href="callto:+880 17 1199 6465" className="hover:text-primary">+880 17 1199 6465</Link>
              </p>
              <p className='mt-[8px] sm:mt-[16px] text-ash text-[14px] lg:text-[18px]'>
                <span className='text-primarymagenta'>Office:</span> <Link href="callto:+880 17 1199 6466" className="hover:text-primary">+880 17 1199 6466</Link>
              </p>
            </div>

            <div className='mt-[20px] sm:mt-[40px]'>
              <h5 className='text-[20px] lg:text-[26px] text-primarymagenta'>Social media and more</h5>
              <div className='flex gap-5 mt-[8px] sm:mt-[16px]'>
                {socialLinks.map((item, index) => (
                  <a
                    key={index}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className='text-primarymagenta text-[24px] hover:text-primary transition duration-300 p-2.5 rounded-[5px] bg-[#F5F5F5]'
                    aria-label={item.name}
                  >
                    {item.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
