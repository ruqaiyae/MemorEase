import { FormEvent, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import {
  faHeart as faHeartSolid,
  faPen,
  faTrash,
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

export function Video() {
  const [video, setVideo] = useState<Video>();
  const [isLoading, setIsLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [value, setValue] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const { familyId, videoId } = useParams();
  const { user } = useUser();

  useEffect(() => {
    async function loadVideo(familyId: number, videoId: number) {
      try {
        setIsLoading(true);
        const res = await readVideo(familyId, videoId);
        setVideo(res);
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
      setValue('');
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
                onClick={handleLike}
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
          <form onSubmit={(e) => handleSubmit(e)}>
            <label>
              <input
                placeholder="Add your comment"
                onChange={(e) => setValue(e.target.value)}
                value={value}
                className="border md:border-2 focus:border-2 md:focus:border-3 focus:outline-none border-[#654A2F] rounded md:rounded-md  md:p-4 md:h-8 w-[600px] mt-1 text-[#654A2F] text-[10px] md:text-[17px]"
              />
            </label>
          </form>
          <ul className="mt-5">
            {comments?.map((comment) => (
              <li
                key={comment.commentsId}
                className="text-[#654A2F] text-[10px] md:text-[15px] mt-1 flex justify-between w-[600px]">
                <p>
                  <span className="font-medium italic">{comment.author}</span>:{' '}
                  {comment.comment}
                </p>
                {comment.author === user?.username ? (
                  <FontAwesomeIcon
                    icon={faTrash}
                    onClick={() => handleDelete(comment.commentsId)}
                    className="mr-2 cursor-pointer"
                  />
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </MemoryContainer>
  );
}
