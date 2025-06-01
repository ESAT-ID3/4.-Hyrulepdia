import { useAuth } from '../../../context/authContext';
import { updateEmail, updatePassword, updateProfile } from 'firebase/auth';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../../firebaseConfig/firebaseConfig';
import { useEffect, useState } from 'react';
//import './UserProfileEditor.module.css';
import styles from './UserProfileEditor.module.css';
import { Button } from '../../button/button';

export const UserProfileEditor = () => {
  const { user } = useAuth();

  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [oneLiner, setOneLiner] = useState('');
  const [gems, setGems] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showSensitive, setShowSensitive] = useState(false);

  useEffect(() => {
    if (!user) return;

    setDisplayName(user.displayName || '');
    setPhotoURL(user.photoURL || '');
    setEmail(user.email || '');

    const fetchProfileData = async () => {
      const docRef = doc(db, 'users', user.uid);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        setOneLiner(data.oneLiner || '');
        setGems(data.gems || 0);

        // prioriza al de Firestore
        setPhotoURL(data.photoURL || user.photoURL || '');
      } else {
        // Si no hay doc en Firestore, usa solo el de Firebase Auth
        setPhotoURL(user.photoURL || '');
      }
    };

    fetchProfileData();
  }, [user]);

  const handleSave = async () => {
    if (!user || !auth.currentUser) return;

    try {
      await updateProfile(auth.currentUser, { displayName, photoURL });

      if (email && email !== user.email) {
        await updateEmail(auth.currentUser, email);
      }

      if (password) {
        await updatePassword(auth.currentUser, password);
      }

      await updateDoc(doc(db, 'users', user.uid), {
        oneLiner,
        gems,
        photoURL,
      });

      setMessage('✅ Cambios guardados correctamente');
      setPassword('');
    } catch (err: any) {
      setMessage(`❌ Error: ${err.message}`);
    }
  };

  return (
    <div className={styles.containerProfile}>
      {message && <p>{message}</p>}

      <label className={styles.clickableImg}>
        <img
          src={photoURL === "''" ? 'src/assets/black 1.png' : photoURL}
          alt='Foto de perfil'
        />
        <input
          type='file'
          accept='image/*'
          style={{ display: 'none' }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const url = URL.createObjectURL(file);
              setPhotoURL(url);
            }
          }}
        />
      </label>

      <div className={styles.inputTextCardName}>
        {/*<!-- Líneas verticales partidas laterales -->*/}
        <div className={styles.leftTopLine}></div>
        <div className={styles.leftBottomLine}></div>
        <div className={styles.rightTopLine}></div>
        <div className={styles.rightBottomLine}></div>

        {/*<-- Líneas horizontales partidas -->*/}
        <div className={styles.topLeftLine}></div>
        <div className={styles.topRightLine}></div>
        <div className={styles.bottomLeftLine}></div>
        <div className={styles.bottomRightLine}></div>
        <input
          className={styles.inputText}
          placeholder='NAME'
          type='text'
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
      </div>

      <div className={styles.inputTextCardOneLiner}>
        {/*<!-- Líneas verticales partidas laterales -->*/}
        <div className={styles.leftTopLine}></div>
        <div className={styles.leftBottomLine}></div>
        <div className={styles.rightTopLine}></div>
        <div className={styles.rightBottomLine}></div>

        {/*<-- Líneas horizontales partidas -->*/}
        <div className={styles.topLeftLine}></div>
        <div className={styles.topRightLine}></div>
        <div className={styles.bottomLeftLine}></div>
        <div className={styles.bottomRightLine}></div>
        <input
          className={styles.inputText}
          placeholder='ONE LINER'
          type='text'
          value={oneLiner}
          onChange={(e) => setOneLiner(e.target.value)}
        />
      </div>

      <Button
        color='primary'
        size='sm'
        onClick={() => setShowSensitive((prev) => !prev)}
      >
        {showSensitive ? 'Ocultar' : 'Editar'}
      </Button>

      {showSensitive && (
        <>
          <div className={styles.inputTextCardOneLiner}>
            {/*<!-- Líneas verticales partidas laterales -->*/}
            <div className={styles.leftTopLine}></div>
            <div className={styles.leftBottomLine}></div>
            <div className={styles.rightTopLine}></div>
            <div className={styles.rightBottomLine}></div>

            {/*<-- Líneas horizontales partidas -->*/}
            <div className={styles.topLeftLine}></div>
            <div className={styles.topRightLine}></div>
            <div className={styles.bottomLeftLine}></div>
            <div className={styles.bottomRightLine}></div>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className={styles.inputTextCardOneLiner}>
            {/*<!-- Líneas verticales partidas laterales -->*/}
            <div className={styles.leftTopLine}></div>
            <div className={styles.leftBottomLine}></div>
            <div className={styles.rightTopLine}></div>
            <div className={styles.rightBottomLine}></div>

            {/*<-- Líneas horizontales partidas -->*/}
            <div className={styles.topLeftLine}></div>
            <div className={styles.topRightLine}></div>
            <div className={styles.bottomLeftLine}></div>
            <div className={styles.bottomRightLine}></div>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </>
      )}

      <Button color='primary' size='sm' onClick={handleSave}>
        Guardar
      </Button>
    </div>
  );
};
