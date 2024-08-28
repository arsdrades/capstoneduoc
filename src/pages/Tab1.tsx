import { IonContent, IonIcon, IonHeader, IonPage, IonTitle, IonToolbar, IonSearchbar, IonItem, IonButton, IonLabel } from '@ionic/react';
import { time } from 'ionicons/icons';
import { useHistory } from 'react-router-dom'; // Importa useHistory
import './Tab1.css';

const Tab1: React.FC = () => {
  const history = useHistory(); // Declara useHistory

  const handleProgramarViaje = () => {
    history.push('/programar-viaje'); // Redirige a la página "Programar Viaje"
  };

  return (
    <IonPage>
    <IonHeader class='principal'>
      <IonToolbar color="primary">
        <IonTitle>Bienvenidos a Bolt</IonTitle>
      </IonToolbar>
    </IonHeader>

      <IonContent fullscreen>
        <IonSearchbar
          animated={true}
          placeholder="¿A dónde vas?"
          className="custom-searchbar"
        ></IonSearchbar>

        <IonItem className='lista1'>
          <IonIcon aria-hidden="true" icon={time} color='primary' slot="start"></IonIcon>
          <IonLabel>
            <h2>Socoroma 204</h2>
            <p>San Joaquín, Región Metropolitana</p>
          </IonLabel>
        </IonItem>
        <IonItem className='lista1'>
          <IonIcon aria-hidden="true" icon={time} color='primary' slot="start"></IonIcon>
          <IonLabel>
            <h2>Socoroma 204</h2>
            <p>San Joaquín, Región Metropolitana</p>
          </IonLabel>
        </IonItem>
        <IonItem className='lista1'>
          <IonIcon aria-hidden="true" icon={time} color='primary' slot="start"></IonIcon>
          <IonLabel>
            <h2>Socoroma 204</h2>
            <p>San Joaquín, Región Metropolitana</p>
          </IonLabel>
        </IonItem>

        <IonButton className='boton' onClick={handleProgramarViaje}>
          Programa tu viaje
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
