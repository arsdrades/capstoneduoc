import React, { useState } from 'react';
import { IonContent, IonIcon, IonImg, IonPage, IonInput, IonItem, IonLabel, IonButton } from '@ionic/react';
import { logoGoogle } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import './Login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleLogin = () => {
    if (email === 'ariel' && password === 'ariel') {
      history.push('/tab2');
    } else {
      console.log('Login attempt', { email, password });
      // Aquí podrías añadir lógica para manejar credenciales incorrectas
    }
  };

  return (
    <IonPage className='login no-header'>
      <IonContent className="login">
        <IonImg className='imaglogin' src="/src/img/boltletra.png" />
        <h5>Inicia Sesión</h5>
        <p>Ingresa tu correo y contraseña para iniciar sesión</p>
        <IonItem>
          <IonLabel color="light" position="stacked">Correo</IonLabel>
          <IonInput color="light" 
            value={email} 
            onIonInput={(e) => setEmail(e.detail.value!)} 
            type="email"
            style={{ color: 'white' }} 
          />
        </IonItem>
        <IonItem>
          <IonLabel color="light" position="stacked">Contraseña</IonLabel>
          <IonInput
  value={password}
  onIonInput={(e) => setPassword(e.detail.value!)}
  type="password"
  style={{ color: 'white' }}  // Esto cambiará el color del texto a blanco
/>
        </IonItem>
        <IonButton className='boton' color="secondary" onClick={handleLogin}>Iniciar Sesión</IonButton>
        <IonLabel color="light" className='continuar'> o continua con</IonLabel>
        <IonButton className='boton' color="light" onClick={handleLogin}>
          <IonIcon aria-hidden="true" icon={logoGoogle} slot="start" />
          Google
        </IonButton>
        <p>¿Aún no tienes tu cuenta?</p>
        <h5>Registrarme</h5>
      </IonContent>
    </IonPage>
  );
};

export default Login;