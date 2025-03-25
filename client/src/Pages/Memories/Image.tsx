import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { readImage, type Image } from '../../Lib/data';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import {
  faHeart as faHeartSolid,
  faPen,
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { Msg } from '../../Components/Toast';
import { MemoryContainer } from '../../Components/DataManagement/MemoryContainer';

export function Image() {
  const [image, setImage] = useState<Image>();
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const { familyId, imageId } = useParams();

  function errorMsg() {
    toast(<Msg message="Error loading image. Please try again." />);
  }

  useEffect(() => {
    async function loadImage(imageId: number) {
      try {
        const res = await readImage(Number(familyId), imageId);
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
  }, [familyId, imageId]);

  return (
    <MemoryContainer
      marginLeft="0"
      marginRight="0"
      text="A single photo can hold a thousand memories."
      isLoading={isLoading}>
      <div className="flex flex-wrap md:flex-nowrap md:justify-center">
        <div className="w-[50%] md:w-[40%] mx-5 md:mx-20">
          <div>
            <img
              src={image?.imageUrl}
              className="object-contain border-[1.5px] md:border-2 border-[#654A2F] rounded-lg"
            />
          </div>
          <div className="flex justify-between content-center mt-1 md:mt-3 ">
            <div className="flex items-center">
              <Link to={`/family/${familyId}/dashboard/images/${imageId}/edit`}>
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
          <p className="text-[#654A2F] text-[12px] md:text-[20px] mt-5">
            Comments
          </p>
        </div>
      </div>
    </MemoryContainer>
  );
}
