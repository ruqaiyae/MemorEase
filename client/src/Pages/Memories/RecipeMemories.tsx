import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  type Recipe,
  readRecipes,
  readRecipeLike,
  type LikeMemory,
  likeMemory,
  dislikeMemory,
} from '../../Lib/data';
import { MemoriesContainer } from '../../Components/DataManagement/MemoriesContainer';
import { errorMsg } from '../../Components/Toast/errorToast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';

export function RecipeMemories() {
  const { familyId } = useParams();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function load(familyId: number) {
      try {
        setIsLoading(true);
        const response = await readRecipes(familyId);
        const likedRecipes = await readRecipeLike(familyId);

        if (response && likedRecipes) {
          const likedRecipeIds = new Set(
            likedRecipes.map((recipe) => recipe.recipeId)
          );

          const updatedRecipes = response.map((recipe) => ({
            ...recipe,
            isLiked: likedRecipeIds.has(recipe.recipeId),
          }));

          setRecipes(updatedRecipes);
        }
      } catch (err) {
        errorMsg('Error loading recipes. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
    load(Number(familyId));
  }, [familyId]);

  async function handleLike(recipe: LikeMemory) {
    const temp = [...recipes];

    for (let i = 0; i < temp.length; i++) {
      if (temp[i].recipeId === recipe.recipeId) {
        temp[i].isLiked = !temp[i]?.isLiked;
        setRecipes(temp);
        if (temp[i].isLiked) {
          likeMemory(Number(familyId), 'recipe', Number(recipe.recipeId));
        } else {
          dislikeMemory(Number(familyId), 'recipe', Number(recipe.recipeId));
        }
      }
    }
  }

  return (
    <>
      <MemoriesContainer
        header1="Savor the flavors of the "
        header2=" family - where every recipe is a taste of our heritage and a story passed down through generations."
        loading={isLoading}
        content={recipes}
        memoryType="recipe"
        path="recipe-uploads">
        {recipes?.length !== 0 && (
          <div className="mb-10">
            <ul className="flex flex-wrap text-[#654A2F] text-[10px] md:text-[25px] md:my-10">
              {recipes?.map((recipe) => (
                <div
                  key={recipe.recipeId}
                  className="mx-auto my-3 border-[1.5px] rounded-lg md:border-2 border-[#654A2F] text-center">
                  <li
                    onClick={() =>
                      navigate(
                        `/family/${familyId}/dashboard/recipes/${recipe.recipeId}`
                      )
                    }
                    className="px-5 mt-2 mb-1 md:mt-5 cursor-pointer">
                    {recipe.dishName}
                  </li>
                  <FontAwesomeIcon
                    icon={recipe.isLiked ? faHeartSolid : faHeartRegular}
                    onClick={() => handleLike(recipe)}
                    className={`text-[12px] md:text-[25px] cursor-pointer ${
                      recipe.isLiked ? 'text-[#d51010]' : 'text-[#654A2F]'
                    }`}
                  />
                </div>
              ))}
            </ul>
          </div>
        )}
      </MemoriesContainer>
    </>
  );
}
