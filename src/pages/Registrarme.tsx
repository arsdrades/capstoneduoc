import React, { useState } from 'react'; 
import { IonContent, IonIcon, IonImg, IonPage, IonInput, IonItem, IonLabel, IonButton } from '@ionic/react'; 
import { useHistory } from 'react-router-dom';
import { supabase } from '../CAPA DATOS/supabaseClient'; 
import './Registrarme.css';

// Definir la interfaz para los usuarios
interface Usuario {
  email: string;
  password: string;
  numero: string;
  nombre: string; // Agregar nombre
  apellido: string; // Agregar apellido
}

const Registrarme: React.FC = () => {
  const [email, setEmail] = useState<string>('');  
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [numero, setNumero] = useState<string>(''); 
  const [nombre, setNombre] = useState<string>(''); // Nuevo estado para nombre
  const [apellido, setApellido] = useState<string>(''); // Nuevo estado para apellido
  const history = useHistory();

  // Función de registro con validaciones
  const handleRegister = async () => {
    if (password !== confirmPassword) {
      console.log('Las contraseñas no coinciden');
      return;
    }

    try {
      // Insertar el usuario en la tabla 'usuarios' de Supabase
      const { data, error } = await supabase
        .from<Usuario>('usuarios') 
        .insert([{ email, password, numero, nombre, apellido }]); // Incluir nombre y apellido

      if (error) {
        console.error('Error al registrar:', error);
      } else {
        console.log('Usuario registrado con éxito:', data);
        history.push('/login');  // Redirige a la página de login después de registrarse
      }
    } catch (error) {
      console.error('Error al registrar:', error);
    }
  };

  return (
    <IonPage className='login no-header'>
      <IonContent className="login">
        <IonImg className='imaglogin' src="/src/img/logo.png" />
        <IonLabel className='pad' color="light"><h2>Crea tu cuenta</h2></IonLabel>

        <IonItem className='pad'>
          <IonLabel color="secondary" position="stacked">Ingresa tu nombre:</IonLabel>
          <IonInput
            color="light"
            value={nombre}
            onIonInput={(e) => setNombre(e.detail.value as string)} 
            type="text"
            style={{ color: 'white' }} 
          />
        </IonItem>

        <IonItem className='pad'>
          <IonLabel color="secondary" position="stacked">Ingresa tu apellido:</IonLabel>
          <IonInput
            color="light"
            value={apellido}
            onIonInput={(e) => setApellido(e.detail.value as string)} 
            type="text"
            style={{ color: 'white' }} 
          />
        </IonItem>

        <IonItem className='pad'>
          <IonLabel color="secondary" position="stacked">Ingresa tu correo:</IonLabel>
          <IonInput
            color="light"
            value={email}
            onIonInput={(e) => setEmail(e.detail.value as string)} 
            type="email"
            style={{ color: 'white' }} 
          />
        </IonItem>

        <IonItem className='pad'>
          <IonLabel color="secondary" position="stacked">Ingresa tu número telefónico:</IonLabel>
          <IonInput
            color="light"
            value={numero}
            onIonInput={(e) => setNumero(e.detail.value as string)} 
            type="text" // Cambiado a 'text' para permitir caracteres
            style={{ color: 'white' }} 
          />
        </IonItem>

        <IonItem className='pad'>
          <IonLabel color="secondary" position="stacked">Crea tu contraseña:</IonLabel>
          <IonInput
            value={password}
            onIonInput={(e) => setPassword(e.detail.value as string)}
            type="password"
            style={{ color: 'white' }} 
          />
        </IonItem>

        <IonItem className='pad'>
          <IonLabel color="secondary" position="stacked">Confirma tu contraseña:</IonLabel>
          <IonInput
            value={confirmPassword}
            onIonInput={(e) => setConfirmPassword(e.detail.value as string)}
            type="password"
            style={{ color: 'white' }} 
          />
        </IonItem>      

        <IonButton className='boton' color="secondary" onClick={handleRegister}>Registrarme</IonButton>
        <IonButton className='boton' color="light" onClick={() => history.push('/login')}>
          INICIAR SESIÓN
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Registrarme;
