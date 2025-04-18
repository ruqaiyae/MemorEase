import { type FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { labelClass } from '../UserManagement/FormInput';
import { FormContainer } from './FormContainer';
import {
  type Story,
  readStory,
  uploadStory,
  updateStory,
  deleteStory,
} from '../../Lib/data';
import { useUser } from '../UserManagement/useUser';
import { errorMsg } from '../Toast/errorToast';

export function StoryForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { familyId, storyId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [story, setStory] = useState<Story>();
  const isEditing = storyId && storyId !== '';

  useEffect(() => {
    async function load(familyId: number, storyId: number) {
      setIsLoading(true);
      try {
        const story = await readStory(familyId, storyId);
        if (!story) throw new Error(`Story with ID ${storyId} not found`);
        setStory(story);
      } catch (err) {
        errorMsg(`Error loading the story. Please try again.`);
      } finally {
        setIsLoading(false);
      }
    }
    if (isEditing && familyId) load(+familyId, +storyId);
  }, [familyId, storyId, isEditing]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setIsLoading(true);
      const formData = new FormData(event.currentTarget);
      const storyData = Object.fromEntries(formData) as Partial<Story>;
      storyData.author = `${user?.firstName} ${user?.lastName}`;
      if (isEditing) {
        await updateStory(storyData, Number(familyId), Number(storyId));
      } else {
        await uploadStory(storyData, Number(familyId));
      }
      navigate(`/family/${familyId}/dashboard/stories`);
    } catch (err) {
      errorMsg('Error uploading story');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete() {
    if (!story?.storyId) throw new Error('Should never happen');
    try {
      await deleteStory(Number(familyId), story.storyId);
      navigate(`/family/${familyId}/dashboard/stories`);
    } catch (err) {
      console.log('err', err);
      errorMsg('Error deleting story. Please try again.');
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
            name="title"
            defaultValue={story?.title ?? ''}
            type="text"
            className="border md:border-2 focus:border-2 md:focus:border-3 focus:outline-none border-[#654A2F] rounded md:rounded-md  md:p-2 md:h-10 w-[75%] md:w-[83%] mb-3 md:mb-6 md:my-[10px] ml-2"
          />
        </label>
        <label className={labelClass}>
          Write a Story to Remember
          <textarea
            cols={30}
            id="content"
            name="content"
            defaultValue={story?.content ?? ''}
            className="block border md:border-2 focus:border-2 md:focus:border-3 focus:outline-none border-[#654A2F] rounded md:rounded-md h-65 md:h-70  md:p-2 md:h-8 w-[90%] mt-[5px] mb-4 md:my-[10px] mx-auto md:h-30"
          />
        </label>
        {isEditing ? (
          <div className="flex justify-between w-[90%] mx-auto">
            <button
              type="button"
              onClick={handleDelete}
              disabled={isLoading}
              className="btn bg-[#654A2F] px-2 md:px-7 py-[3px] md:py-3 md:mt-6 mb-10 md:mb-15 rounded-lg md:rounded-full font-lato text-[#EBD199] text-[8px] md:text-[18px] cursor-pointer">
              Delete
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn bg-[#654A2F] px-2 md:px-7 py-[3px] md:py-3 md:mt-6 mb-10 md:mb-15 rounded-lg md:rounded-full font-lato text-[#EBD199] text-[8px] md:text-[18px] cursor-pointer">
              Save
            </button>
          </div>
        ) : (
          <button
            type="submit"
            disabled={isLoading}
            className="btn bg-[#654A2F] px-2 md:px-7 py-[3px] md:py-3 md:mt-6 mb-10 md:mb-15 rounded-lg md:rounded-full font-lato text-[#EBD199] text-[8px] md:text-[18px] cursor-pointer">
            Add
          </button>
        )}
      </FormContainer>
    </>
  );
}
