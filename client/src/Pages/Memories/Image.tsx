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
  type Image,
  readImage,
  likeMemory,
  dislikeMemory,
  readImageLike,
  type Comment,
  readImageComment,
  addComment,
  deleteComment,
} from '../../Lib/data';
import { Comments } from '../../Components/DataManagement/Comments';

export function Image() {
  const [image, setImage] = useState<Image>();
  const [isLoading, setIsLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [ownerId, setOwnerId] = useState<number>();
  const { familyId, imageId } = useParams();
  const { user } = useUser();

  useEffect(() => {
    async function loadImage(familyId: number, imageId: number) {
      try {
        setIsLoading(true);
        const image = await readImage(familyId, imageId);
        setImage(image);
        setOwnerId(image.userId);
        const likedStatus = await readImageLike(familyId, imageId);
        likedStatus?.imageId && setIsLiked(true);
        const imageComments = await readImageComment(familyId, imageId);
        imageComments && setComments(imageComments);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    }
    if (imageId) {
      setIsLoading(true);
      loadImage(Number(familyId), +imageId);
    }
  }, [familyId, imageId]);

  async function handleLike() {
    setIsLiked(!isLiked);
    !isLiked && (await likeMemory(Number(familyId), 'image', Number(imageId)));
    isLiked &&
      (await dislikeMemory(Number(familyId), 'image', Number(imageId)));
  }

  async function handleSubmit(value: string) {
    try {
      await addComment(
        Number(familyId),
        'image',
        Number(imageId),
        user?.username,
        value
      );
      const updatedComments = await readImageComment(
        Number(familyId),
        Number(imageId)
      );
      setComments(updatedComments);
    } catch (err) {
      errorMsg('Error adding comment. Please try again!');
    }
  }

  async function handleDelete(id: number) {
    await deleteComment(id, Number(familyId), 'image', Number(imageId));
    const remainingComments = comments.filter(
      (comment) => comment.commentsId !== id
    );
    setComments(remainingComments);
  }

  return (
    <MemoryContainer
      marginLeft="0"
      marginRight="0"
      text="A single photo can hold a thousand memories."
      isLoading={isLoading}>
      <div className="flex flex-wrap md:flex-nowrap justify-center">
        <div className="w-[60%] md:w-[40%] mx-5 md:mx-20">
          <div className="relative inline-block">
            <img
              src={image?.imageUrl}
              className="object-contain border-[1.5px] md:border-2 border-[#654A2F] rounded-lg"
            />
            <div className="flex justify-between items-end md:mt-3 w-full">
              <div className="flex items-end">
                {user?.userId === ownerId ? (
                  <Link
                    to={`/family/${familyId}/dashboard/images/${imageId}/edit`}>
                    <FontAwesomeIcon
                      icon={faPen}
                      className="text-[8px] md:text-[20px] text-[#654A2F] pr-1 md:pr-2"
                    />
                  </Link>
                ) : null}
                <p className="text-[#654A2F] text-[12px] md:text-[20px]">
                  {image?.caption}
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
          width="60%"
          onCommentSubmit={handleSubmit}
          comments={comments}
          onDelete={handleDelete}
        />
      </div>
    </MemoryContainer>
  );
}
