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
  IonIcon,
  IonCard,
  IonCardContent,
  IonRow,
  IonCol,
} from "@ionic/react";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { pinOutline, locationOutline } from "ionicons/icons";

const IngresarDirecciones: React.FC = () => {
  const [direccionOrigen, setDireccionOrigen] = useState("");
  const [direccionDestino, setDireccionDestino] = useState("");
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [distanceCost, setDistanceCost] = useState(0);

  const history = useHistory();
  const COST_PER_KILOMETER = 1000; // Valor por kilómetro

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
            .catch((error) =>
              console.error("Error obteniendo dirección:", error)
            );
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
      const url = `http://localhost:3001/api/directions?start=${encodeURIComponent(
        direccionOrigen
      )}&end=${encodeURIComponent(direccionDestino)}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();

      if (data && data.features?.[0]?.properties?.segments?.[0]?.distance) {
        const distanceInMeters =
          data.features[0].properties.segments[0].distance;

        // Convertir de metros a kilómetros
        const distanceInKilometers = distanceInMeters / 1000;

        // Calcular el costo total
        const calculatedCost = Math.ceil(
          distanceInKilometers * COST_PER_KILOMETER
        );
        setDistanceCost(calculatedCost);

        // Guardar en sessionStorage para el siguiente paso
        sessionStorage.setItem("distanceCost", calculatedCost.toString());
      } else {
        console.error("No se encontró la distancia en la respuesta de la API.");
        setDistanceCost(0);
      }
    } catch (error) {
      console.error("Error calculando el costo de distancia:", error);
    }
  };

  // Manejar la acción de continuar
  const handleContinuar = async () => {
    await calculateDistanceCost(); // Asegurarse de calcular el costo antes de continuar
    sessionStorage.setItem("direccionOrigen", direccionOrigen);
    sessionStorage.setItem("direccionDestino", direccionDestino);
    history.push("/MetodoPago");
  };

  return (
    <IonPage>
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
        <div style={{ maxWidth: "500px", width: "100%", textAlign: "center" }}>
          <IonTitle
            style={{
              fontSize: "large",
              fontWeight: "bold",
              marginBottom: "1rem",
              padding: "20px 0",
              color: "#132d46",
            }}
          >
            <IonIcon
              icon={pinOutline}
              style={{
                fontSize: "20px",
                color: "var(--ion-color-secondary)",
              }}
            />
            Ingresa tu dirección
          </IonTitle>
          <IonLabel
            style={{
              fontSize: "medium",
              marginBottom: "20px",
              color: "#333",
              padding: "10px 0",
            }}
          >
            Ingresa el punto de origen y el punto de destino
          </IonLabel>

          <IonCard
            style={{
              marginTop: "1rem",
              padding: "15px",
              border: "1px solid #01c380",
              borderRadius: "10px",
              backgroundColor: "#fff",
            }}
          >
            <IonCardContent style={{ padding: "10px" }}>
              <IonRow style={{ marginBottom: "1rem", padding: "10px" }}>
                <IonCol size="1">
                  <IonCheckbox
                    checked={useCurrentLocation}
                    onIonChange={(e) =>
                      setUseCurrentLocation(e.detail.checked)
                    }
                  />
                </IonCol>
                <IonCol size="11">
                  <IonLabel>
                    Usar mi ubicación actual como punto de inicio
                  </IonLabel>
                </IonCol>
              </IonRow>

              <IonItem
                style={{
                  marginBottom: "1rem",
                  "--background": "transparent",
                  padding: "10px",
                }}
              >
                <IonLabel
                  position="stacked"
                  style={{
                    fontSize: "1.1rem",
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
                    padding: "12px",
                    fontSize: "16px",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                    backgroundColor: "#ffffff",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                  }}
                  disabled={useCurrentLocation}
                />
              </IonItem>

              <IonItem
                style={{
                  "--background": "transparent",
                  padding: "10px",
                }}
              >
                <IonLabel
                  position="stacked"
                  style={{
                    fontSize: "1.1rem",
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
                    padding: "12px",
                    fontSize: "16px",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                    backgroundColor: "#ffffff",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                  }}
                />
              </IonItem>
            </IonCardContent>
          </IonCard>

          <IonButton
            expand="block"
            color="primary"
            shape="round"
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
