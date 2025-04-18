import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { readRecipe, type Recipe } from '../../Lib/data';
import { MemoryContainer } from '../../Components/DataManagement/MemoryContainer';
import { Container } from '../../Components/Layout/Container';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { errorMsg } from '../../Components/Toast/errorToast';
import { useUser } from '../../Components/UserManagement/useUser';

export function Recipe() {
  const [recipe, setRecipe] = useState<Recipe>();
  const [isLoading, setIsLoading] = useState(false);
  const [ownerId, setOwnerId] = useState<number>();
  const { familyId, recipeId } = useParams();
  const { user } = useUser();

  useEffect(() => {
    async function loadRecipe(familyId: number, recipeId: number) {
      try {
        setIsLoading(true);
        const recipe = await readRecipe(familyId, recipeId);
        setRecipe(recipe);
        setOwnerId(recipe.userId);
      } catch (err) {
        errorMsg('Error loading recipe. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
    if (recipeId) {
      setIsLoading(true);
      loadRecipe(Number(familyId), +recipeId);
    }
  }, [familyId, recipeId]);

  const labelStyle =
    'mb-1 block font-lato text-[#654A2F] text-[10px] md:text-[25px] text-center md:ml-2';

  const paragraphs = recipe?.backstory
    .split(/\n\s*\n/)
    .map((para) => para.trim());

  return (
    <MemoryContainer
      marginLeft="20px"
      marginRight="20px"
      text="This recipe carries the flavors of our family's legacy"
      isLoading={isLoading}>
      <Container mobileWidth="70%" width="70%">
        <div className="w-[100%] text-right">
          {user?.userId === ownerId ? (
            <Link to={`/family/${familyId}/dashboard/recipes/${recipeId}/edit`}>
              <FontAwesomeIcon
                icon={faPenToSquare}
                className="text-[#654A2F] text-[12px] md:text-[25px] md:pt-5 pr-2 md:pr-5 cursor-pointer"
              />
            </Link>
          ) : null}
        </div>
        <div className="flex flex-wrap md:flex-nowrap content-start mt-3 md:mt-12 md:mb-4 md:w-[100%]">
          <div className="md:w-[300%]">
            <h2 className="mb-1 block font-fondamento text-[#654A2F] text-[15px] md:text-[35px] mx-3 md:ml-10 md:mb-5">
              {recipe?.dishName}
            </h2>
          </div>
          <div className="flex justify-between items-center md:block w-full mx-2">
            <div className="flex items-center gap-x-1 md:my-3">
              <img src="/chef.png" className="w-4 md:w-10" />
              <p className="font-lato text-[#654A2F] text-[10px] md:text-[25px]">
                Grandma Rose
              </p>
            </div>

            <div className="flex items-center gap-x-1 md:my-3">
              <img src="/salad.png" className="w-4 md:w-10" />
              <p className="font-lato text-[#654A2F] text-[10px] md:text-[25px]">
                Sweet Treat
              </p>
            </div>

            <div className="flex items-center gap-x-1 md:my-3">
              <img src="/clock.png" className="w-4 md:w-10" />
              <p className="font-lato text-[#654A2F] text-[10px] md:text-[25px]">
                27 mins
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center mb-5">
          <div className="w-[90%] md:w-[50%] md:px-5 md:pt-2 mb-1 md:my-[10px] md:mx-auto mt-3">
            <p className={labelStyle}>Ingredients from the Heart</p>
            <ul
              className="block border md:border-2 border-[#654A2F]
            rounded md:rounded-md focus:border-2 md:focus:border-3
            focus:outline-none md:py-3 pr-4 md:mt-3">
              {recipe?.ingredients.split(',').map((ingredient, index) => (
                <li
                  key={index}
                  className="font-lato text-[#654A2F] text-[10px] md:text-[22px] md:text-[18px] list-disc my-1 md:my-2 ml-4 md:ml-8 md:pl-1">
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>

          <div className="w-[90%] md:w-[50%] md:px-5 md:pt-2 mb-1 md:my-[10px] md:mx-auto mt-3">
            <p className={labelStyle}>Steps to Perfection</p>
            <ul
              className="block border md:border-2 border-[#654A2F]
            rounded md:rounded-md focus:border-2 md:focus:border-3
            focus:outline-none py-1 md:py-3 pr-4 mt-1 md:mt-3">
              {recipe?.directions.split('.').map((direction, index) => (
                <li
                  key={index}
                  className="font-lato text-[#654A2F] text-[10px] md:text-[22px] md:text-[18px] list-decimal my-1 md:my-2 ml-4 md:ml-8 md:pl-1">
                  {direction}.
                </li>
              ))}
            </ul>
          </div>

          <div className="w-[90%] md:w-[100%] md:px-5 md:pt-2 mb-1 md:my-[10px] md:mx-auto mt-3">
            <p className={labelStyle}>A Story to Remember</p>
            <p
              className="font-lato text-[#654A2F] text-[10px] md:text-[22px] border md:border-2 border-[#654A2F]
            rounded md:rounded-md focus:border-2 md:focus:border-3
            focus:outline-none leading-[1.6] md:leading-[2] px-3 py-1 md:p-5 md:mx-auto">
              {paragraphs?.map((para, index) => (
                <p
                  key={index}
                  style={{ textIndent: '2em', marginBottom: '1em' }}>
                  {para}
                </p>
              ))}
            </p>
          </div>
          <div className="w-[90%] md:w-[100%] md:px-5 md:pt-2 md:mx-auto mt-3 md:mb-9">
            <p className={labelStyle}>Secret Touches & Notes</p>
            <ul
              className="block border md:border-2 border-[#654A2F]
            rounded md:rounded-md focus:border-2 md:focus:border-3
            focus:outline-none py-1 md:py-3 pr-4 mt-1 md:mt-3">
              {recipe?.notes.split('.').map((note, index) => (
                <li
                  key={index}
                  className="font-lato text-[#654A2F] text-[10px] md:text-[22px] md:text-[18px] list-disc my-1 md:my-2 ml-4 md:ml-8 md:pl-1">
                  {note}.
                </li>
              ))}
            </ul>
            {/* <p
              className="font-lato text-[#654A2F] text-[10px] md:text-[22px] border md:border-2 border-[#654A2F]
            rounded md:rounded-md focus:border-2 md:focus:border-3
            focus:outline-none leading-[1.6] md:leading-[2] px-3 py-1 md:p-5 md:mx-auto">
              {recipe?.notes}
            </p> */}
          </div>
        </div>
      </Container>
    </MemoryContainer>
  );
}
