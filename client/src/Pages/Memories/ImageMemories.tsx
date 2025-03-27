import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { type Image, readImages } from '../../Lib/data';
import { MemoriesContainer } from '../../Components/DataManagement/MemoriesContainer';

export function ImageMemories() {
  const { familyId } = useParams();
  const [images, setImages] = useState<Image[]>();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        setIsLoading(true);
        const res = await readImages(Number(familyId));
        setImages(res);
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
      header1="Captured in frames, cherished for generations
      - welcome to the visual legacy of the "
      header2=" family"
      loading={isLoading}
      content={images}
      memoryType="snapshot"
      path="image-uploads">
      {images?.length !== 0 && (
        <div className="flex flex-wrap justify-center content-center md:my-10">
          {images?.map((image) => (
            <img
              src={image.imageUrl}
              key={image.imageId}
              onClick={() =>
                navigate(
                  `/family/${familyId}/dashboard/images/${image.imageId}`
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
