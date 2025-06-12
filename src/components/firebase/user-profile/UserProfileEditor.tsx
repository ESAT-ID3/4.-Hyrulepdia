import { useAuth } from '../../../context/authContext';
import {
  updateEmail,
  updatePassword,
  updateProfile,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../../firebaseConfig/firebaseConfig';
import { useEffect, useState } from 'react';
import styles from './UserProfileEditor.module.css';
import { Button } from '../../button/button';
import imageCompression from 'browser-image-compression';
import { toast } from 'react-toastify';

export const UserProfileEditor = () => {
  const { user } = useAuth();

  const [currentPassword, setCurrentPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [oneLiner, setOneLiner] = useState('');
  const [gems, setGems] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSensitive, setShowSensitive] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);

  useEffect(() => {
    if (!user) return;

    setDisplayName(user.displayName || '');
    setEmail(user.email || '');

    const fetchProfileData = async () => {
      const docRef = doc(db, 'users', user.uid);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        setOneLiner(data.oneLiner || '');
        setGems(data.gems || 0);
        setPhotoURL(data.photoURL || '');
      } else {
        setPhotoURL('');
      }
    };

    fetchProfileData();
  }, [user]);

  const transformFileToDataUrl = (file: File): Promise<string | null> => {
    const imageAllowedTypes = ['image/webp', 'image/jpeg', 'image/png'];

    if (!imageAllowedTypes.includes(file.type)) {
      toast.error('Solo se permiten imágenes en formato WEBP, JPEG o PNG.');
      return Promise.resolve(null);
    }

    if (file.size > 550 * 1024) {
      toast.error(
        'La imagen no debe exceder los 550 KB después de la compresión.'
      );
      return Promise.resolve(null);
    }

    return new Promise((resolve) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        resolve(reader.result as string);
      };

      reader.onerror = () => {
        console.error('Error al leer el archivo con FileReader.');
        toast.error(
          'Ocurrió un error al cargar la imagen. Inténtalo de nuevo.'
        );
        resolve(null);
      };

      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const imageFile = event.target.files?.[0];
    if (!imageFile) return;

    setLoadingImage(true);

    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(imageFile, options);
      const dataUrl = await transformFileToDataUrl(compressedFile);

      if (dataUrl) {
        setPhotoURL(dataUrl);
        toast.success(
          '✅ Imagen lista para guardar. ¡No olvides hacer clic en "Guardar"!'
        );
      } else {
        toast.error('❌ No se pudo procesar la imagen.');
      }
    } catch (error: any) {
      console.error('Error al procesar la imagen:', error);
      toast.error(
        `❌ Error al subir la imagen: ${error.message || 'Intenta de nuevo.'}`
      );
    } finally {
      setLoadingImage(false);
    }
  };

  const handleSave = async () => {
    if (!user || !auth.currentUser) {
      toast.error('❌ No hay usuario autenticado.');
      return;
    }

    try {
      await updateProfile(auth.currentUser, { displayName });

      if (email && email !== user.email) {
        await updateEmail(auth.currentUser, email);
      }

      if (password) {
        if (!currentPassword) {
          toast.error('❌ Debes ingresar tu contraseña actual para cambiarla.');
          return;
        }

        const credential = EmailAuthProvider.credential(
          user.email!,
          currentPassword
        );
        await reauthenticateWithCredential(auth.currentUser, credential);
        await updatePassword(auth.currentUser, password);
      }

      await updateDoc(doc(db, 'users', user.uid), {
        oneLiner,
        gems,
        photoURL,
      });

      toast.success('✅ Cambios guardados correctamente');
      setPassword('');
      setCurrentPassword('');
    } catch (err: any) {
      console.error('Error al guardar el perfil:', err);
      if (err.code === 'auth/requires-recent-login') {
        toast.error(
          '❌ Por favor, vuelve a iniciar sesión para actualizar tu email o contraseña.'
        );
      } else {
        toast.error(`❌ Error al guardar: ${err.message}`);
      }
    }
  };

  return (
    <div className={styles.containerProfile}>
      <label className={styles.clickableImg}>
        <img src={photoURL || 'src/assets/black 1.png'} alt='Foto de perfil' />
        <input
          type='file'
          accept='image/webp, image/jpeg, image/png'
          style={{ display: 'none' }}
          onChange={handleImageUpload}
          disabled={loadingImage}
        />
        {loadingImage && <p>Cargando imagen...</p>}
      </label>

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
              className={styles.inputText}
              placeholder='Correo electrónico'
            />
          </div>

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
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Contraseña nueva'
              className={styles.inputText}
            />
          </div>

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
              type='password'
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder='Contraseña actual'
              className={styles.inputText}
            />
          </div>
        </>
      )}

      <Button
        color='primary'
        size='sm'
        onClick={handleSave}
        disabled={loadingImage}
      >
        Guardar
      </Button>
    </div>
  );
};
