import React, { useState } from 'react';
import { IonContent, IonIcon, IonImg, IonPage, IonLabel, IonButton } from '@ionic/react';
import { personOutline, carOutline } from 'ionicons/icons'; 
import { useHistory } from 'react-router-dom';
import { loginUser } from '../CAPA DATOS/supabaseClient';
import { useUser } from '../CAPA DATOS/userContext';
import './TipoUsuario.css';

const TipoUsuario: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { setUser } = useUser();
  const history = useHistory();

  const handleLogin = async () => {
    try {
      const user = await loginUser(email, password);
      if (!user) {
        setErrorMessage('Credenciales incorrectas o error en el sistema. Por favor intenta nuevamente.');
        return;
      }
      if (user.password === password) {
        setUser(user);
        history.push('/inicio');
      } else {
        setErrorMessage('Credenciales incorrectas. Verifica tu correo y contraseña.');
      }
    } catch (error: any) {
      console.error('Error en el inicio de sesión:', error.message);
      setErrorMessage('Error en el sistema. Por favor intenta nuevamente.');
    }
  };

  const handleRegistrarme = (): void => {
    history.push('/registrarme');
  };

  const handleRegistroConductor = (): void => {
    history.push('/registro-conductor');
  };

  return (
    <IonPage className='login no-header'>
      <IonContent className="login">
        <div className="top-section">
          <IonImg className='imagelogo' src="/src/img/logo.png" />
        </div>
        <IonLabel className='title' color="secondary">
            <h2>Registrarme</h2>
          </IonLabel>
        <div className="middle-section">

          <IonLabel color="light">¿Qué tipo de cuenta quieres crear?</IonLabel>
        </div>

        <div className="bottom-section">
          <IonButton expand="block" className='big-button' color="secondary" onClick={handleRegistrarme}>
            Cliente
            <IonIcon icon={personOutline} slot="end" />
          </IonButton>
          
          <IonButton expand="block" className='big-button' color="secondary" onClick={handleRegistroConductor}>
            Conductor
            <IonIcon icon={carOutline} slot="end" />
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default TipoUsuario;
