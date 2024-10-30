import { IonButtons, IonBackButton, IonImg, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardContent,IonContent, IonIcon } from '@ionic/react'; //Componentes necesarios
import { useLocation } from 'react-router-dom'; // Importar useLocation
import './Mensajes.css'; // Importar el CSS
import { banOutline } from 'ionicons/icons'; // Importar Iconos que se utilizarán

const Mensajes: React.FC = () => {
  const location = useLocation(); // Obtener la ubicación actual
  return (
    <IonPage>        
        <IonHeader className='headerback'>
         <IonToolbar color="primary">
          <IonButtons slot="start">
           <IonBackButton defaultHref="/ruta-anterior" />
          </IonButtons>
          <IonTitle>Mensajes</IonTitle>
         </IonToolbar>
        </IonHeader>

     <IonContent fullscreen>
        <IonCard className='centrado' color="primary">
         <IonImg className='imgnop' src="/src/img/nop.png" />
         <IonCardContent> Sin Mensajes Aún.
         </IonCardContent><IonIcon  icon={banOutline} color="secondary" slot="start"></IonIcon> 
        </IonCard>
     </IonContent>
    </IonPage>
  );
};
export default Mensajes;