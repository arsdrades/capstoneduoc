import {IonIcon,IonSearchbar,IonItem,IonLabel, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab2.css';


import { time  } from 'ionicons/icons';
const Tab2: React.FC = () => {
  return (
    <IonPage >
    <IonHeader class='principal'>
      <IonToolbar color="primary">
        <IonTitle>Actividad Reciente</IonTitle>
      </IonToolbar>
    </IonHeader>

    <IonContent fullscreen>

    <IonItem className='lista1'>
    <IonIcon aria-hidden="true" icon={time} color='primary' slot="start"></IonIcon>
        <IonLabel>
        <h2>Carlos Meza</h2>
        <p>21 jul - 9;04 a.m</p>
        <p>CLP 4,290</p>
      </IonLabel>
      <IonButton>Reagendar</IonButton>
      </IonItem>
      <IonItem className='lista1'>
    <IonIcon aria-hidden="true" icon={time} color='primary' slot="start"></IonIcon>
        <IonLabel>
        <h2>Carlos Meza</h2>
        <p>21 jul - 9;04 a.m</p>
        <p>CLP 4,290</p>
      </IonLabel>
      <IonButton>Reagendar</IonButton>
      </IonItem>
      <IonItem className='lista1'>
    <IonIcon aria-hidden="true" icon={time} color='primary' slot="start"></IonIcon>
        <IonLabel>
        <h2>Carlos Meza</h2>
        <p>21 jul - 9;04 a.m</p>
        <p>CLP 4,290</p>
      </IonLabel>
      <IonButton>Reagendar</IonButton>
      </IonItem>


    </IonContent>
    
  </IonPage>
  );
};

export default Tab2;
