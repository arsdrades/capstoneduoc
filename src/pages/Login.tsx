import React, { useState } from 'react'; 
import { IonContent, IonIcon, IonImg, IonPage, IonInput, IonItem, IonLabel, IonButton } from '@ionic/react'; // Importar componentes necesarios
import { logoGoogle } from 'ionicons/icons'; // Importar iconos necesarios
import { useHistory } from 'react-router-dom'; // Ruteo
import { loginUser } from '../CAPA DATOS/supabaseClient'; 
import { useUser } from '../CAPA DATOS/userContext'
import './Login.css'; // Importar CSS

// Definir tipos para el estado
const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { setUser } = useUser();
  const history = useHistory();


  const handleLogin = async () => {
    try {
      console.log('Iniciando sesión con:', email, password);
      const user = await loginUser(email, password);

      if (!user) {

        setErrorMessage('Credenciales incorrectas o error en el sistema. Por favor intenta nuevamente.');
        return;
      }

      if (user.password === password) {
        console.log('Login exitoso:', user);
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

  const handleTipoUsuario = (): void => {
    history.push('/tipo-usuario'); // Redirige a la página "Registrarme"
  };
  

  return (
    <IonPage className='login no-header'>
      <IonContent className="login">
        <IonImg className='imaglogin' src="/src/img/logo.png" />
        <IonLabel className='pad' color="secondary"><h2>Inicia Sesión</h2></IonLabel>
        <IonLabel color="light">Ingresa tu correo y contraseña</IonLabel>
        <IonItem className='pad'>
          <IonLabel color="secondary" position="stacked">Correo</IonLabel>
          <IonInput 
            color="light" 
            value={email} 
            onIonInput={(e) => setEmail(e.detail.value!)} 
            type="email"
            style={{ color: 'white' }} // Cambiar el color del texto a blanco
          />
        </IonItem>
        <IonItem className='pad'>
          <IonLabel color="secondary" position="stacked">Contraseña</IonLabel>
          <IonInput
            value={password}
            onIonInput={(e) => setPassword(e.detail.value!)}
            type="password"
            style={{ color: 'white' }}  // Cambiar el color del texto a blanco
          />
        </IonItem>
        <IonButton className='boton' color="secondary" onClick={handleLogin}>Iniciar Sesión</IonButton>
        <IonLabel color="light"> o continúa con</IonLabel>
        <IonButton className='boton' color="light" onClick={handleLogin}>
          <IonIcon aria-hidden="true" icon={logoGoogle} slot="start" />
          Google
        </IonButton>
        <IonLabel color="light">¿Aún no tienes tu cuenta?</IonLabel>
        <IonLabel onClick={handleTipoUsuario} color="secondary">
          <h3>Registrarme</h3>
        </IonLabel>
      </IonContent>
    </IonPage>
  );
};

export default Login;
