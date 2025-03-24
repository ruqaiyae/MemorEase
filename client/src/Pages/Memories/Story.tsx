import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { readStory, type Story } from '../../Lib/data';
import { toast } from 'react-toastify';
import { Msg } from '../../Components/Toast';
import { useFamily } from '../../Components/FamilyManagement/useFamily';
import { MemoryContainer } from '../../Components/DataManagement/MemoryContainer';

export function Story() {
  const [story, setStory] = useState<Story>();
  const [isLoading, setIsLoading] = useState(true);
  const { storyId } = useParams();
  const { currentFamily } = useFamily();

  function errorMsg() {
    toast(<Msg message="Error loading story. Please try again." />);
  }

  useEffect(() => {
    async function loadStory(storyId: number) {
      try {
        const res = await readStory(currentFamily?.familyId, storyId);
        setStory(res);
      } catch (err) {
        errorMsg();
      } finally {
        setIsLoading(false);
      }
    }
    if (storyId) {
      setIsLoading(true);
      loadStory(+storyId);
    }
  }, [currentFamily?.familyId, storyId]);

  return (
    <MemoryContainer text={story ? story.title : ''} isLoading={isLoading}>
      <div className="border-[1.5px] md:border-2 border-[#654A2F] rounded-lg w-[80%] md:w=[30%] mx-auto mb-4 md:mb-6"></div>
      <div className="w-[80%] text-right mx-auto">
        <Link
          to={`/family/${currentFamily?.familyId}/dashboard/stories/${storyId}/edit`}
          className="text-[#654A2F] underline">
          Edit
        </Link>
      </div>

      <p className="font-[lato] text-[#654A2F] text-[12px] md:text-[23px] leading-[1.6] md:leading-[2] mt-1 px-10 md:px-40 md:py-10">
        {story?.content}
      </p>
      <p className="font-[lato] text-[#654A2F] bold text-[10px] md:text-[20px] text-end mt-3 px-10 md:px-50">
        Written by:{' '}
        <span className="text-[12px] md:text-[22px] italic">
          {story?.author}
        </span>
      </p>
    </MemoryContainer>
  );
}
