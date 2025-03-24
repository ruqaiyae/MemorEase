import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { readRecipe, type Recipe } from '../../Lib/data';
import { toast } from 'react-toastify';
import { Msg } from '../../Components/Toast';
import { useFamily } from '../../Components/FamilyManagement/useFamily';
import { MemoryContainer } from '../../Components/DataManagement/MemoryContainer';
import { Container } from '../../Components/Layout/Container';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';

export function Recipe() {
  const [recipe, setRecipe] = useState<Recipe>();
  const [isLoading, setIsLoading] = useState(true);
  const { recipeId } = useParams();
  const { currentFamily } = useFamily();

  function errorMsg() {
    toast(<Msg message="Error loading recipe. Please try again." />);
  }

  useEffect(() => {
    async function loadRecipe(recipeId: number) {
      try {
        const res = await readRecipe(currentFamily?.familyId, recipeId);
        setRecipe(res);
      } catch (err) {
        errorMsg();
      } finally {
        setIsLoading(false);
      }
    }
    if (recipeId) {
      setIsLoading(true);
      loadRecipe(+recipeId);
    }
  }, [currentFamily?.familyId, recipeId]);

  const labelStyle =
    'mb-1 block font-[Lato] text-[#654A2F] text-[10px] md:text-[25px] ml-2';

  return (
    <MemoryContainer
      text="This recipe carries the flavors of our family's legacy"
      isLoading={isLoading}>
      <Container mobileWidth="60%" width="70%">
        <div className="w-[100%] text-right">
          <Link
            to={`/family/${currentFamily?.familyId}/dashboard/recipes/${recipeId}/edit`}>
            <FontAwesomeIcon
              icon={faPenToSquare}
              className="text-[#654A2F] text-[12px] md:text-[25px] md:pt-5 pr-2 md:pr-5"
            />
          </Link>
        </div>
        <div className="flex flex-wrap md:flex-nowrap content-start mt-3 md:mt-12 md:mb-4 md:w-[100%]">
          <div className="md:w-[70%]">
            <h2 className="mb-1 block font-[Fondamento] text-[#654A2F] text-[15px] md:text-[35px] mx-3 md:ml-10 md:mb-5">
              {recipe?.dishName}
            </h2>
          </div>
          <div className="w-[100%] md:w-[40%] flex">
            <div className="w-[50%] md:w-[30%]"></div>
            <div className="w-[50%] md:w-[70%]">
              <div className="flex items-center justify-start md:my-2 md:mr-8">
                <img src="/chef.png" className="w-4 md:w-10" />
                <p className={labelStyle}>{recipe?.creator}</p>
              </div>
              <div className="flex items-center justify-start md:my-2 md:mr-8">
                <img src="/salad.png" className="w-4 md:w-10" />
                <p className={labelStyle}>{recipe?.category}</p>
              </div>
              <div className="flex items-center justify-start md:my-2 md:mr-8">
                <img src="/clock.png" className="w-4 md:w-10" />
                <p className="font-[Lato] text-[#654A2F] text-[10px] md:text-[25px] ml-2">
                  {recipe?.cookingTime}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center mb-5">
          <div className="md:w-[40%] md:px-5 md:pt-2 mb-1 md:my-[10px] md:mx-auto mt-3">
            <p className={labelStyle}>Ingredients from the Heart</p>
            <ul
              className="block border md:border-2 border-[#654A2F]
            rounded md:rounded-md focus:border-2 md:focus:border-3
            focus:outline-none md:py-3 pr-4 md:mt-3">
              {recipe?.ingredients.split(',').map((ingredient, index) => (
                <li
                  key={index}
                  className="font-[Lato] text-[#654A2F] text-[10px] md:text-[22px] md:text-[18px] list-disc my-1 md:my-2 ml-4 md:ml-8 md:pl-1">
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>

          <div className="w-[90%] md:w-[60%] md:px-5 md:pt-2 mb-1 md:my-[10px] md:mx-auto mt-3">
            <p className={labelStyle}>Steps to Perfection</p>
            <ul
              className="block border md:border-2 border-[#654A2F]
            rounded md:rounded-md focus:border-2 md:focus:border-3
            focus:outline-none py-1 md:py-3 pr-4 mt-1 md:mt-3">
              {recipe?.directions.split('.').map((direction, index) => (
                <li
                  key={index}
                  className="font-[Lato] text-[#654A2F] text-[10px] md:text-[22px] md:text-[18px] list-decimal my-1 md:my-2 ml-4 md:ml-8 md:pl-1">
                  {direction}.
                </li>
              ))}
            </ul>
          </div>

          <div className="w-[90%] md:w-[100%] md:px-5 md:pt-2 mb-1 md:my-[10px] md:mx-auto mt-3">
            <p className={labelStyle}>A Story to Remember</p>
            <p
              className="font-[Lato] text-[#654A2F] text-[10px] md:text-[22px] border md:border-2 border-[#654A2F]
            rounded md:rounded-md focus:border-2 md:focus:border-3
            focus:outline-none leading-[1.6] md:leading-[2] px-3 py-1 md:p-5 md:mx-auto">
              {recipe?.backstory}
            </p>
          </div>

          <div className="w-[90%] md:w-[100%] md:px-5 md:pt-2 md:mx-auto mt-3 md:mb-9">
            <p className={labelStyle}>Secret Touches & Notes</p>
            <p
              className="font-[Lato] text-[#654A2F] text-[10px] md:text-[22px] border md:border-2 border-[#654A2F]
            rounded md:rounded-md focus:border-2 md:focus:border-3
            focus:outline-none leading-[1.6] md:leading-[2] px-3 py-1 md:p-5 md:mx-auto">
              {recipe?.notes}
            </p>
          </div>
        </div>
      </Container>
    </MemoryContainer>
  );
}
