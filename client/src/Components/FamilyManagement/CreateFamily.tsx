import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { readToken, createFamily } from '../../Lib/data';
import { FormInput } from '../UserManagement/FormInput';
import { PasswordInput } from '../UserManagement/PasswordInput';

export function CreateFamily() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setIsLoading(true);
      const formData = new FormData(event.currentTarget);
      const familyData = Object.fromEntries(formData);
      const req = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${readToken()}`,
        },
        body: JSON.stringify(familyData),
      };
      const { familyId } = await createFamily(req);
      console.log(familyId);
      navigate(`/family/${familyId}/dashboard`);
    } catch (err) {
      alert(`Error signing in: ${err}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="border-[1.5px] md:border-2 border-[#654A2F] rounded-lg mx-auto my-8 md:mb-15 w-[80%]">
      <form onSubmit={handleSubmit}>
        <div className="flex justify-center">
          <div className="mt-8 md:mt-12 mr-8 md:mr-30 text-end text-[#654A2F]">
            <FormInput labelName={'Family Name:'} name={'familyName'} />
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
  );
}
