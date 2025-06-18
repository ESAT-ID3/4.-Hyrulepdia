import { useState, FormEvent, FC } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './registerForm.css';
import { Button } from '../../button/button';
import { useAuth } from '../../../context/authContext';
import { SearchBar } from '../../searchBar/SearchBar';
import logo from '../../../assets/logo-login.svg';
import SVGSpotlight from '../../SVGSpotlight/SVGSpotlight';

export const RegisterForm: FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await signup(email, password);
      console.log(
        'Cuenta creada con éxito. La información del perfil se completará más tarde.'
      );
      navigate('/profile', {
        state: {
          message: 'Cuenta creada con éxito. Por favor, completa tu perfil.',
        },
      });
    } catch (err: any) {
      setError('Error al crear la cuenta: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='register-form-container'>
      <form className='register-form' onSubmit={handleSubmit}>
        <img src={logo} alt='logo' />
        <div className='register-input-content'>
          <div className=''>
            <SearchBar
              id='email'
              type='email'
              value={email}
              onSearch={setEmail}
              required
              placeholder='Email'
              className='register-input'
            />
          </div>

          <div>
            <SearchBar
              id='password'
              type='password'
              value={password}
              onSearch={setPassword}
              required
              placeholder='Password'
              className='register-input'
            />
          </div>

          <div>
            <SearchBar
              id='confirmPassword'
              type='password'
              value={confirmPassword}
              onSearch={setConfirmPassword}
              required
              placeholder='Confirm password'
              className='register-input'
            />
          </div>
        </div>

        {error && <p className='error-message'>{error}</p>}

        <Button
          className='button-register'
          type='submit'
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </Button>
        <p className='switch-form'>
          Already have an account?
          <Link to='/login'>Go back to login</Link>
        </p>
      </form>
      <SVGSpotlight />
    </div>
  );
};
