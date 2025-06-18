import { ToastContainer } from 'react-toastify';
import './App.css'
import { Header } from './components/header/header'
import { Outlet } from 'react-router-dom'
import { Footer } from './components/footer/footer';

export const App = () => {
  return (
    <>
      <Header/>
      <Outlet />
      <ToastContainer position="top-center" autoClose={3000} />
      {/* la linea de arriba es el componente montado para el toast */}
      <Footer></Footer>
    </>
  )
};


