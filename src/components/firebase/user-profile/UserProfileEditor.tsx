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
import { useEffect, useState, useRef, useCallback } from 'react';
import styles from './UserProfileEditor.module.css'; // Usamos 'styles' que ya está importado
import { Button } from '../../button/button';

export const UserProfileEditor = () => {
  const { user } = useAuth(); // El usuario de tu contexto de autenticación

  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [oneLiner, setOneLiner] = useState('');
  const [gems, setGems] = useState(0);
  const [email, setEmail] = useState(''); // El nuevo correo electrónico
  const [password, setPassword] = useState(''); // La contraseña actual para reautenticar o la nueva contraseña
  const [currentPassword, setCurrentPassword] = useState(''); // Campo para la contraseña actual SIEMPRE que se cambie correo/contraseña
  const [message, setMessage] = useState('');
  const [showSensitive, setShowSensitive] = useState(false); // Para mostrar/ocultar campos de email/password

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // --- 1. Carga inicial de los datos del usuario ---
  useEffect(() => {
    if (!user) return;

    // Sincronizar estados con los datos de Firebase Auth
    setDisplayName(user.displayName || '');
    setPhotoURL(user.photoURL || '');
    setEmail(user.email || '');

    // Cargar datos adicionales de Firestore
    const fetchProfileData = async () => {
      const docRef = doc(db, 'users', user.uid);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        setOneLiner(data.oneLiner || '');
        setGems(data.gems || 0);
        // Asegúrate de que photoURL se actualice si hay uno en Firestore
        setPhotoURL(data.photoURL || user.photoURL || '');
      }
    };

    fetchProfileData();
  }, [user]); // Dependencia del efecto: el objeto user

  // --- 2. Función para guardar los cambios (incluye email y password) ---
  const saveProfile = useCallback(async () => {
    if (!user || !auth.currentUser) {
      setMessage('❌ No hay usuario autenticado.');
      return;
    }

    setMessage('Guardando cambios...'); // Mensaje mientras se guarda

    try {
      // **A. Actualizar datos en Firebase Authentication (displayName, photoURL)**
      // Esto siempre se intenta para campos no sensibles
      await updateProfile(auth.currentUser, {
        displayName,
        photoURL,
      });

      // **B. Reautenticación y actualización de EMAIL/PASSWORD (operaciones sensibles)**
      const emailChanged = email && email !== user.email;
      const passwordChanged = password; // Si el campo de password tiene un valor, se asume que se quiere cambiar

      if (emailChanged || passwordChanged) {
        // La reautenticación es necesaria para operaciones sensibles
        // DEBEMOS OBLIGAR al usuario a poner su contraseña ACTUAL
        if (!currentPassword) {
          throw new Error(
            '⚠️ Debes ingresar tu contraseña actual para cambiar el correo o la contraseña.'
          );
        }

        const credential = EmailAuthProvider.credential(
          user.email!,
          currentPassword
        );
        await reauthenticateWithCredential(auth.currentUser, credential);
        setMessage('Reautenticación exitosa. Guardando cambios sensibles...');
      }

      // **C. Actualizar EMAIL (solo si ha cambiado)**
      if (emailChanged) {
        await updateEmail(auth.currentUser, email);
        setMessage(
          '✅ Correo electrónico actualizado. Es posible que necesites verificarlo.'
        );
      }

      // **D. Actualizar PASSWORD (solo si se ha ingresado una nueva)**
      if (passwordChanged) {
        await updatePassword(auth.currentUser, password);
        setMessage('✅ Contraseña actualizada.');
      }

      // **E. Actualizar datos en Firestore**
      await updateDoc(doc(db, 'users', user.uid), {
        oneLiner,
        gems,
        photoURL, // Guardamos photoURL en Firestore también para consistencia
        // Considera guardar displayName y email en Firestore también si los usas para algo más
        // displayName: displayName,
        // email: email,
      });

      setMessage('✅ Perfil actualizado correctamente.');
      // Limpiar campos sensibles después de un guardado exitoso
      setPassword('');
      setCurrentPassword('');
    } catch (err: any) {
      // Manejo de errores específicos de Firebase Auth
      let errorMessage =
        'Error al guardar cambios. Por favor, inténtalo de nuevo.';
      if (err.code === 'auth/wrong-password') {
        errorMessage = '❌ Contraseña actual incorrecta.';
      } else if (err.code === 'auth/requires-recent-login') {
        errorMessage =
          '❌ Por favor, inicia sesión de nuevo para realizar este cambio.';
      } else if (err.code === 'auth/email-already-in-use') {
        errorMessage = '❌ El correo electrónico ya está en uso.';
      } else {
        errorMessage = `❌ Error: ${err.message}`;
      }
      setMessage(errorMessage);
      console.error('Error al guardar perfil:', err);
    }
  }, [
    displayName,
    photoURL,
    email,
    password,
    oneLiner,
    gems,
    user,
    currentPassword,
  ]);

  // --- 3. Debounce para guardar automáticamente ---
  useEffect(() => {
    // No disparamos el debounce si el usuario no está autenticado o no hay cambios significativos
    if (!user || !auth.currentUser) return;

    // Evitamos el debounce cuando solo estamos mostrando/ocultando campos sensibles
    // o cuando el mensaje está activo por un error/éxito
    if (showSensitive) return; // Si los campos sensibles están visibles, el guardado es manual

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      saveProfile();
    }, 1500); // Guardar después de 1.5 segundos de inactividad
  }, [displayName, photoURL, oneLiner, saveProfile, user, showSensitive]); // Quitamos email y password si el guardado es manual para esos

  // --- 4. Renderizado del componente ---
  return (
    <div className={styles.containerProfile}>
      {message && <p className={styles.message}>{message}</p>}{' '}
      {/* Puedes estilizar este mensaje */}
      {/* Imagen de perfil */}
      <label className={styles.clickableImg}>
        <img src={photoURL} alt='Foto de perfil' />
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
      {/* Nombre */}
      <div className={styles.inputTextCardName}>
        {/* Líneas decorativas */}
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
      {/* One Liner */}
      <div className={styles.inputTextCardOneLiner}>
        {/* Líneas decorativas */}
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
      {/* Botón para mostrar/ocultar campos sensibles */}
      <Button
        color='primary'
        size='sm'
        onClick={() => setShowSensitive((prev) => !prev)}
      >
        {showSensitive
          ? 'OCULTAR CAMBIOS SENSIBLES'
          : 'EDITAR CORREO / CONTRASEÑA'}
      </Button>
      {/* Campos sensibles (Correo y Contraseña) */}
      {showSensitive && (
        <>
          {/* Correo electrónico */}
          <div className={styles.inputTextCardOneLiner}>
            {/* Líneas decorativas */}
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
              name='new-email'
              autoComplete='off'
              placeholder='Nuevo correo electrónico'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Nueva Contraseña (opcional) */}
          <div className={styles.inputTextCardName}>
            {/* Líneas decorativas */}
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
              name='new-user-password'
              autoComplete='new-password'
              placeholder='Nueva contraseña (dejar vacío para no cambiar)'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Contraseña Actual (OBLIGATORIA para cambios sensibles) */}
          <div className={styles.inputTextCardName}>
            {/* Líneas decorativas */}
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
              name='current-user-password'
              autoComplete='current-password'
              placeholder='Contraseña ACTUAL para confirmar cambios'
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
        </>
      )}
      {/* Botón para guardar manualmente */}
      {/* Es importante que este botón llame a saveProfile sin debounce para los cambios sensibles */}
      <Button color='primary' size='sm' onClick={saveProfile}>
        GUARDAR CAMBIOS
      </Button>
    </div>
  );
};
