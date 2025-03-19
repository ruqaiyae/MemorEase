import { useEffect, useState } from 'react';
import { useFamily } from '../../Components/FamilyManagement/useFamily';
import { Container } from '../../Components/Layout/Container';
import { type Image, readImages } from '../../Lib/data';
import { useNavigate } from 'react-router-dom';

export function ImageMemories() {
  const { currentFamily } = useFamily();
  const [images, setImages] = useState<Image[]>();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const res = await readImages(currentFamily?.familyId);
        setImages(res);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  });

  return (
    <>
      <h1 className="font-[fondamento] text-[#654A2F] text-center text-[16px] md:text-[50px] my-4 md:my-8 mx-7 md:mx-70">
        Explore the Eternal Snapshots of the {currentFamily?.familyName} family{' '}
      </h1>
      {isLoading && <p>Loading...</p>}
      <Container mobileWidth="80%" width="85%">
        {!images?.length && (
          <>
            <p className="font-[artifika] text-[#654A2F] text-center text-[10px] md:text-[25px] mx-5 mt-10 md:mt-20">
              No memories here yet... but every legacy starts with a first
              snapshot!
            </p>
            <div className="text-center">
              <button
                onClick={() =>
                  navigate(
                    `/family/${currentFamily?.familyId}/dashboard/image-uploads`
                  )
                }
                className="btn bg-[#654A2F] px-2 md:px-7 py-[3px] md:py-3 mt-5 mb-10 md:my-16 rounded-lg md:rounded-full font-[Lato] text-[#EBD199] text-[8px] md:text-[18px] cursor-pointer">
                Upload Now
              </button>
            </div>
          </>
        )}
        {images?.length !== 0 && (
          <div className="flex flex-wrap justify-center content-center md:my-10">
            {images?.map((image) => (
              <>
                <div className="w-[50%] md:w-[30%] my-5 ">
                  <img
                    src={image.imageUrl}
                    className="w-[80%] rounded-lg mx-auto border-[1.5px] md:border-2 border-[#654A2F]"
                  />
                </div>
              </>
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
