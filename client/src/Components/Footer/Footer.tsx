import { Link, useNavigate } from 'react-router-dom';
import { FooterLinks } from './NavLinks';

export function Footer() {
  const navigate = useNavigate();

  return (
    <>
      <div className="bg-[#654A2F] mt-5">
        <div className="flex w-[85%] md:w-[90%] mx-auto">
          <div className="w-[80%] content-center my-5 md:my-12">
            <h1
              onClick={() => {
                navigate('/');
              }}
              className="font-fondamento text-[#EBD199] md:text-5xl cursor-pointer w-[20%]">
              MemorEase
            </h1>
            <p className="font-lato text-[#EBD199] text-[9px] md:text-xl md:pt-3">
              A Digital Memory &amp; Legacy Vault for Families
            </p>
          </div>
          <div className="content-center text-center my-5 md:my-12">
            <FooterLinks link="/" name="Home" />
            <FooterLinks link="about-us" name="About Us" />
            <FooterLinks link="*" name="Contact Us" />
            <FooterLinks link="*" name="FAQ" />
          </div>
        </div>
      </div>
      <div className="w-[85%] md:w-[90%] mx-auto my-2 font-lato text-[#654A2F] text-[6px] md:text-sm">
        <Link to="*">Privacy Policy</Link>
        <Link to="*" className="pl-3 md:pl-15">
          Terms &amp; Conditions
        </Link>
      </div>
    </>
  );
}
