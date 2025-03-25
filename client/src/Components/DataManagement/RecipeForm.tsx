import { type FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  type Recipe,
  readRecipe,
  uploadRecipe,
  updateRecipe,
  deleteRecipe,
} from '../../Lib/data';
import { toast } from 'react-toastify';
import { Msg } from '../../Components/Toast';
import { Container } from '../Layout/Container';

export function RecipeForm() {
  const [recipe, setRecipe] = useState<Recipe>();
  const [isLoading, setIsLoading] = useState(false);
  const { familyId, recipeId } = useParams();
  const navigate = useNavigate();
  const isEditing = recipeId && recipeId !== '';

  function errorMsg(editing: string) {
    editing && toast(<Msg message="Error editing recipe" />);
    !editing && toast(<Msg message="Error uploading recipe" />);
  }

  useEffect(() => {
    async function load(id: number) {
      setIsLoading(true);
      try {
        if (familyId && recipeId) {
          const recipe = await readRecipe(+familyId, +recipeId);
          if (!recipe) throw new Error(`Recipe with ID ${id} not found`);
          setRecipe(recipe);
        }
      } catch (err) {
        errorMsg('editing error');
      } finally {
        setIsLoading(false);
      }
    }
    if (isEditing) load(+recipeId);
  }, [recipeId, familyId, isEditing]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setIsLoading(true);
      const formData = new FormData(event.currentTarget);
      const recipeData = Object.fromEntries(formData) as Partial<Recipe>;
      if (isEditing) {
        updateRecipe(recipeData, Number(familyId), Number(recipeId));
      } else {
        await uploadRecipe(recipeData, Number(familyId));
      }
      navigate(`/family/${familyId}/dashboard/recipes`);
    } catch (err) {
      errorMsg('');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete() {
    if (!recipe?.recipeId) throw new Error('Should never happen');
    try {
      await deleteRecipe(Number(familyId), recipe.recipeId);
      navigate(`/family/${familyId}/dashboard/recipes`);
    } catch (err) {
      errorMsg('Error deleting recipe. Please try again.');
    }
  }

  const labelStyle =
    'mb-1 block font-[Lato] text-[#654A2F] text-[10px] md:text-[20px] ml-2 text-center';

  return (
    <>
      <h1 className="font-[fondamento] font-bold text-[#654A2F] text-[15px] md:text-[40px] text-center my-3 md:my-10">
        Food is a memory you can taste.
      </h1>
      <Container mobileWidth="80%" width="90%">
        <h2 className="font-[fondamento] text-[#654A2F] text-[15px] md:text-[30px] text-center my-3 md:my-10">
          Write it down, pass it on.
        </h2>
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className=" flex flex-wrap mt-6 md:mt-12 md:mb-4 w-[90%] md:w-[100%]">
            <div className="w-[50%]">
              <div>
                <label className={labelStyle}>
                  Name of the dish:
                  <input
                    required
                    name="dishName"
                    defaultValue={recipe?.dishName ?? ''}
                    placeholder="A recipe worth remembering is called…"
                    className="w-[100%] md:w-[90%] md:h-10 border md:border-2 border-[#654A2F] rounded md:rounded-md focus:border-2 md:focus:border-3 focus:outline-none p-1 md:p-2 mb-1 md:my-[10px] text-[8px] md:text-[16px]"
                  />
                </label>
                <label className={labelStyle}>
                  Passed down by:
                  <input
                    required
                    name="creator"
                    defaultValue={recipe?.creator ?? ''}
                    placeholder="Who shared this recipe with you?"
                    className="w-[100%] md:w-[90%] md:h-10 border md:border-2 border-[#654A2F] rounded md:rounded-md focus:border-2 md:focus:border-3 focus:outline-none p-1 md:p-2 mb-1 md:my-[10px] text-[8px] md:text-[16px]"
                  />
                </label>
              </div>
            </div>
            <div className="w-[50%]">
              <label className={labelStyle}>
                Best Enjoyed As:
                <select
                  name="category"
                  required
                  className="w-[100%] md:w-[83%] md:h-10 border md:border-2 border-[#654A2F] rounded md:rounded-md focus:border-2 md:focus:border-3 focus:outline-none p-1 mb-1 md:my-[10px] text-[10px] md:text-[16px]">
                  <option value="">--Please choose one--</option>
                  <option value="Morning Delight">Morning Delight</option>
                  <option value="Midday Meal">Midday Meal</option>
                  <option value="Tea-Time Classic">Tea-Time Classic</option>
                  <option value="Evening Indulgence">Evening Indulgence</option>
                  <option value="Late-Night Craving">Late-Night Craving</option>
                  <option value="Sweet Treat">Sweet Treat</option>
                  <option value="Festive Favorite">Festive Favorite</option>
                  <option value="Everyday Comfort">Everyday Comfort</option>
                </select>
              </label>
              <label className={labelStyle}>
                Time Required:
                <input
                  required
                  name="cookingTime"
                  defaultValue={recipe?.cookingTime ?? ''}
                  placeholder="Time taken for the magic to happen"
                  className="w-[100%] md:w-[83%] md:h-10 border md:border-2 border-[#654A2F] rounded md:rounded-md focus:border-2 md:focus:border-3 focus:outline-none p-1 md:p-2 mb-1 md:my-[10px] text-[8px] md:text-[16px] text-left"
                />
              </label>
            </div>
            <div className="w-[50%] mt-3">
              <label className={labelStyle}>
                Ingredients from the Heart:
                <textarea
                  cols={30}
                  autoFocus
                  name="ingredients"
                  defaultValue={recipe?.ingredients ?? ''}
                  placeholder="List each treasured ingredient, just like it was passed down.
                  (With a comma in between)"
                  className="block w-[90%] h-65 md:h-70 md:h-30 border md:border-2 border-[#654A2F]
            rounded md:rounded-md focus:border-2 md:focus:border-3
            focus:outline-none md:px-5 md:pt-2 mt-[5px] mb-1 md:my-[10px] md:mx-auto text-[16px] whitespace-pre-line"
                />
              </label>
            </div>
            <div className="w-[50%] mt-3">
              <label className={labelStyle}>
                Steps to Perfection:
                <textarea
                  cols={30}
                  autoFocus
                  name="directions"
                  defaultValue={recipe?.directions ?? ''}
                  placeholder="Guide the next generation, one step at a time.
                  (End each step with a full stop.)"
                  className="block w-[90%] h-65 md:h-70 md:h-30 border md:border-2 border-[#654A2F]
            rounded md:rounded-md focus:border-2 md:focus:border-3
            focus:outline-none md:px-5 md:pt-2 mt-[5px] mb-1 md:my-[10px] md:mx-auto text-[16px] whitespace-pre-line"
                />
              </label>
            </div>
            <div className="w-[100%] mt-3">
              <label className={labelStyle}>
                A Story to Remember:
                <textarea
                  cols={30}
                  autoFocus
                  name="backstory"
                  defaultValue={recipe?.backstory ?? ''}
                  placeholder="The memory behind this dish - a cherished moment, a family tradition, or a story worth telling."
                  className="block w-[90%] h-65 md:h-70 md:h-30 border md:border-2 border-[#654A2F]
            rounded md:rounded-md focus:border-2 md:focus:border-3
            focus:outline-none md:px-5 md:pt-2 mt-[5px] mb-1 md:my-[10px] md:mx-auto text-[16px] whitespace-pre-line"
                />
              </label>
            </div>
            <div className="w-[100%] mt-3">
              <label className={labelStyle}>
                Secret Touches & Notes:
                <textarea
                  cols={30}
                  autoFocus
                  name="notes"
                  defaultValue={recipe?.notes ?? ''}
                  placeholder="Any special tips, family secrets, or personal twists?"
                  className="block w-[90%] h-65 md:h-70 md:h-30 border md:border-2 border-[#654A2F]
            rounded md:rounded-md focus:border-2 md:focus:border-3
            focus:outline-none md:px-5 md:pt-2 mt-[5px] mb-1 md:my-[10px] md:mx-auto text-[16px] whitespace-pre-line"
                />
              </label>
            </div>
            {isEditing ? (
              <div className="flex justify-between md:w-[90%] mx-auto">
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="btn bg-[#654A2F] px-2 md:px-7 py-[3px] md:py-3 md:mt-6 mb-10 md:mb-15 rounded-lg md:rounded-full font-[Lato] text-[#EBD199] text-[8px] md:text-[18px] cursor-pointer">
                  Delete
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn bg-[#654A2F] px-2 md:px-7 py-[3px] md:py-3 md:mt-6 mb-10 md:mb-15 rounded-lg md:rounded-full font-[Lato] text-[#EBD199] text-[8px] md:text-[18px] cursor-pointer">
                  Save
                </button>
              </div>
            ) : (
              <div className="w-[100%] mt-3 flex justify-center">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn bg-[#654A2F] px-2 md:px-7 py-[3px] md:py-3 md:mt-6 mb-10 md:mb-15 rounded-lg md:rounded-full font-[Lato] text-[#EBD199] text-[8px] md:text-[18px] cursor-pointer">
                  Add to the Family Cookbook
                </button>
              </div>
            )}
          </div>
        </form>
      </Container>
    </>
  );
}
