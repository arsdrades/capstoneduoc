import { IonButtons, IonBackButton, IonImg, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonContent } from '@ionic/react';
import { useLocation } from 'react-router-dom'; // Importar useLocation
import './About.css';

const About: React.FC = () => {
  const location = useLocation(); // Obtener la ubicación actual
  return (
    <IonPage>        
        <IonHeader className='headerback'>
         <IonToolbar color="primary">
          <IonButtons slot="start">
           <IonBackButton defaultHref="/ruta-anterior" />
          </IonButtons>
          <IonTitle>Sobre Nosotros</IonTitle>
         </IonToolbar>
        </IonHeader>

      <IonContent fullscreen>
       <IonImg className='imagabout' src="/src/img/logo.png" />
       <IonCard color="primary">
        <IonCardHeader>
         <IonCardSubtitle>© Bolt
         </IonCardSubtitle>
        </IonCardHeader>
         <IonCardContent>Bolt es una aplicación desarrollada por Ariel Salas, Álex Llancafil y Marcelo España como parte de su proyecto final para la carrera de Ingeniería Informática en Duoc UC. Esta aplicación tiene como propósito optimizar y modernizar el proceso de transporte de cargas pesadas, ofreciendo una solución eficiente, rápida y confiable. El equipo ha trabajado en el desarrollo de Bolt para satisfacer las necesidades de usuarios que requieren servicios de fletes, enfocándose en la velocidad y calidad del servicio. El proyecto refleja la integración de tecnologías móviles avanzadas y la aplicación de metodologías ágiles, demostrando los conocimientos adquiridos a lo largo de su formación académica.
         </IonCardContent>
       </IonCard>
      </IonContent>
    </IonPage>
  );
};
export default About;