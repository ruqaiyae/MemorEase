import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { useUser } from '../UserManagement/useUser';

type Props = {
  isOpen: boolean;
  positionTo: SVGSVGElement | null;
  onClose: () => void;
};
export function ProfileMenu({ isOpen, positionTo, onClose }: Props) {
  const { user, handleSignOut } = useUser();
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
          {!user && (
            <>
              <li onClick={onClose} className="pb-[5px] md:pb-[10px]">
                <Link to={'sign-in'}>Sign In</Link>
              </li>

              <li onClick={onClose}>
                <Link to={'sign-up'}>Sign Up</Link>
              </li>
            </>
          )}
          {user && (
            <>
              <li
                onClick={() => {
                  handleSignOut();
                  onClose();
                }}
                className="pb-[5px] md:pb-[10px]">
                <Link to={'/'}>Sign Out</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </>,
    document.body
  );
}
