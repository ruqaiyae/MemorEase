import { type FormEvent, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FormInput, labelClass } from '../UserManagement/FormInput';
import { FormContainer } from './FormContainer';
import { Story, uploadStory } from '../../Lib/data';
import { toast } from 'react-toastify';
import { Msg } from '../../Components/Toast';

export function StoryForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { familyId } = useParams();
  const navigate = useNavigate();

  function errorMsg() {
    toast(<Msg message="Error uploading story" />);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setIsLoading(true);
      const formData = new FormData(event.currentTarget);
      const storyData = Object.fromEntries(formData) as Partial<Story>;
      await uploadStory(storyData, Number(familyId));
      navigate('/family/:familyId/dashboard/stories');
    } catch (err) {
      errorMsg();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <FormContainer
        text="Stories are the threads that weave generations together."
        onSubmit={(e) => handleSubmit(e)}>
        <FormInput labelName={'Username:'} name={'username'} />
        <label className={labelClass}>
          Tell the Story Behind This Photo:
          <textarea
            cols={30}
            autoFocus
            id="caption"
            name="caption"
            className="block border md:border-2 focus:border-2 md:focus:border-3 focus:outline-none border-[#654A2F] rounded md:rounded-md  md:p-2 md:h-8  md:w-[60%] mt-[5px] mb-4 md:my-[10px] mx-auto md:h-30"
          />
        </label>
        <button
          type="submit"
          disabled={isLoading}
          className="btn bg-[#654A2F] px-2 md:px-7 py-[3px] md:py-3 md:mt-6 mb-10 md:mb-15 rounded-lg md:rounded-full font-[Lato] text-[#EBD199] text-[8px] md:text-[18px] cursor-pointer">
          Add
        </button>
      </FormContainer>
    </>
  );
}
