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
import { ImageForm, StoryForm } from './Index/FormIndex';
import { ImageMemories, StoryMemories } from './Index/MemoriesIndex';
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
                path="family/:familyId/dashboard/story-uploads"
                element={<StoryForm />}
              />
              <Route
                path="family/:familyId/dashboard/stories"
                element={<StoryMemories />}
              />
              <Route path="*" element={<ComingSoon />} />
            </Route>
          </Routes>
        </FamilyProvider>
      </UserProvider>
    </>
  );
}
