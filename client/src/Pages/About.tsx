export function About() {
  return (
    <>
      <div className="flex bg-[#654A2F]">
        <div className="flex w-[50%] md:w-[60%]">
          <div className="content-center ml-7 md:ml-35 mr-3">
            <h1 className="font-[fondamento] text-[#EBD199] md:text-5xl mb-2 md:mb-6">
              Your Memories, Forever Cherished.
            </h1>
            <p className="font-[lato] text-[#EBD199] text-[10px] md:text-[20px] md:mr-40">
              MemorEase is a digital sanctuary where your family&apos;s stories,
              moments, and traditions live on for generations to come.
            </p>
          </div>
        </div>
        <div className="flex justify-center w-[50%] md:w-[40%]">
          <img
            src="/about-us-hero.webp"
            alt="A happy family"
            className="w-[80%] md:w-[50%] m-5 md:m-10 border-[#EBD199] rounded-lg shadow-lg"
          />
        </div>
      </div>
      <div className="font-[Artifika] text-[#654A2F] text-[10px] md:text-[20px] w-[85%] md:w-[75%] mx-auto my-7 md:my-18">
        <p className="py-1 md:py-3">Dear Memory Keepers, </p>
        <p className="py-1 md:py-3">
          Welcome to MemorEase—where every moment becomes a cherished heirloom.
          Our journey began with a simple, heartfelt idea: to preserve the magic
          of family stories, the laughter shared over old photo albums, and the
          timeless lessons gifted by our grandparents. In an ever-moving world,
          we believe memories should not fade into obscurity but shine as
          beacons of our shared legacy.
        </p>
        <p className="py-1 md:py-3">
          At MemorEase, we&apos;ve built a secure digital vault where photos,
          videos, and heartfelt messages are lovingly stored, waiting to bridge
          generations. Imagine logging in and instantly feeling the warmth of a
          long-ago embrace or the joy of rediscovering a favorite family tale.
          Our platform is more than just a service—it&apos;s your family&apos;s
          personal time capsule, designed to keep the spirit, tradition, and
          love alive.
        </p>
        <p className="py-1 md:py-3">
          Thank you for inviting us to share in your story.{' '}
        </p>
        <p className="py-1 md:py-3">With warmth, </p>
        <p className="py-1 md:py-3">The MemorEase Team</p>
      </div>
    </>
  );
}
