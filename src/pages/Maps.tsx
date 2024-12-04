import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { LatLngBounds } from "leaflet";
import { supabase } from "../CAPA DATOS/supabaseClient";
import sedanIcon from "../icons/sedan.png";
import './Maps.css'; // Importar CSS


// Icono personalizado para Leaflet
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

const driverIcon = new L.Icon({
  iconUrl: sedanIcon,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const Maps: React.FC = () => {
  const [driverLocation, setDriverLocation] = useState<{ coords: [number, number]; driver_id: string } | null>(null);
  const [driverDetails, setDriverDetails] = useState<{ nombre: string; apellido: string; fono: string } | null>(null);
  const [showDriverInfo, setShowDriverInfo] = useState(false);
  const [originCoords, setOriginCoords] = useState<[number, number] | null>(null);
  const [destinationCoords, setDestinationCoords] = useState<[number, number] | null>(null);
  const [route, setRoute] = useState<L.LatLngTuple[]>([]);
  const [bounds, setBounds] = useState<LatLngBounds | null>(null);
  const [costoTotal, setCostoTotal] = useState<number>(0);
  const [clienteNombre, setClienteNombre] = useState<string>("Juan Pérez");
  const [clienteId] = useState<string>("user-123");
  const [solicitudRechazada, setSolicitudRechazada] = useState(false);
  const [solicitudEstado, setSolicitudEstado] = useState<string | null>(null);
  const [showRejectionMessage, setShowRejectionMessage] = useState(false);
  const [lastProcessedRejectionId, setLastProcessedRejectionId] = useState<string | null>(null);

  const fetchDriverLocation = async () => {
    try {
      const { data, error } = await supabase
        .from("driver_locations")
        .select("latitude, longitude, driver_id")
        .single();

      if (error) {
        console.error("Error obteniendo la ubicación del conductor:", error.message);
        setDriverLocation(null);
        setDriverDetails(null);
        setShowDriverInfo(false);
        return;
      }

      if (data && data.latitude && data.longitude) {
        setDriverLocation({ coords: [data.latitude, data.longitude], driver_id: data.driver_id });
      } else {
        setDriverLocation(null);
        setDriverDetails(null);
        setShowDriverInfo(false);
      }
    } catch (error) {
      console.error("Error al consultar la ubicación del conductor:", error);
      setDriverLocation(null);
      setDriverDetails(null);
      setShowDriverInfo(false);
    }
  };

  const fetchDriverDetails = async (driverId: string) => {
    try {
      const { data, error } = await supabase
        .from("usuarios_conductores")
        .select("nombre, apellido, fono")
        .eq("driver_id", driverId)
        .single();

      if (error) {
        console.error("Error obteniendo los detalles del conductor:", error.message);
        setDriverDetails(null);
        return;
      }

      if (data) {
        setDriverDetails({ nombre: data.nombre, apellido: data.apellido, fono: data.fono });
      }
    } catch (error) {
      console.error("Error al consultar los detalles del conductor:", error);
      setDriverDetails(null);
    }
  };

  const fetchCostAndLocations = async () => {
    const storedOrigin = sessionStorage.getItem("direccionOrigen") || "";
    const storedDestination = sessionStorage.getItem("direccionDestino") || "";
    const storedCostoTotal = parseFloat(sessionStorage.getItem("costoTotal") || "0");

    if (!storedOrigin || !storedDestination || isNaN(storedCostoTotal) || storedCostoTotal <= 0) {
      console.error("Datos faltantes o inválidos en sessionStorage:");
      console.error("Origen:", storedOrigin, "Destino:", storedDestination, "Costo Total:", storedCostoTotal);
      alert("No se pudieron cargar los datos necesarios. Verifica los valores ingresados.");
      return;
    }

    try {
      const originCoords = await geocode(storedOrigin);
      const destinationCoords = await geocode(storedDestination);

      if (!originCoords || !destinationCoords) {
        alert("No se pudieron geocodificar las direcciones. Verifica las direcciones ingresadas.");
        return;
      }

      setOriginCoords(originCoords);
      setDestinationCoords(destinationCoords);
      setCostoTotal(storedCostoTotal);

      await fetchRoute(originCoords, destinationCoords);
    } catch (error) {
      console.error("Error al cargar ubicaciones:", error);
    }
  };

  const sendRequest = async () => {
    if (!driverDetails || !originCoords || !destinationCoords || !driverLocation) {
      alert("Faltan datos para completar la solicitud.");
      return;
    }

    const totalCost = costoTotal || parseFloat(sessionStorage.getItem("costoTotal") || "0");

    if (isNaN(totalCost) || totalCost <= 0) {
      console.error("Costo total no válido. Revisa sessionStorage:", sessionStorage.getItem("costoTotal"));
      alert("El costo total no es válido. Por favor, revisa los datos.");
      return;
    }

    try {
      const { error } = await supabase.from("solicitudes").insert({
        driver_id: driverLocation.driver_id,
        user_id: clienteId,
        costo_total: totalCost,
        nombre_cliente: clienteNombre,
        direccion_origen: sessionStorage.getItem("direccionOrigen"),
        direccion_destino: sessionStorage.getItem("direccionDestino"),
        estado: "pendiente",
        created_at: new Date().toISOString(),
      });

      if (error) {
        console.error("Error enviando la solicitud:", error.message);
        alert("Hubo un problema al enviar la solicitud. Inténtalo de nuevo.");
      } else {
        alert("Solicitud enviada correctamente al conductor.");
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  };

  const geocode = async (address: string): Promise<[number, number] | null> => {
    if (!address) {
      console.error("La dirección está vacía o no es válida.");
      return null;
    }

    const url = `http://localhost:3001/api/geocode?address=${encodeURIComponent(address)}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.length > 0) {
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      }

      console.error("No se encontraron resultados para la dirección:", address);
      return null;
    } catch (error) {
      console.error("Error al geocodificar la dirección:", address, error);
      return null;
    }
  };

  const fetchRoute = async (start: [number, number], end: [number, number]) => {
    const startCoords = `${start[1]},${start[0]}`;
    const endCoords = `${end[1]},${end[0]}`;
    const url = `http://localhost:3001/api/directions?start=${startCoords}&end=${endCoords}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.features?.[0]?.geometry?.coordinates) {
        const coordinates = data.features[0].geometry.coordinates.map(
          ([lng, lat]: [number, number]) => [lat, lng]
        );
        setRoute(coordinates);
      }
    } catch (error) {
      console.error("Error obteniendo la ruta:", error);
    }
  };

  useEffect(() => {
    const checkSolicitudEstado = async () => {
      if (!driverLocation?.driver_id) return;
    
      try {
        const { data, error } = await supabase
          .from("solicitudes")
          .select("*")
          .eq("user_id", clienteId) // Asegúrate de filtrar por `user_id`.
          .order("created_at", { ascending: false })
          .limit(1)
          .single();
    
        if (error && error.code !== "PGRST116") {
          console.error("Error obteniendo el estado de la solicitud:", error.message);
        } else if (data) {
          console.log("Estado de la solicitud:", data.estado);
    
          // Mostrar cuadro solo si es rechazado y no se ha procesado antes
          if (data.estado === "rechazado" && data.id !== lastProcessedRejectionId) {
            setShowRejectionMessage(true);
            setLastProcessedRejectionId(data.id); // Actualizar la solicitud procesada
            setTimeout(() => setShowRejectionMessage(false), 5000); // Mostrar mensaje por 5 segundos
          }
    
          setSolicitudEstado(data.estado);
        } else {
          setSolicitudEstado(null);
        }
      } catch (err) {
        console.error("Error en la consulta de estado de la solicitud:", err);
      }
    };
  
    checkSolicitudEstado();
    const interval = setInterval(checkSolicitudEstado, 5000);
    return () => clearInterval(interval);
  }, [driverLocation]);



  useEffect(() => {
    fetchDriverLocation();
    fetchCostAndLocations();
    const interval = setInterval(fetchDriverLocation, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: "relative", height: "100vh" }}>
    {showRejectionMessage && (
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            color: "black",
            padding: "20px",
            borderRadius: "10px",
            textAlign: "center",
            width: "80%",
            maxWidth: "400px",
          }}
        >
          <p style={{ color: "red", fontWeight: "bold" }}>El conductor rechazó la solicitud.</p>
        </div>
      </div>
    )}
  
      {!driverLocation && (
        <div
  style={{
    bottom: "20px",
    left: "10px",
    right: "10px",
    backgroundColor: "#132d46",
    padding: "20px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    position: "absolute",
    top: "3%",
    width: "95%",
    height: "20%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  }}
>
  <p style={{ fontSize: "18px", fontWeight: "bold", color: "white" }}>
    Buscando fletes en el área...
  </p>

  {/* Animación circular */}
  <div
    className="loading-circle"
    style={{
      marginTop: "10px", // Espacio entre texto y animación
    }}
  ></div>
</div>
      )}
  
      <MapContainer center={[-33.4489, -70.6693]} zoom={12} style={{ width: "100%", height: "100vh" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
  
        {driverLocation && (
          <Marker
            position={driverLocation.coords}
            icon={driverIcon}
            eventHandlers={{
              click: () => {
                setShowDriverInfo(true);
                fetchDriverDetails(driverLocation.driver_id);
              },
            }}
          >
            <Popup>Ubicación del conductor</Popup>
          </Marker>
        )}
  
        {originCoords && (
          <Marker position={originCoords} icon={customIcon}>
            <Popup>Origen</Popup>
          </Marker>
        )}
  
        {destinationCoords && (
          <Marker position={destinationCoords} icon={customIcon}>
            <Popup>Destino</Popup>
          </Marker>
        )}
  
        {route.length > 0 && <Polyline positions={route} color="blue" />}
      </MapContainer>
  
      {showDriverInfo && driverDetails && (
        
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "10px",
            right: "10px",
            backgroundColor: "white",
            padding: "20px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            zIndex: 1000,
            borderRadius: "8px",
          }}
        >
          <h4>
          <p>
              <strong>Conductor:</strong> {driverDetails.nombre} {driverDetails.apellido}
            </p>
            <p>
              <strong>Teléfono:</strong> {driverDetails.fono}
            </p>
            <p>
              <strong>Metodo de Pago:</strong> Efectivo
            </p>
            
          </h4>
          <div
  style={{
    display: "flex",
    justifyContent: "center",
    gap: "10px", // Espacio entre botones
    marginTop: "10px", // Margen superior opcional
  }}
>
  <button
    style={{
      height:"50px",
      width: "180px",
      padding: "5px 10px",
      backgroundColor: "#01c380",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    }}
    onClick={sendRequest}
  >
    Solicitar este flete
  </button>
  <button
    style={{
      height:"50px",
      width: "180px",
      padding: "5px 10px",
      backgroundColor: "#eb2222",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    }}
    onClick={() => setShowDriverInfo(false)}
  >
    Cerrar
  </button>
</div>
        </div>
      )}
    </div>
  );
}

export default Maps;
