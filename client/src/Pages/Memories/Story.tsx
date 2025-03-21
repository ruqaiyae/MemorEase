import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { readStory, type Story } from '../../Lib/data';
import { toast } from 'react-toastify';
import { Msg } from '../../Components/Toast';
import { useFamily } from '../../Components/FamilyManagement/useFamily';
import { MemoryContainer } from '../../Components/DataManagement/MemoryContainer';
import { Container } from '../../Components/Layout/Container';

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
      <Container mobileWidth="80%" width="70%">
        <p className="font-[lato] text-[#654A2F] text-[12px] md:text-[20px] italic leading-[1.6] md:leading-[2] px-5 md:px-10 py-3 md:py-10">
          {story?.content}
        </p>
      </Container>
    </MemoryContainer>
  );
}
