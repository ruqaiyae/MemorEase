import { UserProvider } from './Components/UserManagement/UserContext';
import { FamNameProvider } from './Components/FamilyManagement/FamNameContext';
import { Route, Routes } from 'react-router-dom';
import { Layout } from './Components/Layout/Layout';
import { LandingPage } from './Pages/LandingPage';
import { About } from './Pages/About';
import { AuthPage } from './Pages/AuthPage';
import { Dashboard } from './Pages/Dashboard';
import { ComingSoon } from './Pages/ComingSoon';
import './index.css';
import { FamilyForm } from './Components/FamilyManagement/FamilyForm';
import { CreateFamily } from './Components/FamilyManagement/CreateFamily';

export default function App() {
  return (
    <>
      <UserProvider>
        <FamNameProvider>
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
              <Route
                path="family/:familyId/dashboard"
                element={<Dashboard />}
              />
              <Route path="*" element={<ComingSoon />} />
            </Route>
          </Routes>
        </FamNameProvider>
      </UserProvider>
    </>
  );
}

// EBD199 light
// 654A2F dark
