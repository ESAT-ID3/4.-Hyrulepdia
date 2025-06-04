import { useAuth } from '../../../context/authContext';
import { updateEmail, updatePassword, updateProfile } from 'firebase/auth';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { auth, db, storage } from '../../../firebaseConfig/firebaseConfig';
import { useEffect, useState } from 'react';
import styles from './UserProfileEditor.module.css';
import { Button } from '../../button/button';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { compressImages } from '../../../utils/compressImages';

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
  const [selectedFile, setSelectedFile] = useState(null);

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
        setPhotoURL(data.photoURL || user.photoURL || '');
      } else {
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
    } catch (err) {
      setMessage(`❌ Error: ${err.message}`);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedFile || !user || !auth.currentUser) {
      setMessage('⚠️ Usuario no autenticado o sin imagen seleccionada');
      return;
    }

    try {
      // Comprimir la imagen seleccionada
      const [compressedFile] = await compressImages([selectedFile]);

      // Subir a Firebase
      const imageRef = ref(storage, `profileImages/${user.uid}`);
      await uploadBytes(imageRef, compressedFile);

      // Obtener URL pública
      const url = await getDownloadURL(imageRef);
      setPhotoURL(url); // Mostrar en el frontend

      // Actualizar perfil
      await updateProfile(auth.currentUser, { photoURL: url });
      await updateDoc(doc(db, 'users', user.uid), { photoURL: url });

      setMessage('✅ Imagen comprimida y subida correctamente');
    } catch (error) {
      setMessage(`❌ Error al subir la imagen: ${error.message}`);
    }
  };

  return (
    <div className={styles.containerProfile}>
      {message && <p>{message}</p>}

      <label className={styles.clickableImg}>
        <img src={photoURL || 'src/assets/black 1.png'} alt='Foto de perfil' />
        <input
          type='file'
          accept='image/*'
          style={{ display: 'none' }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setSelectedFile(file);
              const url = URL.createObjectURL(file);
              setPhotoURL(url); // Previsualización
            }
          }}
        />
      </label>
      <Button color='primary' size='sm' onClick={handleImageUpload}>
        Subir imagen
      </Button>

      <div className={styles.inputTextCardName}>
        <div className={styles.leftTopLine}></div>
        <div className={styles.leftBottomLine}></div>
        <div className={styles.rightTopLine}></div>
        <div className={styles.rightBottomLine}></div>
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
        <div className={styles.leftTopLine}></div>
        <div className={styles.leftBottomLine}></div>
        <div className={styles.rightTopLine}></div>
        <div className={styles.rightBottomLine}></div>
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
            <div className={styles.leftTopLine}></div>
            <div className={styles.leftBottomLine}></div>
            <div className={styles.rightTopLine}></div>
            <div className={styles.rightBottomLine}></div>
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
            <div className={styles.leftTopLine}></div>
            <div className={styles.leftBottomLine}></div>
            <div className={styles.rightTopLine}></div>
            <div className={styles.rightBottomLine}></div>
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
