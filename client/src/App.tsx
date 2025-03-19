import { UserProvider } from './Components/UserManagement/UserContext';
import { FamilyProvider } from './Components/FamilyManagement/FamilyContext';
import { Route, Routes } from 'react-router-dom';
import { Layout } from './Components/Layout/Layout';
import { LandingPage } from './Pages/LandingPage';
import { About } from './Pages/About';
import { AuthPage } from './Pages/User/AuthPage';
import { FamilyForm } from './Pages/Family/FamilyForm';
import { CreateFamily } from './Pages/Family/CreateFamily';
import { JoinFamily } from './Pages/Family/JoinFamily';
import { Dashboard } from './Pages/Dashboard';
import { ComingSoon } from './Pages/ComingSoon';
import { ImageForm } from './Components/DataManagement/ImageForm';
import './index.css';
import { ImageMemories } from './Pages/Memories/ImageMemories';

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
                path="family/:familyId/dashboard/images"
                element={<ImageMemories />}
              />
              <Route
                path="family/:familyId/dashboard/image-uploads"
                element={<ImageForm />}
              />
              <Route path="*" element={<ComingSoon />} />
            </Route>
          </Routes>
        </FamilyProvider>
      </UserProvider>
    </>
  );
}
