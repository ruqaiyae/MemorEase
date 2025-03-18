import { Outlet } from 'react-router-dom';
import { NavBar } from '../NavBar/NavBar';
import { Footer } from '../Footer/Footer';
import { ToastContainer } from 'react-toastify';

export function Layout() {
  return (
    <>
      <ToastContainer />

      <NavBar />
      <Outlet />
      <Footer />
    </>
  );
}
