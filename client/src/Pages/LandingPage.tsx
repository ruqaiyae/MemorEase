import { useNavigate } from 'react-router-dom';
import { HeroImg } from '../Components/HeroImg';
import { Container } from '../Components/Layout/Container';
import { MemoryDescription, MemoryTile } from '../Components/MemoryShowcase';
import { useUser } from '../Components/UserManagement/useUser';
import { useFamily } from '../Components/FamilyManagement/useFamily';

export function LandingPage() {
  const { user } = useUser();
  const { currentFamily } = useFamily();
  const navigate = useNavigate();

  return (
    <>
      <HeroImg />
      <div className="bg-[#654A2F] w-[70%] mx-auto rounded-[50%]">
        <h1 className="font-[fondamento] font-bold text-[#EBD199] text-[15px] md:text-[40px] text-center my-6 md:my-12 md:my-6 py-2 md:py-4">
          Preserve Memories, Share Your Legacy
        </h1>
      </div>
      <Container mobileWidth="85%" width="80%">
        <div className="px-6 md:px-30">
          <div className="flex mt-7 md:my-20">
            <MemoryTile
              src="/MemoryTiles/Album.png"
              alt="Album"
              tileWidth="40%"
              onSelect={
                user
                  ? () => {
                      navigate(
                        `family/${currentFamily?.familyId}/dashboard/images`
                      );
                      window.scrollTo(0, 0);
                    }
                  : undefined
              }
              cursor={user ? 'pointer' : 'default'}
            />
            <div className="w-[10px] md:w-[20px]" />
            <MemoryDescription
              title="Eternal Snapshots"
              description="A treasure trove of cherished photographs capturing the essence of your family's journey. From vintage portraits to modern-day celebrations, a timeless collection of preserved memories."
            />
          </div>
          <div className="flex my-10 md:my-20">
            <MemoryDescription
              title="Generations of Flavor"
              description={`Handwritten recipes, secret family dishes, and culinary traditions passed down through the ages.
A digital recipe book infused with the flavors of family history.`}
              textAlign="right"
            />
            <div className="w-[10px] md:w-[20px]" />
            <MemoryTile
              src="/MemoryTiles/Recipe.png"
              alt="Recipe Book"
              tileWidth="40%"
              onSelect={
                user
                  ? () => {
                      navigate(
                        `family/${currentFamily?.familyId}/dashboard/recipes`
                      );
                      window.scrollTo(0, 0);
                    }
                  : undefined
              }
              cursor={user ? 'pointer' : 'default'}
            />
          </div>
          <div className="flex my-10 md:my-20">
            <MemoryTile
              src="/MemoryTiles/Story.png"
              alt="Story Book"
              tileWidth="40%"
            />
            <div className="w-[10px] md:w-[20px]" />
            <MemoryDescription
              title="Family Folklore"
              description="Legends, bedtime stories, and unforgettable tales defining your family's heritage through words and wisdom, carried across generations."
            />
          </div>
          <div className="flex mb-7 mt-10 md:my-20">
            <MemoryDescription
              title="Timeless Tapes"
              description="A vault of voices, sounds, and recordings, echoing the past through heartfelt messages, nostalgic melodies, and home videos."
              textAlign="right"
            />
            <div className="w-[10px] md:w-[20px]" />
            <MemoryTile
              src="/MemoryTiles/Video.png"
              alt="Video Album"
              tileWidth="40%"
            />
          </div>
        </div>
      </Container>
      <div className="md:mb-30">
        <div className="bg-[#654A2F] mx-auto rounded-2xl w-[80%]">
          <h2 className="font-[fondamento] font-bold text-[#EBD199] text-[13px] md:text-[35px] text-center mb-3 md:my-6 py-2 md:py-4">
            Start Building Your Family's Memory Vault Today!
          </h2>
        </div>
        <div className="flex justify-center">
          <button
            onClick={() => {
              navigate('sign-up');
              window.scrollTo(0, 0);
            }}
            className="btn bg-[#654A2F] px-2 md:px-7 py-[3px] md:py-3 my-3 md:mt-6 rounded-lg md:rounded-full font-[Lato] text-[#EBD199] text-[8px] md:text-[25px] cursor-pointer">
            Get Started
          </button>
        </div>
      </div>
    </>
  );
}
