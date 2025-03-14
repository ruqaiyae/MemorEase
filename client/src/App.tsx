import { Route, Routes } from 'react-router-dom';
import { Layout } from './Components/Layout/Layout';
import { LandingPage } from './Pages/LandingPages';
import { ComingSoon } from './Pages/ComingSoon';
import { AuthPage } from './Pages/AuthPage';
import './index.css';
import { UserProvider } from './Components/UserManagement/UserContext';

export default function App() {
  return (
    <>
      <UserProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<LandingPage />} />
            <Route path="/sign-up" element={<AuthPage mode="sign-up" />} />
            <Route path="/sign-in" element={<AuthPage mode="sign-in" />} />
            <Route path="*" element={<ComingSoon />} />
          </Route>
        </Routes>
      </UserProvider>
    </>
  );
}

// EBD199 light
// 654A2F dark
