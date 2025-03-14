import { Route, Routes } from 'react-router-dom';
import { Layout } from './Components/Layout/Layout';
import { LandingPage } from './Pages/LandingPages';
import { ComingSoon } from './Pages/ComingSoon';

import './index.css';

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="*" element={<ComingSoon />} />
        </Route>
      </Routes>
    </>
  );
}

// EBD199 light
// 654A2F dark
