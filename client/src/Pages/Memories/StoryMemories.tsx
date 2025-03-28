import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  type Story,
  readStories,
  readStoryLike,
  type LikeMemory,
  likeMemory,
  dislikeMemory,
} from '../../Lib/data';
import { MemoriesContainer } from '../../Components/DataManagement/MemoriesContainer';
import { errorMsg } from '../../Components/Toast/errorToast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';

export function StoryMemories() {
  const { familyId } = useParams();
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function load(familyId: number) {
      try {
        setIsLoading(true);
        const response = await readStories(familyId);
        const likedStories = await readStoryLike(familyId);

        if (response && likedStories) {
          const likedStoryIds = new Set(
            likedStories.map((story) => story.storyId)
          );

          const updatedStories = response.map((story) => ({
            ...story,
            isLiked: likedStoryIds.has(story.storyId),
          }));

          setStories(updatedStories);
        }

        // if (likedStories) {
        //   for (let i = 0; i < res?.length; i++) {
        //     const foundStory = likedStories.find(
        //       ({ storyId }) => storyId === res[i].storyId
        //     );
        //     if (foundStory) {
        //       res[i] = {
        //         ...res[i],
        //         isLiked: true,
        //       };
        //     } else {
        //       res[i] = {
        //         ...res[i],
        //         isLiked: false,
        //       };
        //     }
        //   }
        //   setStories(res);
        // }
      } catch (err) {
        errorMsg('Error loading recipes. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
    load(Number(familyId));
  }, [familyId]);

  async function handleLike(story: LikeMemory) {
    const temp = [...stories];

    for (let i = 0; i < temp.length; i++) {
      if (temp[i].storyId === story.storyId) {
        temp[i].isLiked = !temp[i]?.isLiked;
        setStories(temp);
        if (temp[i].isLiked) {
          likeMemory(Number(familyId), 'story', Number(story.storyId));
        } else {
          dislikeMemory(Number(familyId), 'story', Number(story.storyId));
        }
      }
    }
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
              {stories?.map((story) => (
                <div
                  key={story.storyId}
                  className="mx-auto my-3 border-[1.5px] rounded-lg md:border-2 border-[#654A2F]  text-center">
                  <li
                    onClick={() =>
                      navigate(
                        `/family/${familyId}/dashboard/stories/${story.storyId}`
                      )
                    }
                    className="px-5 mt-5 cursor-pointer">
                    {story.title}
                  </li>

                  <FontAwesomeIcon
                    icon={story.isLiked ? faHeartSolid : faHeartRegular}
                    onClick={() => handleLike(story)}
                    className={`text-[25px] cursor-pointer ${
                      story.isLiked ? 'text-[#d51010]' : 'text-[#654A2F]'
                    }`}
                  />
                </div>
              ))}
            </ul>
          </div>
        )}
      </MemoriesContainer>
    </>
  );
}
