import React, { useState } from 'react'; 
import { IonContent, IonIcon, IonImg, IonPage, IonInput, IonItem, IonLabel, IonButton } from '@ionic/react'; // Importar componentes necesarios
import { logoGoogle } from 'ionicons/icons'; // Importar iconos necesarios
import { useHistory } from 'react-router-dom'; // Ruteo
import { supabase } from '../conectarse/supabaseClient';
import './Login.css'; // Importar CSS

// Definir tipos para el estado
const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const history = useHistory();

  const handleLogin = async (): Promise<void> => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', email)
        .eq('password', password);
      
      if (data && data.length > 0) {
        history.push('/recientes'); // Redirigir si las credenciales son correctas
      } else {
        console.log('Credenciales incorrectas');
      }
  
      if (error) {
        console.error('Error al verificar credenciales:', error);
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  };

  const handleRegistrarme = (): void => {
    history.push('/registrarme'); // Redirige a la página "Registrarme"
  };

  return (
    <IonPage className='login no-header'>
      <IonContent className="login">
        <IonImg className='imaglogin' src="/src/img/logo.png" />
        <IonLabel className='pad' color="secondary"><h2>Inicia Sesión</h2></IonLabel>
        <IonLabel>Ingresa tu correo y contraseña para iniciar sesión</IonLabel>
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
        <IonLabel onClick={handleRegistrarme} color="secondary">
          <h3>Registrarme</h3>
        </IonLabel>
      </IonContent>
    </IonPage>
  );
};

export default Login;
