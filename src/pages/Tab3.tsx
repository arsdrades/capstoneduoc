import {IonThumbnail,IonRow,IonCol, IonGrid,IonIcon, IonContent,IonImg,IonList, IonHeader, IonPage, IonTitle,IonButton, IonToolbar, IonItem,IonLabel } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab3.css';

import { settings, mail, happy, bookmark, alertCircle } from 'ionicons/icons';
const Tab3: React.FC = () => {
  return (
  <IonPage>
    <IonHeader class='principal'>
      <IonToolbar color="primary">
        <IonTitle>Perfil</IonTitle>
      </IonToolbar>
    </IonHeader>
    
     

    <IonContent fullscreen>
    <div className="thumbnail-container">
      <div className="thumbnail-content">
        <IonThumbnail className="ion-thumbnail">
          <IonImg alt="Silhouette of mountains" src="https://upload.wikimedia.org/wikipedia/en/0/03/Walter_White_S5B.png?20201021064948" />
        </IonThumbnail>
        <h3 className="thumbnail-name">Walter White</h3>
      </div>
    </div>
      <IonGrid>
        <IonRow>
        <IonCol><IonButton expand="block"> Editar Datos Personales </IonButton></IonCol>
        </IonRow>
        <IonRow>
          <IonCol><IonButton expand="block">Pago</IonButton></IonCol>
          <IonCol><IonButton expand="block">Historial</IonButton></IonCol>
          <IonCol><IonButton expand="block">Ayuda</IonButton></IonCol>
        </IonRow>
      </IonGrid>

      <IonGrid>
        <IonRow>
        
      
      
        </IonRow>
      </IonGrid>
    
  
      <IonList className='opcionesperfil' inset={true}>
        <IonItem>
        <IonIcon aria-hidden="true" icon={settings} color="primary" slot="start"></IonIcon>
        <IonLabel>Configuración</IonLabel>
        </IonItem>
        <IonItem>
        <IonIcon aria-hidden="true" icon={mail} color="primary" slot="start"></IonIcon>
        <IonLabel>Mensajes</IonLabel>
        </IonItem>
        <IonItem>
        <IonIcon aria-hidden="true" icon={happy} color="primary" slot="start"></IonIcon>
        <IonLabel>Haz entregas</IonLabel>
        </IonItem>
        <IonItem>
        <IonIcon aria-hidden="true" icon={bookmark} color="primary" slot="start"></IonIcon>
        <IonLabel>Favoritos</IonLabel>
        </IonItem>
        <IonItem>
        <IonIcon aria-hidden="true" icon={alertCircle} color="primary" slot="start"></IonIcon>
          <IonLabel>Legal</IonLabel>
        </IonItem>
      </IonList>
      </IonContent>
  </IonPage>
  );
};

export default Tab3;
