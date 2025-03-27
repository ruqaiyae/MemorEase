import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  type Story,
  readStories,
  readStoryLike,
  likeMemory,
  dislikeMemory,
  LikeMemory,
} from '../../Lib/data';
import { MemoriesContainer } from '../../Components/DataManagement/MemoriesContainer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';

export function StoryMemories() {
  const { familyId } = useParams();
  const [stories, setStories] = useState<Story[]>();
  const [isLiked, setIsLiked] = useState(false);
  const [likedStories, setLikedStories] = useState<LikeMemory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function load(familyId: number) {
      try {
        const res = await readStories(familyId);
        setStories(res);
        const likedStories = await readStoryLike(familyId);
        likedStories && setLikedStories(likedStories);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    }
    load(Number(familyId));
  }, [familyId]);

  async function handleLike(story: LikeMemory) {
    setIsLiked(!isLiked);
    !isLiked &&
      (await likeMemory(Number(familyId), 'story', Number(story.storyId)));
    setLikedStories([...likedStories, story]);
    isLiked &&
      (await dislikeMemory(Number(familyId), 'story', Number(story.storyId)));
  }

  return (
    <>
      <MemoriesContainer
        header1="Dive into the stories that shape the "
        header2=" family
        - where each word is a chapter in our timeless legacy."
        loading={isLoading}
        content={stories}
        memoryType="tale"
        path="story-uploads">
        {stories?.length !== 0 && (
          <div className="mb-10">
            <ul className="flex flex-wrap text-[#654A2F] text-[10px] md:text-[25px] md:my-10">
              {stories?.map((story) => {
                const isStoryLiked = likedStories.some(
                  (likedStory) => likedStory.storyId === story.storyId
                );

                return (
                  <>
                    <div
                      key={story.storyId}
                      className="mx-auto my-3 border-[1.5px] rounded-lg md:border-2 border-[#654A2F] cursor-pointer text-center">
                      <li
                        onClick={() =>
                          navigate(
                            `/family/${familyId}/dashboard/stories/${story.storyId}`
                          )
                        }
                        className="px-5 pt-5">
                        {story.title}
                      </li>

                      <FontAwesomeIcon
                        icon={isStoryLiked ? faHeartSolid : faHeartRegular}
                        onClick={() => handleLike(story)}
                        className={`text-[25px] ${
                          isStoryLiked ? 'text-[#d51010]' : 'text-[#654A2F]'
                        }`}
                      />
                    </div>
                  </>
                );
              })}
            </ul>
          </div>
        )}
      </MemoriesContainer>
    </>
  );
}
