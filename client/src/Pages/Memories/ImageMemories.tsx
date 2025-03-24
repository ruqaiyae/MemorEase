import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFamily } from '../../Components/FamilyManagement/useFamily';
import { type Image, readImages } from '../../Lib/data';
import { MemoriesContainer } from '../../Components/DataManagement/MemoriesContainer';

export function ImageMemories() {
  const { currentFamily } = useFamily();
  const [images, setImages] = useState<Image[]>();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const res = await readImages(currentFamily?.familyId);
        setImages(res);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [currentFamily?.familyId]);

  return (
    <MemoriesContainer
      header1="Explore the Eternal Snapshots of the "
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
                  `/family/${currentFamily?.familyId}/dashboard/images/${image.imageId}`
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
