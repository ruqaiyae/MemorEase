import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createFamily, CreateFamilyData, joinFamily } from '../../Lib/data';
import { FormInput } from '../../Components/UserManagement/FormInput';
import { PasswordInput } from '../../Components/UserManagement/PasswordInput';
import { useFamily } from '../../Components/FamilyManagement/useFamily';
import { errorMsg } from '../../Components/Toast/errorToast';

export function CreateFamily() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { updateFamily, addFamily } = useFamily();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setIsLoading(true);
      const formData = new FormData(event.currentTarget);
      const familyData = Object.fromEntries(formData) as CreateFamilyData;
      const { familyId } = await createFamily(familyData);
      const { familyName, password } = familyData;
      await joinFamily({ familyId, password });
      navigate(`/family/${familyId}/dashboard`);
      window.scrollTo(0, 0);
      const family = { familyId, familyName };
      updateFamily(family);
      addFamily(family);
    } catch (err) {
      errorMsg('Failed to create family. Please refresh and try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <h1 className="font-[fondamento] text-[#654A2F] text-center text-[16px] md:text-[30px] mt-15 md:mt-18 mx-7 md:mx-70">
        Turn fleeting moments into lasting memories — create your family vault.
      </h1>
      <div className="border-[1.5px] md:border-2 border-[#654A2F] rounded-lg mx-auto mt-8 md:mt-15 mb-15 md:mb-30 w-[80%] md:w-[60%]">
        <div className="w=80%">
          <form onSubmit={handleSubmit}>
            <div className="flex justify-center">
              <div className="mt-8 md:mt-10 mr-8 md:mr-5 text-end text-[#654A2F]">
                <FormInput labelName={'Family Name:'} name={'familyName'} />
                <PasswordInput labelName={'Password:'} />
              </div>
            </div>
            <div className="text-center ">
              <button
                disabled={isLoading}
                className="btn bg-[#654A2F] px-4 md:px-7 py-[5px] md:py-3 my-6 md:mt-6 rounded-lg md:rounded-full font-[Lato] text-[#EBD199] text-[10px] md:text-[18px] cursor-pointer">
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
