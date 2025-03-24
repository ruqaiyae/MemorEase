import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { type Recipe, readRecipes } from '../../Lib/data';
import { useFamily } from '../../Components/FamilyManagement/useFamily';
import { MemoriesContainer } from '../../Components/DataManagement/MemoriesContainer';

export function RecipeMemories() {
  const { currentFamily } = useFamily();
  const [recipes, setRecipes] = useState<Recipe[]>();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const res = await readRecipes(currentFamily?.familyId);
        setRecipes(res);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [currentFamily?.familyId]);

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
                  onClick={() =>
                    navigate(
                      `/family/${currentFamily?.familyId}/dashboard/recipes/${recipe.recipeId}`
                    )
                  }
                  className="mx-auto my-3 border-[1.5px] rounded-lg md:border-2 border-[#654A2F] cursor-pointer">
                  <li className="p-5">{recipe.dishName}</li>
                </div>
              ))}
            </ul>
          </div>
        )}
      </MemoriesContainer>
    </>
  );
}
