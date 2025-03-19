import { Container } from '../Components/Layout/Container';
import { useFamily } from '../Components/FamilyManagement/useFamily';
import { MemoryTile } from '../Components/MemoryShowcase';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
  const { currentFamily } = useFamily();
  const navigate = useNavigate();

  return (
    <>
      <h1 className="font-[fondamento] text-[#654A2F] text-center text-[16px] md:text-[50px] my-4 md:my-8 mx-7 md:mx-70">
        Welcome to the legacy of the {currentFamily?.familyName} family — where
        memories live on.
      </h1>
      <Container mobileWidth="85%" width="70%">
        <div className="flex flex-wrap justify-center px-2 my-6">
          <div className="mx-1 md:my-10 w-[45%]">
            <MemoryTile
              src="/MemoryTiles/Album.png"
              alt="Album"
              tileWidth="100%"
              onSelect={() => navigate('images')}
            />
            <div className="h-[10px] md:h-[20px]" />
            <h4 className="font-[fondamento] md:text-[40px] text-[#654A2F] text-center">
              Eternal Snapshots
            </h4>
          </div>
          <div className="mx-1 md:my-10 w-[45%]">
            <MemoryTile
              src="/MemoryTiles/Recipe.png"
              alt="Recipe Book"
              tileWidth="100%"
            />
            <div className="h-[10px] md:h-[20px]" />
            <h4 className="font-[fondamento] md:text-[40px] text-[#654A2F] text-center">
              Generations of Flavor
            </h4>
          </div>
          <div className="mt-4 md:my-10 w-[45%]">
            <MemoryTile
              src="/MemoryTiles/Story.png"
              alt="Story Book"
              tileWidth="100%"
            />
            <div className="h-[10px] md:h-[20px]" />
            <h4 className="font-[fondamento] md:text-[40px] text-[#654A2F] text-center">
              Family Folklore
            </h4>
          </div>
          <div className="mt-4 md:my-10 w-[45%]">
            <MemoryTile
              src="/MemoryTiles/Video.png"
              alt="Video Album"
              tileWidth="100%"
            />
            <div className="h-[10px] md:h-[20px]" />
            <h4 className="font-[fondamento] md:text-[40px] text-[#654A2F] text-center">
              Timeless Tapes
            </h4>
          </div>
        </div>
      </Container>
    </>
  );
}
