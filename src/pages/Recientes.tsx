import { IonCard, IonIcon, IonItem, IonLabel, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton } from '@ionic/react';
import './Recientes.css';
import { time } from 'ionicons/icons';

const actividadesRecientes = [
  { nombre: 'Carlos Meza', fecha: '21 jul - 9:04 a.m', monto: 'CLP 4,290' },
  { nombre: 'María González', fecha: '20 jul - 10:30 a.m', monto: 'CLP 3,500' },
  { nombre: 'Luis Pérez', fecha: '19 jul - 8:45 a.m', monto: 'CLP 2,800' }
];

const Recientes: React.FC = () => {
  return (
    <IonPage>
      <IonHeader class='principal'>
        <IonToolbar color="primary">
          <IonTitle>Actividad Reciente</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonCard >
          {actividadesRecientes.map((actividad, index) => (
            <IonItem color="" key={index} className="custom-item">
              <IonIcon aria-hidden="true" icon={time} color='secondary' slot="start"></IonIcon>
              <IonLabel>
                <h2>{actividad.nombre}</h2>
                <h3>{actividad.fecha}</h3>
                <h3>{actividad.monto}</h3>
              </IonLabel>
              <IonButton color="primary">Reagendar</IonButton>
            </IonItem>
          ))}
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Recientes;
