import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonButton,
  IonCheckbox,
} from "@ionic/react";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

const IngresarDirecciones: React.FC = () => {
  const [direccionOrigen, setDireccionOrigen] = useState("");
  const [direccionDestino, setDireccionDestino] = useState("");
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [distanceCost, setDistanceCost] = useState(0);

  const history = useHistory();

  // Habilitar o deshabilitar el botón según el estado de las direcciones
  useEffect(() => {
    setIsButtonDisabled(!(direccionOrigen && direccionDestino));
  }, [direccionOrigen, direccionDestino]);

  // Manejar la geolocalización del usuario
  useEffect(() => {
    if (useCurrentLocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const latlng = `${latitude}, ${longitude}`;

          fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          )
            .then((response) => response.json())
            .then((data) => {
              if (data && data.display_name) {
                const address = data.display_name || latlng;
                setDireccionOrigen(address);
                sessionStorage.setItem("direccionOrigen", address); // Guardar en sessionStorage
              } else {
                console.error("Respuesta de Nominatim inválida:", data);
              }
            })
            .catch((error) => console.error("Error obteniendo dirección:", error));
        },
        (error) => {
          console.error("Error obteniendo la ubicación:", error);
        }
      );
    } else {
      setDireccionOrigen(""); // Limpia la dirección si no se usa la ubicación actual
    }
  }, [useCurrentLocation]);

  // Calcular el costo de la distancia entre origen y destino
  const calculateDistanceCost = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/directions?start=${encodeURIComponent(
          direccionOrigen
        )}&end=${encodeURIComponent(direccionDestino)}`
      );

      if (!response.ok) {
        throw new Error(`Error en el cálculo de la distancia: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.features?.[0]?.properties?.segments?.[0]?.distance) {
        const distanceInMeters = data.features[0].properties.segments[0].distance;
        const costPerKilometer = 1000; // Define el costo por kilómetro
        const distanceCost = Math.ceil(distanceInMeters / 1000) * costPerKilometer;
        setDistanceCost(distanceCost);

        // Guardar en sessionStorage para usarlo en otros componentes
        sessionStorage.setItem("distanceCost", distanceCost.toString());
      } else {
        console.error("No se pudo calcular la distancia.");
        setDistanceCost(0);
      }
    } catch (error) {
      console.error("Error calculando la distancia:", error);
    }
  };

  // Manejar la acción de continuar
  const handleContinuar = async () => {
    await calculateDistanceCost(); // Asegurarse de calcular el costo antes de continuar
    sessionStorage.setItem("direccionOrigen", direccionOrigen);
    sessionStorage.setItem("direccionDestino", direccionDestino);
    history.push("/Detalles");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Ingresar Direcciones</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent
        className="ion-padding"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          backgroundColor: "#f5f5f5",
        }}
      >
        <div style={{ maxWidth: "500px", width: "100%", padding: "1.5rem", textAlign: "center" }}>
          <h2 style={{ marginBottom: "1.5rem", fontSize: "1.5rem", color: "#333", fontWeight: "bold" }}>
            Ingrese el punto de inicio del viaje y el punto de destino
          </h2>

          <IonItem style={{ marginBottom: "1.5rem", "--background": "transparent" }}>
            <IonCheckbox
              checked={useCurrentLocation}
              onIonChange={(e) => setUseCurrentLocation(e.detail.checked)}
            />
            <IonLabel style={{ marginLeft: "10px" }}>
              Usar mi ubicación actual como punto de inicio
            </IonLabel>
          </IonItem>

          <IonItem style={{ marginBottom: "1.5rem", "--background": "transparent" }}>
            <IonLabel
              position="stacked"
              style={{
                fontSize: "1.2rem",
                fontWeight: "bold",
                color: "#333",
                marginBottom: "0.5rem",
              }}
            >
              Dirección de Origen
            </IonLabel>
            <input
              placeholder="Ingrese la dirección de origen"
              value={direccionOrigen}
              onChange={(e) => setDireccionOrigen(e.target.value)}
              style={{
                width: "100%",
                padding: "14px",
                fontSize: "16px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                backgroundColor: "#ffffff",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              }}
              disabled={useCurrentLocation}
            />
          </IonItem>

          <IonItem style={{ "--background": "transparent" }}>
            <IonLabel
              position="stacked"
              style={{
                fontSize: "1.2rem",
                fontWeight: "bold",
                color: "#333",
                marginBottom: "0.5rem",
              }}
            >
              Dirección de Destino
            </IonLabel>
            <input
              placeholder="Ingrese la dirección de destino"
              value={direccionDestino}
              onChange={(e) => setDireccionDestino(e.target.value)}
              style={{
                width: "100%",
                padding: "14px",
                fontSize: "16px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                backgroundColor: "#ffffff",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              }}
            />
          </IonItem>

          <IonButton
            expand="block"
            color="primary"
            onClick={handleContinuar}
            disabled={isButtonDisabled}
            style={{ marginTop: "1.5rem", fontSize: "1rem", fontWeight: "bold" }}
          >
            Continuar
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default IngresarDirecciones;
