import { Container } from '../Layout/Container';
import {
  type Image,
  type Recipe,
  type Story,
  type Video,
} from '../../Lib/data';
import { useNavigate, useParams } from 'react-router-dom';
import { ReactNode } from 'react';
import { useFamily } from '../FamilyManagement/useFamily';

type Props = {
  header1: string;
  header2: string;
  loading: boolean;
  content: Image[] | Recipe[] | Story[] | Video[] | undefined;
  memoryType: string;
  path: string;
  children: ReactNode;
};

export function MemoriesContainer({
  header1,
  header2,
  loading,
  content,
  memoryType,
  path,
  children,
}: Props) {
  const { currentFamily } = useFamily();
  const { familyId } = useParams();
  const navigate = useNavigate();

  return (
    <>
      <h1 className="font-[fondamento] text-[#654A2F] text-center text-[16px] md:text-[40px] my-4 md:my-15 mx-7 md:mx-30 whitespace-pre-line">
        {header1} {currentFamily?.familyName} {header2}
      </h1>
      <Container mobileWidth="80%" width="85%">
        {loading ? (
          <p className="font-[artifika] text-[#654A2F] text-center text-[10px] md:text-[25px] mx-5 my-10 md:mt-20">
            Loading...
          </p>
        ) : !content?.length ? (
          <>
            <p className="font-[artifika] text-[#654A2F] text-center text-[10px] md:text-[25px] mx-5 mt-10 md:mt-20">
              No memories here yet... but every legacy starts with a first{' '}
              {memoryType}!
            </p>
            <div className="text-center">
              <button
                onClick={() => {
                  navigate(`/family/${familyId}/dashboard/${path}`);
                  window.scrollTo(0, 0);
                }}
                className="btn bg-[#654A2F] px-2 md:px-7 py-[3px] md:py-3 mt-5 mb-10 md:my-16 rounded-lg md:rounded-full font-[Lato] text-[#EBD199] text-[8px] md:text-[18px] cursor-pointer">
                Upload Now
              </button>
            </div>
          </>
        ) : (
          <div className="flex justify-end mr-5">
            <button
              onClick={() => {
                navigate(`/family/${familyId}/dashboard/${path}`);
                window.scrollTo(0, 0);
              }}
              className="btn bg-[#654A2F] px-2 md:px-7 py-[3px] md:py-3 my-3 md:mt-6 rounded-lg md:rounded-full font-[Lato] text-[#EBD199] text-[8px] md:text-[18px] cursor-pointer">
              Add a New Memory
            </button>
          </div>
        )}
        {children}
      </Container>
    </>
  );
}
