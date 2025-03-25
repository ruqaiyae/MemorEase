import { Route, Routes } from 'react-router-dom';
import { Layout } from './Components/Layout/Layout';
import { LandingPage } from './Pages/LandingPage';
import { About } from './Pages/About';
import { ComingSoon } from './Pages/ComingSoon';
import { AuthPage, UserProvider } from './Index/UserIndex';
import {
  FamilyProvider,
  FamilyForm,
  CreateFamily,
  JoinFamily,
} from './Index/FamilyIndex';
import { Dashboard } from './Pages/Dashboard';
import { ImageForm, RecipeForm, StoryForm, VideoForm } from './Index/FormIndex';
import {
  ImageMemories,
  Image,
  RecipeMemories,
  Recipe,
  StoryMemories,
  Story,
  VideoMemories,
  Video,
} from './Index/MemoriesIndex';
import './index.css';

export default function App() {
  return (
    <>
      <UserProvider>
        <FamilyProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<LandingPage />} />
              <Route path="about-us" element={<About />} />
              <Route path="/sign-in" element={<AuthPage mode="sign-in" />} />
              <Route path="/sign-up" element={<AuthPage mode="sign-up" />} />
              <Route path="family-form" element={<FamilyForm />} />
              <Route
                path="family-form/create-family"
                element={<CreateFamily />}
              />
              <Route path="family-form/join-family" element={<JoinFamily />} />
              <Route
                path="family/:familyId/dashboard"
                element={<Dashboard />}
              />
              <Route
                path="family/:familyId/dashboard/image-uploads"
                element={<ImageForm />}
              />
              <Route
                path="family/:familyId/dashboard/images"
                element={<ImageMemories />}
              />
              <Route
                path="family/:familyId/dashboard/images/:imageId"
                element={<Image />}
              />
              <Route
                path="family/:familyId/dashboard/images/:imageId/edit"
                element={<ImageForm />}
              />
              <Route
                path="family/:familyId/dashboard/recipe-uploads"
                element={<RecipeForm />}
              />
              <Route
                path="family/:familyId/dashboard/recipes"
                element={<RecipeMemories />}
              />
              <Route
                path="family/:familyId/dashboard/recipes/:recipeId"
                element={<Recipe />}
              />
              <Route
                path="family/:familyId/dashboard/recipes/:recipeId/edit"
                element={<RecipeForm />}
              />
              <Route
                path="family/:familyId/dashboard/story-uploads"
                element={<StoryForm />}
              />
              <Route
                path="family/:familyId/dashboard/stories"
                element={<StoryMemories />}
              />
              <Route
                path="family/:familyId/dashboard/stories/:storyId"
                element={<Story />}
              />
              <Route
                path="family/:familyId/dashboard/stories/:storyId/edit"
                element={<StoryForm />}
              />
              <Route
                path="family/:familyId/dashboard/video-uploads"
                element={<VideoForm />}
              />
              <Route
                path="family/:familyId/dashboard/videos"
                element={<VideoMemories />}
              />
              <Route
                path="family/:familyId/dashboard/videos/:videoId"
                element={<Video />}
              />
              <Route
                path="family/:familyId/dashboard/videos/:videoId/edit"
                element={<VideoForm />}
              />
              <Route path="*" element={<ComingSoon />} />
            </Route>
          </Routes>
        </FamilyProvider>
      </UserProvider>
    </>
  );
}
