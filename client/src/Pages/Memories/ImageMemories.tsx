import { useEffect, useState } from 'react';
import { useFamily } from '../../Components/FamilyManagement/useFamily';
import { type Image, readImages } from '../../Lib/data';
import { MemoriesContainer } from '../../Components/DataManagement/MemoriesContainer';

export function ImageMemories() {
  const { currentFamily } = useFamily();
  const [images, setImages] = useState<Image[]>();
  const [isLoading, setIsLoading] = useState(true);

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
  });

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
            <div className="w-[50%] md:w-[30%] my-5 ">
              <img
                src={image.imageUrl}
                className="w-[80%] rounded-lg mx-auto border-[1.5px] md:border-2 border-[#654A2F]"
              />
            </div>
          ))}
        </div>
      )}
    </MemoriesContainer>
  );
}
