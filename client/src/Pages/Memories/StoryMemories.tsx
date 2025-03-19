import { useEffect, useState } from 'react';
import { type Story, readStories } from '../../Lib/data';
import { useFamily } from '../../Components/FamilyManagement/useFamily';
import { MemoriesContainer } from '../../Components/DataManagement/MemoriesContainer';

export function StoryMemories() {
  const { currentFamily } = useFamily();
  const [stories, setStories] = useState<Story[]>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await readStories(currentFamily?.familyId);
        setStories(res);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  });

  return (
    <>
      <MemoriesContainer
        header1="Dive into the stories that shape the "
        header2=" family - where each word is a chapter in our timeless legacy."
        loading={isLoading}
        content={stories}
        memoryType="tale"
        path="story-uploads">
        {stories?.length !== 0 && (
          <div className="mb-10">
            <ul className="flex flex-wrap text-[#654A2F] text-[10px] md:text-[25px] md:my-10">
              {stories?.map((story) => (
                <div className="mx-auto my-3 border-[1.5px] rounded-lg md:border-2 border-[#654A2F]">
                  <li key={story.storyId} className="p-5">
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
