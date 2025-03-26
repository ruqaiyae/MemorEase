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
  type Video,
  readVideo,
  likeMemory,
  dislikeMemory,
  readVideoLike,
} from '../../Lib/data';

export function Video() {
  const [video, setVideo] = useState<Video>();
  const [isLoading, setIsLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const { familyId, videoId } = useParams();

  useEffect(() => {
    async function loadVideo(familyId: number, videoId: number) {
      try {
        setIsLoading(true);
        const res = await readVideo(familyId, videoId);
        setVideo(res);
        const likedStatus = await readVideoLike(familyId, videoId);
        if (!likedStatus) return;
        likedStatus.videoId && setIsLiked(true);
      } catch (err) {
        errorMsg('Error loading video. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
    if (videoId) {
      setIsLoading(true);
      loadVideo(Number(familyId), +videoId);
    }
  }, [familyId, videoId]);

  async function handleClick() {
    setIsLiked(!isLiked);
    !isLiked && (await likeMemory(Number(familyId), 'video', Number(videoId)));
    isLiked &&
      (await dislikeMemory(Number(familyId), 'video', Number(videoId)));
  }

  return (
    <MemoryContainer
      marginLeft=""
      marginRight=""
      text="A single video brings voices, laughter, and moments back to life."
      isLoading={isLoading}>
      <div className="flex flex-wrap md:flex-nowrap md:justify-center">
        <div className="md:w-[40%] mx-5 md:mx-20">
          <div className="relative inline-block">
            <video
              controls
              src={video?.videoUrl}
              className="object-contain border-[1.5px] md:border-2 border-[#654A2F] rounded-lg"
            />
            <div className="flex justify-between content-center mt-1 md:mt-3 w-full">
              <div className="flex items-center">
                <Link
                  to={`/family/${familyId}/dashboard/videos/${videoId}/edit`}>
                  <FontAwesomeIcon
                    icon={faPen}
                    className="text-[8px] md:text-[20px] text-[#654A2F] pr-1 md:pr-2"
                  />
                </Link>
                <p className="text-[#654A2F] text-[12px] md:text-[20px]">
                  {video?.caption}
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
