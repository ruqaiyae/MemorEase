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
    async function loadStory(storyId: number) {
      try {
        const res = await readStory(Number(familyId), storyId);
        setStory(res);
      } catch (err) {
        errorMsg('Error loading story. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
    if (storyId) {
      setIsLoading(true);
      loadStory(+storyId);
    }
  }, [familyId, storyId]);

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
        <h2 className="font-[fondamento] text-[#654A2F] text-center text-[14px] md:text-[30px] mb-4 md:my-15 mx-7 md:mx-30">
          {story?.title}
        </h2>
        <p className="font-[lato] text-[#654A2F] text-[12px] md:text-[23px] leading-[1.6] md:leading-[2] mt-1 px-10 md:px-40 md:py-10">
          {story?.content}
        </p>
        <p className="font-[lato] text-[#654A2F] bold text-[10px] md:text-[20px] text-end my-3 px-4 md:px-50">
          Written by:{' '}
          <span className="text-[12px] md:text-[22px] italic">
            {story?.author}
          </span>
        </p>
      </Container>
    </MemoryContainer>
  );
}
