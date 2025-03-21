import { type FormEvent, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { labelClass } from '../UserManagement/FormInput';
import { FormContainer } from './FormContainer';
import { Story, uploadStory } from '../../Lib/data';
import { toast } from 'react-toastify';
import { Msg } from '../../Components/Toast';
import { useUser } from '../UserManagement/useUser';

export function StoryForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { familyId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();

  function errorMsg() {
    toast(<Msg message="Error uploading story" />);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setIsLoading(true);
      const formData = new FormData(event.currentTarget);
      const storyData = Object.fromEntries(formData) as Partial<Story>;
      storyData.author = `${user?.firstName} ${user?.lastName}`;
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
        <label className={labelClass}>
          Title:
          <input
            required
            name={'title'}
            type={'text'}
            className="border md:border-2 focus:border-2 md:focus:border-3 focus:outline-none border-[#654A2F] rounded md:rounded-md  md:p-2 md:h-10 w-[75%] md:w-[83%] mb-3 md:mb-6 md:my-[10px] ml-2"
          />
        </label>
        <label className={labelClass}>
          Write a Story to Remember
          <textarea
            cols={30}
            autoFocus
            id="content"
            name="content"
            className="block border md:border-2 focus:border-2 md:focus:border-3 focus:outline-none border-[#654A2F] rounded md:rounded-md h-65 md:h-70  md:p-2 md:h-8 w-[90%] mt-[5px] mb-4 md:my-[10px] mx-auto md:h-30"
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
