import React, { useState } from 'react';
import { FormEvent } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../firebaseConfig/firebaseConfig';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import './loginForm.css';
import { Button } from '../../button/button';
import { SearchBar } from '../../searchBar/SearchBar';
import logo from '../../../assets/logo-login.svg';
import SVGSpotlight from '../../SVGSpotlight/SVGSpotlight';

interface LocationState {
  message?: string;
}

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const location = useLocation();
  const state = location.state as LocationState;
  const message = state?.message;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Usuario autenticado');
      navigate('/');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError('Error al iniciar sesión: ' + err.message);
      } else {
        setError('Ocurrió un error desconocido');
      }
    }
  };

  return (
    <div className='login-page'>
      <div className='login-form-container'>
        <form className='login-form' onSubmit={handleSubmit}>
          <img className='login-logo__img' src={logo} alt='logo' />
          {error && <p className='error-message'>{error}</p>}
          {message && <p className='success-message'>{message}</p>}
          <div className='input-login-container'>
            <SearchBar
              id='email'
              type='email'
              name='email'
              value={email}
              onSearch={setEmail}
              placeholder='Email'
              required
              className='input-login'
            />

            <SearchBar
              id='password'
              type='password'
              name='password'
              value={password}
              onSearch={setPassword}
              placeholder='Password'
              required
              className='input-login'
            />
          </div>

          <Button className='button-login'>Login</Button>
          <p className='switch-form'>
            Don't have an account?
            <Link to='/register'>Sign up here</Link>
          </p>
        </form>
      </div>
      <SVGSpotlight />
    </div>
  );
};
