import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube, FaTiktok, FaTwitter } from "react-icons/fa";
import PageHeader from '../components/shared/PageHeader';
import Container from '../components/shared/Container';
import ContactForm from "../components/forms/ContactForm";
import Link from "next/link";

export default function Page() {
  const socialLinks = [
    { name: "Facebook", icon: <FaFacebookF />, link: "https://www.facebook.com/enayamall" },
    // { name: "Tiktok ", icon: <FaTiktok />, link: "https://www.tiktok.com/@laminaxofficial" },
    { name: "Instagram", icon: <FaInstagram />, link: "https://www.instagram.com/enayamall" },
    // { name: "LinkedIn", icon: <FaLinkedinIn />, link: "https://www.linkedin.com/company/laminaxlimited" },
    // { name: "YouTube", icon: <FaYoutube />, link: "https://www.youtube.com/@laminaxofficial" },
    { name: "Twitter", icon: <FaTwitter />, link: "https://twitter.com/enayamall" },
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
              <h5 className='text-[26px] text-primaryblack'>Address</h5>
              <p className='mt-[15px] sm:mt-[30px] text-ash text-[14px] lg:text-[18px] sm:w-2/3'>
                P.O.Box 27042, Dubai, United Arab Emirates
              </p>
            </div>

            <div className='mt-[20px] sm:mt-[40px]'>
              <h5 className='text-[20px] lg:text-[26px] text-primaryblack'>Email</h5>
              <p className='mt-[8px] sm:mt-[16px] text-ash text-[14px] lg:text-[18px]'>
                <Link className="hover:text-primary" href="mailto:info@enayamall.com">info@enayamall.com</Link>
              </p>
              {/* <p className='mt-[8px] sm:mt-[16px] text-ash text-[14px] lg:text-[18px]'>
                <span className='text-primaryblack'>Office:</span> <Link className="hover:text-primary" href="mailto:hello@laminax.com.bd">hello@laminax.com.bd</Link>
              </p> */}
            </div>

            <div className='mt-[20px] sm:mt-[40px]'>
              <h5 className='text-[20px] lg:text-[26px] text-primaryblack'>Call us</h5>
              <p className='mt-[8px] sm:mt-[16px] text-ash text-[14px] lg:text-[18px]'>
                <span className='text-primaryblack'>Phone:</span> <Link href="callto:+971506065857" className="hover:text-primary">+97150 6065857</Link>
              </p>
              <p className='mt-[8px] sm:mt-[16px] text-ash text-[14px] lg:text-[18px]'>
                <span className='text-primaryblack'>Mobile:</span> <Link href="callto:+971507750309" className="hover:text-primary">+971 50 775 0309</Link>
              </p>
            </div>

            <div className='mt-[20px] sm:mt-[40px]'>
              <h5 className='text-[20px] lg:text-[26px] text-primaryblack'>Social media and more</h5>
              <div className='flex gap-5 mt-[8px] sm:mt-[16px]'>
                {socialLinks.map((item, index) => (
                  <a
                    key={index}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className='text-primaryblack text-[24px] hover:text-primary transition duration-300 p-2.5 rounded-[5px] bg-[#F5F5F5]'
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
