import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../UserManagement/useUser';
import { FamilyMenu } from '../FamilyManagement/FamilyMenu';
import { useFamily } from '../FamilyManagement/useFamily';

type Props = {
  isOpen: boolean;
  positionTo: SVGSVGElement | null;
  onClose: () => void;
};
export function ProfileMenu({ isOpen, positionTo, onClose }: Props) {
  const { user, handleSignOut } = useUser();
  const { currentFamily, isLoading, error } = useFamily();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const r = positionTo?.getBoundingClientRect();
  const top = r ? `${r.bottom + 4}px` : '8%';
  const left = r ? `${r.left - 50}px` : '95%';

  if (isLoading) return;

  return createPortal(
    <>
      <div
        onClick={onClose}
        className="fixed top-0 w-screen h-screen bg-white pointer-events-auto opacity-[0.2]"
      />
      <div
        className="bg-[#654A2F] border-2 border-[#654A2F] rounded-lg px-[10px] md:px-[30px] py-[5px]"
        style={{
          position: 'absolute',
          top,
          left,
        }}>
        <ul className="list-none m-0 py-[3px] font-[Lato] text-[#EBD199] text-right text-[9px] md:text-[15px]">
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
              <FamilyMenu onClose={() => onClose()} />
              {isLoading && (
                <>
                  <li>Loading...</li>
                  <hr className="my-1"></hr>
                </>
              )}
              {error && (
                <>
                  <li
                    onClick={() => {
                      navigate('family-form'), onClose();
                    }}
                    className="cursor-pointer">
                    Family Portal
                  </li>
                  <hr className="my-1"></hr>
                </>
              )}
              {currentFamily.familyName && (
                <>
                  {' '}
                  <li
                    onClick={() => {
                      navigate('family-form'), onClose();
                    }}
                    className="cursor-pointer">
                    {' '}
                    Family Portal{' '}
                  </li>
                  <hr className="my-1"></hr>
                </>
              )}

              <li
                onClick={() => {
                  handleSignOut();
                  onClose();
                }}
                className="py-[3px] md:pb-[10px]">
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
