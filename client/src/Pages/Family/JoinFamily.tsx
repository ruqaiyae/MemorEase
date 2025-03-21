import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { joinFamily, JoinFamilyData } from '../../Lib/data';
import { FormInput } from '../../Components/UserManagement/FormInput';
import { PasswordInput } from '../../Components/UserManagement/PasswordInput';
import { useFamily } from '../../Components/FamilyManagement/useFamily';
import { toast } from 'react-toastify';
import { Msg } from '../../Components/Toast';

export function JoinFamily() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { updateFamily, addFamily } = useFamily();

  function errorMsg() {
    toast(<Msg message="Invalid family id or password. Please try again." />);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setIsLoading(true);
      const formData = new FormData(event.currentTarget);
      const familyData = Object.fromEntries(formData) as JoinFamilyData;
      const familyId = Number(familyData.familyId);

      const families = await joinFamily(familyData);

      let familyName = '';
      let i = 0;
      while (i < families.length) {
        if (families[i].familyId === familyId) {
          familyName = families[i].familyName;
        }
        i++;
      }

      const family = { familyId, familyName };
      addFamily(family);
      updateFamily(family);
      navigate(`/family/${family.familyId}/dashboard`);
    } catch (err) {
      errorMsg();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <h1 className="font-[fondamento] text-[#654A2F] text-center text-[16px] md:text-[30px] mt-15 md:mt-18 mx-7 md:mx-70">
        Families are built with love, memories, and togetherness. Join yours
        now.
      </h1>
      <div className="border-[1.5px] md:border-2 border-[#654A2F] rounded-lg mx-auto mt-8 md:mt-15 mb-15 md:mb-30 w-[80%] md:w-[60%]">
        <div className="w=80%">
          <form onSubmit={handleSubmit}>
            <div className="flex justify-center">
              <div className="mt-8 md:mt-10 mr-8 md:mr-5 text-end text-[#654A2F]">
                <FormInput labelName={'Family ID:'} name={'familyId'} />
                <PasswordInput labelName={'Password:'} />
              </div>
            </div>
            <div className="text-center ">
              <button
                disabled={isLoading}
                className="btn bg-[#654A2F] px-4 md:px-7 py-[5px] md:py-3 my-6 md:mt-6 rounded-lg md:rounded-full font-[Lato] text-[#EBD199] text-[10px] md:text-[18px] cursor-pointer">
                Join
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
