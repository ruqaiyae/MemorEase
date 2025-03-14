import { Route, Routes } from 'react-router-dom';
import { Layout } from './Components/Layout/Layout';
import { LandingPage } from './Pages/LandingPages';
import { ComingSoon } from './Pages/ComingSoon';
import { AuthPage } from './Pages/AuthPage';
import './index.css';

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="/sign-up" element={<AuthPage mode="sign-up" />} />
          <Route path="/sign-in" element={<AuthPage mode="sign-in" />} />
          <Route path="*" element={<ComingSoon />} />
        </Route>
      </Routes>
    </>
  );
}

// EBD199 light
// 654A2F dark
