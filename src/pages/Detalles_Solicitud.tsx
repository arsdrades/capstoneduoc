import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonText,
  IonButton,
} from "@ionic/react";
import { supabase } from "../CAPA DATOS/supabaseClient";

type Producto = {
  nombre: string;
  alto: number;
  ancho: number;
  largo: number;
  cantidad: number;
  clasificacion: string;
  costo: number;
};

const Detalles_Solicitud: React.FC = () => {
  const [productosSeleccionados, setProductosSeleccionados] = useState<Producto[]>([]);
  const [direccionOrigen, setDireccionOrigen] = useState("");
  const [direccionDestino, setDireccionDestino] = useState("");
  const [distanceCost, setDistanceCost] = useState<number>(0);
  const [costoTotalProductos, setCostoTotalProductos] = useState(0);

  const history = useHistory();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(value);
  };

  useEffect(() => {
    try {
      const origen = sessionStorage.getItem("direccionOrigen") || "";
      const destino = sessionStorage.getItem("direccionDestino") || "";
      const distanceCostFromStorage = sessionStorage.getItem("distanceCost");
      const productosData = localStorage.getItem("productosSeleccionados");

      setDireccionOrigen(origen);
      setDireccionDestino(destino);

      if (distanceCostFromStorage) {
        setDistanceCost(Number(distanceCostFromStorage));
      }

      if (productosData) {
        const productos = JSON.parse(productosData).map((producto: any) => ({
          ...producto,
          costo: Number(producto.costo),
          cantidad: Number(producto.cantidad),
        }));
        setProductosSeleccionados(productos);

        const totalProductosCost = productos.reduce(
          (acc: number, producto: Producto) => acc + producto.costo * producto.cantidad,
          0
        );
        setCostoTotalProductos(totalProductosCost);
      }
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  }, []);

  useEffect(() => {
    const totalSolicitudCost = costoTotalProductos + distanceCost;
    sessionStorage.setItem("costoTotal", totalSolicitudCost.toString());
  }, [costoTotalProductos, distanceCost]);

  const handleContinuar = async () => {
    if (!direccionOrigen || !direccionDestino) {
      alert("Por favor, asegúrate de que las direcciones estén completas.");
      return;
    }

    try {
      const fetchGeocode = async (address: string) => {
        const url = `http://localhost:3001/api/geocode?address=${encodeURIComponent(address)}`;
        try {
          const response = await fetch(url);
          const data = await response.json();
          if (data.length > 0) {
            return { lat: data[0].lat, lng: data[0].lon };
          }
        } catch (error) {
          console.error("Error geocodificando la dirección:", error);
        }
        return null;
      };

      const originCoords = await fetchGeocode(direccionOrigen);
      const destinationCoords = await fetchGeocode(direccionDestino);

      if (!originCoords || !destinationCoords) {
        alert("No se pudieron geocodificar las direcciones. Verifica las direcciones ingresadas.");
        return;
      }

      sessionStorage.setItem("originLat", originCoords.lat.toString());
      sessionStorage.setItem("originLng", originCoords.lng.toString());
      sessionStorage.setItem("destinationLat", destinationCoords.lat.toString());
      sessionStorage.setItem("destinationLng", destinationCoords.lng.toString());

      const fetchRoute = async (start: [number, number], end: [number, number]) => {
        const startCoords = `${start[1]},${start[0]}`;
        const endCoords = `${end[1]},${end[0]}`;
        const url = `http://localhost:3001/api/directions?start=${startCoords}&end=${endCoords}`;
        try {
          const response = await fetch(url);
          const data = await response.json();
          if (data.features?.[0]?.geometry?.coordinates) {
            const coordinates = data.features[0].geometry.coordinates.map(
              ([lng, lat]: [number, number]) => ({ lat, lng })
            );
            sessionStorage.setItem("route", JSON.stringify(coordinates));
          }
        } catch (error) {
          console.error("Error obteniendo la ruta:", error);
        }
      };

      await fetchRoute([originCoords.lat, originCoords.lng], [destinationCoords.lat, destinationCoords.lng]);

      history.push("/Maps");
    } catch (error) {
      console.error("Error al procesar la solicitud:", error);
      alert("Ocurrió un error inesperado. Inténtalo de nuevo.");
    }
  };

  const showSessionStorage = () => {
    const entries = Object.entries(sessionStorage);
    let message = "Datos en sessionStorage:\n";
    entries.forEach(([key, value]) => {
      message += `${key}: ${value}\n`;
    });
    console.log("sessionStorage:", entries);
    alert(message);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Detalles de la Solicitud</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h2>Resumen de la Solicitud</h2>

        <IonList>
          <IonItem>
            <IonLabel>
              <h3>Dirección de Origen:</h3>
              <p>{direccionOrigen || "No disponible"}</p>
            </IonLabel>
          </IonItem>

          <IonItem>
            <IonLabel>
              <h3>Dirección de Destino:</h3>
              <p>{direccionDestino || "No disponible"}</p>
            </IonLabel>
          </IonItem>

          <IonItem>
            <IonLabel>
              <h3>Costo de Distancia:</h3>
              <p>{formatCurrency(distanceCost)}</p>
            </IonLabel>
          </IonItem>
        </IonList>

        <h3>Productos Seleccionados</h3>
        {productosSeleccionados.length > 0 ? (
          <IonList>
            {productosSeleccionados.map((producto, index) => (
              <IonItem key={index}>
                <IonLabel>
                  <h4>{producto.nombre}</h4>
                  <p>Clasificación: {producto.clasificacion}</p>
                  <p>
                    Dimensiones: {producto.alto} cm (alto) x {producto.ancho} cm (ancho) x{" "}
                    {producto.largo} cm (largo)
                  </p>
                  <p>Cantidad: {producto.cantidad}</p>
                  <p>Costo Unitario: {formatCurrency(producto.costo)}</p>
                  <p>Subtotal: {formatCurrency(producto.costo * producto.cantidad)}</p>
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        ) : (
          <IonText color="danger">
            <p>No hay productos seleccionados.</p>
          </IonText>
        )}

        <IonItem>
          <IonLabel>
            <h3>Costo Total de Productos:</h3>
            <p>{formatCurrency(costoTotalProductos)}</p>
          </IonLabel>
        </IonItem>

        <IonItem>
          <IonLabel>
            <h2>Costo Total de la Solicitud:</h2>
            <IonText color="primary">
              <strong>{formatCurrency(costoTotalProductos + distanceCost)}</strong>
            </IonText>
          </IonLabel>
        </IonItem>

        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <IonButton color="primary" expand="block" onClick={handleContinuar}>
            Buscar Flete
          </IonButton>
          <IonButton color="secondary" expand="block" onClick={showSessionStorage}>
            Mostrar sessionStorage
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Detalles_Solicitud;
