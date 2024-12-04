import { IonText, IonButton, IonIcon, IonPopover, IonContent, IonHeader, IonPage, IonToolbar, IonTitle, IonImg, IonCard } from '@ionic/react';
import { useState } from 'react';
import { arrowDownCircleOutline, cashOutline, walletOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import './MetodoPago.css';

const MetodoPago: React.FC = () => {
  // Estado para mostrar el popover
  const [showProductoModal, setShowProductoModal] = useState(false);
  // Estado para guardar el método de pago seleccionado
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const history = useHistory();  // Inicializar useHistory para la navegación

  // Función para manejar la selección del método de pago
  const handlePaymentSelection = (method: string) => {
    setSelectedPaymentMethod(method);
    setShowProductoModal(false); // Cierra el popover después de seleccionar
  };

  const handleContinuar = () => {
    if (selectedPaymentMethod) {
      // Guardar el método de pago en localStorage
      localStorage.setItem("medioDePago", selectedPaymentMethod);
      // Realizar la redirección de manera asíncrona para evitar el error
      setTimeout(() => {
        history.push('/Detalles');  // Redirige a la página detalle_solicitud
      }, 0);
    } else {
      // Mostrar un mensaje de advertencia si no se ha seleccionado un método de pago
      alert('Por favor, selecciona un método de pago antes de continuar.');
    }
  };



  return (
    <IonPage>
      <IonHeader className="principal">
        <div className="header-content">
          <IonToolbar
            color="primary"
            style={{
              height: '100px',
              borderBottomLeftRadius: '50px',
              borderBottomRightRadius: '50px',
              overflow: 'hidden',
            }}
          >
            <IonTitle className="aaa">¿Qué método de pago prefieres?</IonTitle>
          </IonToolbar>
        </div>
      </IonHeader>

      <IonContent fullscreen>
        {/* Imagen decorativa */}
        <IonImg className="cajita" src="/src/img/pago.webp" />

        <div className="content">
          {/* Botón para abrir el popover de selección de pago */}
          <IonButton
            className="padding fade-in-down"
            expand="block"
            shape="round"
            onClick={() => setShowProductoModal(true)}
          >
            Seleccionar Método de pago
            <IonIcon  icon={arrowDownCircleOutline} slot="start" color="secondary" />
          </IonButton>

          {/* Popover para seleccionar el método de pago */}
          <IonPopover
            isOpen={showProductoModal}
            onDidDismiss={() => setShowProductoModal(false)}
          >
            <div className="payment-options">
              <IonButton
              color="light"
                expand="full"
                onClick={() => handlePaymentSelection('Efectivo')}
              >
                <IonIcon color='secondary' icon={cashOutline} slot="start" />
                Efectivo
              </IonButton>
              <IonButton
              color="light"
                expand="full"
                onClick={() => handlePaymentSelection('Transferencia')}
              >
                <IonIcon color='secondary' icon={walletOutline} slot="start" />
                Transferencia
              </IonButton>
            </div>
          </IonPopover>

          {/* Mostrar el método de pago seleccionado */}
          {selectedPaymentMethod && (
            <IonCard>
            <IonText className='ojo'>
              <h4>Método de pago seleccionado:</h4>
              <p>{selectedPaymentMethod}</p>
            </IonText>
            </IonCard>
          )}

          {/* Botón para continuar */}
          <IonButton
            expand="block"
            color="primary"
            shape="round"
            onClick={handleContinuar}
            style={{ marginTop: "1.5rem", fontSize: "1rem", fontWeight: "bold" }}
          >
            Continuar
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default MetodoPago;
