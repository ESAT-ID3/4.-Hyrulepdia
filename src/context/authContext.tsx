import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  User,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, setDoc, getFirestore } from 'firebase/firestore';
import { auth, app } from '../firebaseConfig/firebaseConfig';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const db = getFirestore(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (email: string, password: string): Promise<void> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;

      const userDocRef = doc(db, 'users', newUser.uid);
      await setDoc(userDocRef, {
        email: email,
        nombreUsuario: '',
        oneliner: '',
        gems: 10000,
        photoURL: '',
      });
    } catch (error: any) {
      console.error('Error al registrar usuario:', error);
      throw error;
    }
  };

const logout = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const isMobile = window.innerWidth < 749;

    const ToastConfirm = () => (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: isMobile ? 12 : 8,
          fontSize: isMobile ? 14 : 16,
          padding: isMobile ? '12px' : '8px',
          maxWidth: isMobile ? '90vw' : '400px',
        }}
      >
        <p style={{ textAlign: 'center' }}>Are you sure you want to log out?</p>
        <div
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <button
            onClick={async () => {
              toast.dismiss();
              try {
                await signOut(auth);
                setUser(null);
                resolve();
              } catch (error) {
                console.error('Error logging out:', error);
                reject(error);
              }
            }}
            style={{
              padding: '6px 12px',
              cursor: 'pointer',
              backgroundColor: '#d9534f',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              width: isMobile ? '100%' : 'auto',
            }}
          >
            Yes
          </button>
          <button
            onClick={() => {
              toast.dismiss();
              resolve();
            }}
            style={{
              padding: '6px 12px',
              cursor: 'pointer',
              backgroundColor: '#5bc0de',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              width: isMobile ? '100%' : 'auto',
            }}
          >
            No
          </button>
        </div>
      </div>
    );

    toast.info(<ToastConfirm />, {
      autoClose: false,
      closeOnClick: false,
      draggable: false,
    });
  });
};


  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, loading, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
