import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { type Story, readStories } from '../../Lib/data';
import { MemoriesContainer } from '../../Components/DataManagement/MemoriesContainer';

export function StoryMemories() {
  const { familyId } = useParams();
  const [stories, setStories] = useState<Story[]>();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const res = await readStories(Number(familyId));
        setStories(res);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [familyId]);

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
                  onClick={() =>
                    navigate(
                      `/family/${familyId}/dashboard/stories/${story.storyId}`
                    )
                  }
                  className="mx-auto my-3 border-[1.5px] rounded-lg md:border-2 border-[#654A2F] cursor-pointer">
                  <li className="p-5">{story.title}</li>
                </div>
              ))}
            </ul>
          </div>
        )}
      </MemoriesContainer>
    </>
  );
}
