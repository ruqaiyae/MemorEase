import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  type Story,
  readStories,
  // readStoryLikes,
  // likeMemory,
  // dislikeMemory,
} from '../../Lib/data';
import { MemoriesContainer } from '../../Components/DataManagement/MemoriesContainer';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
// import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';

export function StoryMemories() {
  const { familyId } = useParams();
  const [stories, setStories] = useState<Story[]>();
  // const [storyIds, setStoryIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // const [isLiked, setIsLiked] = useState<boolean[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function load(familyId: number) {
      try {
        const res = await readStories(familyId);
        setStories(res);
        // stories && setStoryIds(stories.map((story) => story.storyId));
        // const likedStatus = await readStoryLikes(familyId, storyIds);
        // likedStatus?.storyId && setIsLiked(true);

        // let likedStatus;
        // for (let i = 0; i < storyIds.length; i++) {
        //   likedStatus = await readStoryLikes(familyId, storyIds[i]);
        //   const storyLike = likedStatus ? true : false;
        //   setIsLiked([...isLiked, storyLike]);
        // }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    }
    load(Number(familyId));
  }, [familyId]);

  // async function handleLike(storyId: number) {
  //   !isLiked && (await likeMemory(Number(familyId), 'story', Number(storyId)));
  //   isLiked &&
  //     (await dislikeMemory(Number(familyId), 'story', Number(storyId)));
  // }

  // function heartIcon(): IconProp | undefined {
  //   for (let i = 0; i < isLiked.length; i++) {
  //     if (isLiked[i]) {
  //       return faHeartSolid;
  //     }
  //     return faHeartRegular;
  //   }
  // }

  // function heartClass(): string | undefined {
  //   for (let i = 0; i < isLiked.length; i++) {
  //     if (isLiked[i]) {
  //       return 'text-[#d51010] md:text-[25px]';
  //     }
  //     return 'text-[#654A2F] md:text-[25px]';
  //   }
  //   return undefined;
  // }

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
                  className="mx-auto my-3 border-[1.5px] rounded-lg md:border-2 border-[#654A2F] cursor-pointer">
                  {/* <FontAwesomeIcon
                    icon={heartIcon()}
                    onClick={() => handleLike(story.storyId)}
                    className={heartClass()}
                  /> */}
                  <li
                    onClick={() =>
                      navigate(
                        `/family/${familyId}/dashboard/stories/${story.storyId}`
                      )
                    }
                    className="p-5">
                    {story.title}
                  </li>
                </div>
              ))}
            </ul>
          </div>
        )}
      </MemoriesContainer>
    </>
  );
}
