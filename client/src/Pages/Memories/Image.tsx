import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { readImage, type Image } from '../../Lib/data';
import { useFamily } from '../../Components/FamilyManagement/useFamily';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { Msg } from '../../Components/Toast';
import { MemoryContainer } from '../../Components/DataManagement/MemoryContainer';

export function Image() {
  const [image, setImage] = useState<Image>();
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const { imageId } = useParams();
  const { currentFamily } = useFamily();

  function errorMsg() {
    toast(<Msg message="Error loading image. Please try again." />);
  }

  useEffect(() => {
    async function loadImage(imageId: number) {
      try {
        const res = await readImage(currentFamily?.familyId, imageId);
        setImage(res);
      } catch (err) {
        errorMsg();
      } finally {
        setIsLoading(false);
      }
    }
    if (imageId) {
      setIsLoading(true);
      loadImage(+imageId);
    }
  }, [currentFamily?.familyId, imageId]);

  return (
    <MemoryContainer
      text="A single photo can hold a thousand memories."
      isLoading={isLoading}>
      <div className="w-[50%] md:w-[40%] mx-5 md:mx-20">
        <div>
          <img
            src={image?.imageUrl}
            className="object-contain border-[1.5px] md:border-2 border-[#654A2F] rounded-lg"
          />
        </div>
        <div className="flex justify-between content-center mt-3">
          <p className="text-[#654A2F] text-[12px] md:text-[20px]">
            {image?.caption}
          </p>
          <FontAwesomeIcon
            icon={isLiked ? faHeartSolid : faHeartRegular}
            onClick={() => setIsLiked(!isLiked)}
            className={
              isLiked
                ? 'text-[#d51010] md:text-[25px]'
                : 'text-[#654A2F] md:text-[25px]'
            }
          />
        </div>
      </div>
      <div className="w-[50%]">
        <p className="text-[#654A2F] text-[12px] md:text-[20px]">Comments</p>
      </div>
    </MemoryContainer>
  );
}
