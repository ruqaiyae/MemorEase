import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { readStory, type Story } from '../../Lib/data';
import { MemoryContainer } from '../../Components/DataManagement/MemoryContainer';
import { Container } from '../../Components/Layout/Container';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { errorMsg } from '../../Components/Toast/errorToast';
import { useUser } from '../../Components/UserManagement/useUser';

export function Story() {
  const [story, setStory] = useState<Story>();
  const [isLoading, setIsLoading] = useState(true);
  const { familyId, storyId } = useParams();
  const { user } = useUser();

  useEffect(() => {
    async function loadStory(familyId: number, storyId: number) {
      try {
        const story = await readStory(familyId, storyId);
        setStory(story);
      } catch (err) {
        errorMsg('Error loading story. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
    if (storyId) {
      setIsLoading(true);
      loadStory(Number(familyId), +storyId);
    }
  }, [familyId, storyId]);

  const paragraphs = story?.content.split(/\n\s*\n/).map((para) => para.trim());

  return (
    <MemoryContainer
      marginLeft="60px"
      marginRight="60px"
      text="Every story is a thread in the fabric of our family's legacy."
      isLoading={isLoading}>
      <Container mobileWidth="80%" width="70%">
        <div className="w-[100%] text-right">
          {story?.author === `${user?.firstName} ${user?.lastName}` ? (
            <Link to={`/family/${familyId}/dashboard/stories/${storyId}/edit`}>
              <FontAwesomeIcon
                icon={faPenToSquare}
                className="text-[#654A2F] text-[12px] md:text-[25px] md:pt-5 pr-2 md:pr-5"
              />
            </Link>
          ) : null}
        </div>
        <h2 className="font-[fondamento] text-[#654A2F] text-center text-[14px] md:text-[30px] mb-4 md:mb-10 mt-3 md:mt-15 mx-7 md:mx-30">
          {story?.title}
        </h2>
        {paragraphs?.map((para, index) => (
          <p
            key={index}
            className='className="font-[lato] text-[#654A2F] text-[12px] md:text-[23px] text-justify indent-7 md:indent-20 leading-[1.6] md:leading-[2] mt-1 px-10 md:px-30'
            style={{ textIndent: '2em', marginBottom: '1em' }}>
            {para}
          </p>
        ))}
        <p className="font-[lato] text-[#654A2F] bold text-[10px] md:text-[20px] text-end mt-3 mb-5 md:mb-10 px-4 md:px-10">
          Written by:{' '}
          <span className="text-[12px] md:text-[22px] italic">
            {story?.author}
          </span>
        </p>
      </Container>
    </MemoryContainer>
  );
}
