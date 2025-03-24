import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { type Video, readVideos } from '../../Lib/data';
import { MemoriesContainer } from '../../Components/DataManagement/MemoriesContainer';

export function VideoMemories() {
  const { familyId } = useParams();
  const [videos, setVideos] = useState<Video[]>();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const res = await readVideos(Number(familyId));
        setVideos(res);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [familyId]);

  return (
    <MemoriesContainer
      header1="Relive the moments of the "
      header2=" family
      - where every video keeps our voices, laughter, and memories alive."
      loading={isLoading}
      content={videos}
      memoryType="snapshot"
      path="video-uploads">
      {videos?.length !== 0 && (
        <div className="flex flex-wrap justify-center content-center md:my-10">
          {videos?.map((video) => (
            <img
              src={video.videoUrl}
              key={video.videoId}
              onClick={() =>
                navigate(
                  `/family/${familyId}/dashboard/videos/${video.videoId}`
                )
              }
              className="p-2 cursor-pointer w-20 md:w-40 h-20 md:h-40 object-cover"
            />
          ))}
        </div>
      )}
    </MemoriesContainer>
  );
}
