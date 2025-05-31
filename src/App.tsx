import './App.css'
import { Header } from './components/header/header'
import { Outlet } from 'react-router-dom'

export const App = () => {
  return (
    <>
      <Header/>
      <Outlet />
    </>
  )
};


