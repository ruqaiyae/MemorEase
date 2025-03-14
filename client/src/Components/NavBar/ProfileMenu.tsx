import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';

type Props = {
  isOpen: boolean;
  positionTo: SVGSVGElement | null;
  onClose: () => void;
};
export function ProfileMenu({ isOpen, positionTo, onClose }: Props) {
  if (!isOpen) return null;

  const r = positionTo?.getBoundingClientRect();
  const top = r ? `${r.bottom + 4}px` : '8%';
  const left = r ? `${r.left + r.width / 2}px` : '95%';

  return createPortal(
    <>
      <div
        onClick={onClose}
        className="fixed top-0 w-screen h-screen bg-white pointer-events-auto opacity-[0.2]"
      />
      <div
        className="bg-[#654A2F] border-2 border-[#654A2F] rounded-lg px-[10px] md:px-[30px] py-[5px] min-w-max"
        style={{
          position: 'absolute',
          top,
          left,
          transform: 'translateX(-50%)',
        }}>
        <ul className="list-none m-0 py-[3px] text-center font-[Lato] text-[#EBD199] text-[9px] md:text-[15px]">
          <Link to={'sign-in'}>
            <li onClick={onClose} className="pb-[5px] md:pb-[10px]">
              Sign In
            </li>
          </Link>
          <Link to={'sign-up'}>
            <li onClick={onClose}>Sign Up</li>
          </Link>
        </ul>
      </div>
    </>,
    document.body
  );
}
