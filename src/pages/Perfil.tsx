import { IonCard, IonThumbnail, IonRow, IonCol, IonGrid, IonIcon, IonContent, IonImg, IonHeader, IonPage, IonTitle, IonItem, IonList, IonLabel, IonToolbar, IonButton } from '@ionic/react'; //Importar Componentes Necesarios
import { useHistory } from 'react-router-dom'; //Rutear
import './Perfil.css'; // Importar el CSS
import { settings, mail, happy, bookmark, alertCircle, chevronForwardOutline } from 'ionicons/icons'; //Importar Iconos
import { useUser } from '../CAPA DATOS/userContext'

const Perfil: React.FC = () => {

  const history = useHistory();

  const { user } = useUser();

  if (!user) {
    return <p>No hay datos del usuario</p>; // Si no hay usuario, mostramos un mensaje
  }

  const handleAbout = () => {
    history.push('/about'); // Redirige a la página "About"
  };

  const handleMensajes = () => {
    history.push('/mensajes'); // Redirige a la página "Mensajes"
  };

  const handleLogin = () => {
    history.push('/login'); // Redirige a la página "Login"
  };

  return (
    <IonPage>
      <IonHeader className='principal'>
        <IonToolbar color="primary">
          <IonTitle>Perfil</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
      <div className="thumbnail-container">
      <div className="thumbnail-background">
        <IonThumbnail className="ion-thumbnail">
          <IonImg alt="Perfil" src="https://upload.wikimedia.org/wikipedia/en/0/03/Walter_White_S5B.png?20201021064948" />
        </IonThumbnail>
      </div>
      <div className="">
      <h3 className="thumbnail-name">{user.nombre} {user.apellido}</h3>
      <p className="thumbnail-name">{user.email} </p>
      </div>
    </div>
        <IonCard className="custom-card">
  <IonList className="no-spacing-list">
    {/* EDITAR DATOS PERSONALES */}
    <IonItem button className="no-spacing-item">
      <IonIcon icon={happy} slot="start" color="secondary"></IonIcon>
      <IonLabel>Editar Datos Personales</IonLabel>
      <IonIcon icon={chevronForwardOutline} color='primary' slot="end"></IonIcon>
    </IonItem>

    {/* CONFIGURACIÓN */}
    <IonItem button className="no-spacing-item">
      <IonIcon icon={settings} slot="start" color="secondary"></IonIcon>
      <IonLabel>Configuración</IonLabel>
      <IonIcon icon={chevronForwardOutline} color='primary' slot="end"></IonIcon>
    </IonItem>

    {/* MENSAJES */}
    <IonItem button className="no-spacing-item" onClick={handleMensajes}>
      <IonIcon icon={mail} slot="start" color="secondary"></IonIcon>
      <IonLabel>Mensajes</IonLabel>
      <IonIcon icon={chevronForwardOutline} color='primary' slot="end"></IonIcon>
    </IonItem>

    {/* FAVORITOS */}
    <IonItem button className="no-spacing-item">
      <IonIcon icon={bookmark} slot="start" color="secondary"></IonIcon>
      <IonLabel>Favoritos</IonLabel>
      <IonIcon icon={chevronForwardOutline} color='primary' slot="end"></IonIcon>
    </IonItem>

    {/* SOBRE NOSOTROS */}
    <IonItem button className="no-spacing-item" onClick={handleAbout}>
      <IonIcon icon={alertCircle} slot="start" color="secondary"></IonIcon>
      <IonLabel>Sobre Nosotros</IonLabel>
      <IonIcon icon={chevronForwardOutline} color='primary' slot="end"></IonIcon>
    </IonItem>

    {/* CERRAR SESIÓN */}

  </IonList>
</IonCard>


        {/* CERRAR SESIÓN - MANTENER COMO BOTÓN */}
        <IonButton color="primary" expand="block" onClick={handleLogin} className="boton-cerrar-sesion">
          Cerrar Sesión
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Perfil;
