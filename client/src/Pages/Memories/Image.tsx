import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import {
  faHeart as faHeartSolid,
  faPen,
} from '@fortawesome/free-solid-svg-icons';
import { MemoryContainer } from '../../Components/DataManagement/MemoryContainer';
import { errorMsg } from '../../Components/Toast/errorToast';
import {
  type Image,
  readImage,
  likeMemory,
  dislikeMemory,
  readImageLike,
} from '../../Lib/data';

export function Image() {
  const [image, setImage] = useState<Image>();
  const [isLoading, setIsLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const { familyId, imageId } = useParams();

  useEffect(() => {
    async function loadImage(familyId: number, imageId: number) {
      try {
        setIsLoading(true);
        const res = await readImage(familyId, imageId);
        setImage(res);
        const likedStatus = await readImageLike(familyId, imageId);
        if (!likedStatus) return;
        likedStatus.imageId && setIsLiked(true);
      } catch (err) {
        errorMsg('Error loading image. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
    if (imageId) {
      setIsLoading(true);
      loadImage(Number(familyId), +imageId);
    }
  }, [familyId, imageId]);

  async function handleClick() {
    setIsLiked(!isLiked);
    !isLiked && (await likeMemory(Number(familyId), 'image', Number(imageId)));
    isLiked &&
      (await dislikeMemory(Number(familyId), 'image', Number(imageId)));
  }

  return (
    <MemoryContainer
      marginLeft="0"
      marginRight="0"
      text="A single photo can hold a thousand memories."
      isLoading={isLoading}>
      <div className="flex flex-wrap md:flex-nowrap md:justify-center">
        <div className="md:w-[40%] mx-5 md:mx-20">
          <div className="relative inline-block">
            <img
              src={image?.imageUrl}
              className="object-contain border-[1.5px] md:border-2 border-[#654A2F] rounded-lg"
            />
            <div className="flex justify-between content-center mt-1 md:mt-3 w-full">
              <div className="flex items-center">
                <Link
                  to={`/family/${familyId}/dashboard/images/${imageId}/edit`}>
                  <FontAwesomeIcon
                    icon={faPen}
                    className="text-[8px] md:text-[20px] text-[#654A2F] pr-1 md:pr-2"
                  />
                </Link>
                <p className="text-[#654A2F] text-[12px] md:text-[20px]">
                  {image?.caption}
                </p>
              </div>
              <FontAwesomeIcon
                icon={isLiked ? faHeartSolid : faHeartRegular}
                onClick={handleClick}
                className={
                  isLiked
                    ? 'text-[#d51010] md:text-[25px]'
                    : 'text-[#654A2F] md:text-[25px]'
                }
              />
            </div>
          </div>
        </div>
        <div className="w-[50%]">
          <p className="text-[#654A2F] text-[12px] md:text-[20px] mt-5">
            Comments
          </p>
        </div>
      </div>
    </MemoryContainer>
  );
}
