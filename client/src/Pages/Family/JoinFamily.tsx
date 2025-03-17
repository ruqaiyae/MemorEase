import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  joinFamily,
  JoinFamilyData,
  requestFamilyDetails,
} from '../../Lib/data';
import { FormInput } from '../../Components/UserManagement/FormInput';
import { PasswordInput } from '../../Components/UserManagement/PasswordInput';
import { useFamName } from '../../Components/FamilyManagement/useFamName';

export function JoinFamily() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { updateName } = useFamName();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setIsLoading(true);
      const formData = new FormData(event.currentTarget);
      const familyData = Object.fromEntries(formData) as JoinFamilyData;
      const { familyId } = await joinFamily(familyData);
      const name = await requestFamilyDetails();
      const familyName = name[0].familyName;
      updateName(familyName);
      navigate(`/family/${familyId}/dashboard`);
    } catch (err) {
      alert(`Error signing in: ${err}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="border-[1.5px] md:border-2 border-[#654A2F] rounded-lg mx-auto mt-8 md:mt-25 mb-15 md:mb-30 w-[80%] md:w-[60%]">
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
              className="btn bg-[#654A2F] px-4 md:px-7 py-[5px] md:py-3 my-6 md:mt-6 rounded-lg md:rounded-full font-[Lato] text-[#EBD199] text-[10px] md:text-[18px]">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
