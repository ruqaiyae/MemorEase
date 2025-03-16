import { useNavigate } from 'react-router-dom';

export function FamilyForm() {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex justify-center flex-wrap border-[1.5px] md:border-2 border-[#654A2F] rounded-lg w-[70%] mx-auto mt-8 mb-15 md:mb-15">
        <h1 className="mx-3 mt-4 font-[artifika] text-[#654A2F] text-center text-[10px]">
          Whether you're creating new bonds or joining an existing one, a family
          is built on love and belonging. Take the first step towards a
          meaningful connection today!
        </h1>
        <button
          onClick={() => navigate('create-family')}
          className="btn bg-[#654A2F] m-4 px-3 md:px-7 py-2 md:py-3 md:mt-6 rounded-lg md:rounded-full font-[Lato] text-[#EBD199] text-[10px] md:text-[18px]">
          Create a family
        </button>
        <button
          onClick={() => navigate('join-family')}
          className="text-center btn bg-[#654A2F] m-4 px-3 md:px-7 py-2 md:py-3 md:mt-6 rounded-lg md:rounded-full font-[Lato] text-[#EBD199] text-[10px] md:text-[18px]">
          Join a family
        </button>
      </div>
    </>
  );
}
