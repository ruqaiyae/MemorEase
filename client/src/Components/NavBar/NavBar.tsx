import { NavBtn } from './NavBtn';
import { ProfileMenu } from './ProfileMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const iconRef = useRef<SVGSVGElement>(null);
  const navigate = useNavigate();
  return (
    <>
      <div className="flex md:items-center w-[90%] md:w-[95%] mx-auto">
        <div className="w-[65%] md:w-[70%] my-2">
          <img
            src="/logo.png"
            onClick={() => {
              navigate('/');
            }}
            className="w-8 md:w-15 cursor-pointer"
          />
        </div>
        <div className="w-[50%] md:w-[30%] my-2 md:my-3">
          <div className="flex items-center justify-around">
            <NavBtn btnName="Home" path="/" />
            <NavBtn btnName="About" path="about-us" />
            <NavBtn btnName="Vault" path="family/dashboard" />
            <FontAwesomeIcon
              icon={faUser}
              onClick={() => {
                setIsOpen(!isOpen);
              }}
              ref={iconRef}
              className="text-[#654a2f] md:text-3xl mt-1 md:mt cursor-pointer"
            />
          </div>
        </div>
      </div>
      <ProfileMenu
        isOpen={isOpen}
        positionTo={iconRef.current}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
