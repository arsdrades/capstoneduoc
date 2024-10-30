import React, { useState } from 'react';
import { IonContent, IonImg, IonPage, IonInput, IonItem, IonLabel, IonButton, IonSelect, IonSelectOption } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { supabase } from '../CAPA DATOS/supabaseClient';
import './Registrarme.css';

const RegistroConductor: React.FC = () => {
  const [step, setStep] = useState(1);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [numeroTelefono, setNumeroTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [modeloAuto, setModeloAuto] = useState('');
  const [patente, setPatente] = useState('');
  const [color, setColor] = useState('');
  const [tipoVehiculo, setTipoVehiculo] = useState('');
  const [fotoLicencia, setFotoLicencia] = useState<File | null>(null);
  const [fotoAntecedentes, setFotoAntecedentes] = useState<File | null>(null);
  const [fotoPermisoCirculacion, setFotoPermisoCirculacion] = useState<File | null>(null);
  const history = useHistory();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setFile: React.Dispatch<React.SetStateAction<File | null>>) => {
    const file = e.target.files?.[0] || null;
    setFile(file);
  };

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      console.log('Las contraseñas no coinciden');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('usuarios')
        .insert([{
          nombre,
          apellido,
          email,
          numeroTelefono,
          password,
          modeloAuto,
          patente,
          color,
          tipoVehiculo
        }]);

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
        <IonLabel className='pad' color="light"><h2>Crea tu cuenta de conductor</h2></IonLabel>

        {step === 1 && (
          <>
            <IonItem className='pad'>
              <IonLabel color="secondary" position="stacked">Ingresa tu nombre:</IonLabel>
              <IonInput color="light" value={nombre} onIonInput={(e) => setNombre(e.detail.value as string)} type="text" style={{ color: 'white' }} />
            </IonItem>
            <IonItem className='pad'>
              <IonLabel color="secondary" position="stacked">Ingresa tu apellido:</IonLabel>
              <IonInput color="light" value={apellido} onIonInput={(e) => setApellido(e.detail.value as string)} type="text" style={{ color: 'white' }} />
            </IonItem>
            <IonItem className='pad'>
              <IonLabel color="secondary" position="stacked">Ingresa tu correo:</IonLabel>
              <IonInput color="light" value={email} onIonInput={(e) => setEmail(e.detail.value as string)} type="email" style={{ color: 'white' }} />
            </IonItem>
            <IonItem className='pad'>
              <IonLabel color="secondary" position="stacked">Ingresa tu número telefónico:</IonLabel>
              <IonInput color="light" value={numeroTelefono} onIonInput={(e) => setNumeroTelefono(e.detail.value as string)} type="tel" style={{ color: 'white' }} />
            </IonItem>
            <IonItem className='pad'>
              <IonLabel color="secondary" position="stacked">Crea tu contraseña:</IonLabel>
              <IonInput color="light" value={password} onIonInput={(e) => setPassword(e.detail.value as string)} type="password" style={{ color: 'white' }} />
            </IonItem>
            <IonItem className='pad'>
              <IonLabel color="secondary" position="stacked">Confirma tu contraseña:</IonLabel>
              <IonInput color="light" value={confirmPassword} onIonInput={(e) => setConfirmPassword(e.detail.value as string)} type="password" style={{ color: 'white' }} />
            </IonItem>
            <IonButton className='boton' color="secondary" onClick={() => setStep(2)}>Siguiente: Información del Auto</IonButton>
          </>
        )}

        {step === 2 && (
          <>
            <IonItem className='pad'>
              <IonLabel color="secondary" position="stacked">Modelo del Automóvil:</IonLabel>
              <IonInput color="light" value={modeloAuto} onIonInput={(e) => setModeloAuto(e.detail.value as string)} type="text" style={{ color: 'white' }} />
            </IonItem>
            <IonItem className='pad'>
              <IonLabel color="secondary" position="stacked">Patente:</IonLabel>
              <IonInput color="light" value={patente} onIonInput={(e) => setPatente(e.detail.value as string)} type="text" style={{ color: 'white' }} />
            </IonItem>
            <IonItem className='pad'>
              <IonLabel color="secondary" position="stacked">Color:</IonLabel>
              <IonInput color="light" value={color} onIonInput={(e) => setColor(e.detail.value as string)} type="text" style={{ color: 'white' }} />
            </IonItem>
            <IonItem className='pad'>
              <IonLabel color="secondary" position="stacked">Tipo de Vehículo:</IonLabel>
              <IonSelect value={tipoVehiculo} onIonChange={(e) => setTipoVehiculo(e.detail.value as string)}>
                <IonSelectOption value="camion">Camión</IonSelectOption>
                <IonSelectOption value="furgoneta">Furgoneta</IonSelectOption>
                <IonSelectOption value="camioneta">Camioneta</IonSelectOption>
              </IonSelect>
            </IonItem>
            <IonItem className='pad'>
              <IonLabel color="secondary" position="stacked">Foto de la Licencia de Conducir:</IonLabel>
              <input type="file" onChange={(e) => handleFileChange(e, setFotoLicencia)} />
            </IonItem>
            <IonItem className='pad'>
              <IonLabel color="secondary" position="stacked">Foto de los Antecedentes:</IonLabel>
              <input type="file" onChange={(e) => handleFileChange(e, setFotoAntecedentes)} />
            </IonItem>
            <IonItem className='pad'>
              <IonLabel color="secondary" position="stacked">Permiso de Circulación:</IonLabel>
              <input type="file" onChange={(e) => handleFileChange(e, setFotoPermisoCirculacion)} />
            </IonItem>
            <IonButton className='boton' color="secondary" onClick={handleRegister}>Registrarme</IonButton>
            <IonButton className='boton' color="light" onClick={() => setStep(1)}>Volver a Información Personal</IonButton>
          </>
        )}
        
        <IonButton className='boton' color="light" onClick={() => history.push('/login')}>Iniciar sesión</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default RegistroConductor;
