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

  // Formateador de números
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(value);
  };

  useEffect(() => {
    try {
      // Leer datos de sessionStorage
      const origen = sessionStorage.getItem("direccionOrigen") || "";
      const destino = sessionStorage.getItem("direccionDestino") || "";
      const distanceCostFromStorage = sessionStorage.getItem("distanceCost");
      const productosData = localStorage.getItem("productosSeleccionados");

      setDireccionOrigen(origen);
      setDireccionDestino(destino);

      // Cargar costo de distancia desde sessionStorage
      if (distanceCostFromStorage) {
        setDistanceCost(Number(distanceCostFromStorage));
      }

      // Cargar productos seleccionados desde localStorage
      if (productosData) {
        const productos = JSON.parse(productosData).map((producto: any) => ({
          ...producto,
          costo: Number(producto.costo),
          cantidad: Number(producto.cantidad),
        }));
        setProductosSeleccionados(productos);

        // Calcular el costo total de los productos
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

  const totalSolicitudCost = costoTotalProductos + distanceCost;

  const handleContinuar = () => {
    if (!direccionOrigen || !direccionDestino) {
      alert("Por favor, asegúrate de que las direcciones estén completas.");
      return;
    }

    sessionStorage.setItem("direccionOrigen", direccionOrigen);
    sessionStorage.setItem("direccionDestino", direccionDestino);
    history.push("/Maps");
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
              <strong>{formatCurrency(totalSolicitudCost)}</strong>
            </IonText>
          </IonLabel>
        </IonItem>

        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <IonButton color="primary" expand="block" onClick={handleContinuar}>
            Buscar Flete
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Detalles_Solicitud;
