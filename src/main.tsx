import { createRoot } from 'react-dom/client';
import './index.css';
import { App } from './App.tsx';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { CollectionPage } from './views/collection/CollectionPage.tsx';
import { PorfilePage } from './views/ProfilePage.tsx';
import { ShopPage } from './views/StorePage/ShopPage.tsx';
import { ShopPurchase } from './views/StorePage/ShopPurchase.tsx';
import { ShopOpening } from './views/StorePage/ShopOpening.tsx';
import { HomePage } from './views/HomePage.tsx';
import { AuthProvider } from './context/authContext.tsx';
import { LoginForm } from './components/firebase/login/LoginForm.tsx';
import { RegisterForm } from './components/firebase/register/registerForm.tsx';
import { PrivateRoute } from './components/firebase/privateRoute/privateRoute.tsx';
import { DecksPage } from './views/collection/DecksPage.tsx';
import { LibraryPage } from './views/collection/LibraryPage.tsx';
import { LandingPage } from './views/LandingPage/LandingPage.tsx';

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path='/landing' element={<LandingPage />} />
        <Route path='/register' element={<RegisterForm />} />
        <Route path='/login' element={<LoginForm />} />

        <Route path='/' element={<App />}>
          <Route
            index
            element={
              <PrivateRoute>
                <HomePage />
              </PrivateRoute>
            }
          />
          <Route
            path='collection'
            element={
              <PrivateRoute>
                <CollectionPage />
              </PrivateRoute>
            }
          >
            <Route path='decks' element={<DecksPage />} />
            <Route path='library' element={<LibraryPage />} />
          </Route>
          <Route
            path='profile'
            element={
              <PrivateRoute>
                <PorfilePage />
              </PrivateRoute>
            }
          />
          <Route
            path='shop'
            element={
              <PrivateRoute>
                <ShopPage />
              </PrivateRoute>
            }
          />

          {/*Nuevas rutas para la tienda */}
          <Route
            path='purchase'
            element={
              <PrivateRoute>
                <ShopPurchase />
              </PrivateRoute>
            }
          />
          <Route
            path='opening'
            element={
              <PrivateRoute>
                <ShopOpening />
              </PrivateRoute>
            }
          />
        </Route>
        <Route path='*' element={<Navigate to='/login' />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);
