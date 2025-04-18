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
import { useUser } from '../../Components/UserManagement/useUser';
import {
  type Video,
  readVideo,
  likeMemory,
  dislikeMemory,
  readVideoLike,
  type Comment,
  readVideoComment,
  addComment,
  deleteComment,
} from '../../Lib/data';
import { Comments } from '../../Components/DataManagement/Comments';

export function Video() {
  const [video, setVideo] = useState<Video>();
  const [isLoading, setIsLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [ownerId, setOwnerId] = useState<number>();
  const { familyId, videoId } = useParams();
  const { user } = useUser();

  useEffect(() => {
    async function loadVideo(familyId: number, videoId: number) {
      try {
        setIsLoading(true);
        const res = await readVideo(familyId, videoId);
        setVideo(res);
        setOwnerId(res.userId);
        const likedStatus = await readVideoLike(familyId, videoId);
        likedStatus?.videoId && setIsLiked(true);
        const videoComments = await readVideoComment(familyId, videoId);
        videoComments && setComments(videoComments);
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

  async function handleLike() {
    setIsLiked(!isLiked);
    !isLiked && (await likeMemory(Number(familyId), 'video', Number(videoId)));
    isLiked &&
      (await dislikeMemory(Number(familyId), 'video', Number(videoId)));
  }

  async function handleSubmit(value: string) {
    try {
      await addComment(
        Number(familyId),
        'video',
        Number(videoId),
        user?.username,
        value
      );
      const updatedComments = await readVideoComment(
        Number(familyId),
        Number(videoId)
      );
      setComments(updatedComments);
    } catch (err) {
      errorMsg('Error adding comment. Please try again!');
    }
  }

  async function handleDelete(id: number) {
    await deleteComment(id, Number(familyId), 'video', Number(videoId));
    const remainingComments = comments.filter(
      (comment) => comment.commentsId !== id
    );
    setComments(remainingComments);
  }

  return (
    <MemoryContainer
      marginLeft="40px"
      marginRight="40px"
      text="A single video brings voices, laughter, and moments back to life."
      isLoading={isLoading}>
      <div className="flex flex-wrap md:flex-nowrap justify-center mt-5">
        <div className="w-[80%] md:w-[60%] mx-5 md:mx-20">
          <div className="relative inline-block">
            <video
              controls
              src={video?.videoUrl}
              className="object-contain border-[1.5px] md:border-2 border-[#654A2F] rounded-lg"
            />
            <div className="flex justify-between items-end mt-1 md:mt-3 w-full">
              <div className="flex items-end">
                {user?.userId === ownerId ? (
                  <Link
                    to={`/family/${familyId}/dashboard/videos/${videoId}/edit`}>
                    <FontAwesomeIcon
                      icon={faPen}
                      className="text-[8px] md:text-[20px] text-[#654A2F] pr-1 md:pr-2"
                    />
                  </Link>
                ) : null}
                <p className="text-[#654A2F] text-[12px] md:text-[20px]">
                  {video?.caption}
                </p>
              </div>
              <FontAwesomeIcon
                icon={isLiked ? faHeartSolid : faHeartRegular}
                onClick={handleLike}
                className={`md:text-[25px] cursor-pointer ${
                  isLiked ? 'text-[#d51010]' : 'text-[#654A2F]'
                }`}
              />
            </div>
          </div>
        </div>
        <Comments
          width="80%"
          onCommentSubmit={handleSubmit}
          comments={comments}
          onDelete={handleDelete}
        />
      </div>
    </MemoryContainer>
  );
}
