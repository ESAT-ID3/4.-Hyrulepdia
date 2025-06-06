import { ToastContainer } from 'react-toastify';
import './App.css'
import { Header } from './components/header/header'
import { Outlet } from 'react-router-dom'

export const App = () => {
  return (
    <>
      <Header/>
      {/* <HyruleCard />
      <StoreOpening /> */}
      <Outlet />
      <ToastContainer position="top-center" autoClose={3000} />
      {/* la linea de arriba es el componente montado para el toast */}
    </>
  )
};


