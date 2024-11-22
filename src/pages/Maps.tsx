import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { LatLngBounds } from "leaflet";
import { IonButton } from "@ionic/react";

// Icono personalizado para Leaflet
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

// Ajustar los límites del mapa
const FitBounds: React.FC<{ bounds: LatLngBounds | null; userLocation: [number, number] | null }> = ({ bounds, userLocation }) => {
  const map = useMap();

  useEffect(() => {
    if (userLocation) {
      map.setView(userLocation, 15); // Zoom y vista hacia la ubicación actual
    } else if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50] }); // Ajusta los límites con padding si no hay ubicación del usuario
    }
  }, [bounds, userLocation, map]);

  return null;
};

const Maps: React.FC = () => {
  const [origin, setOrigin] = useState<[number, number] | null>(null);
  const [destination, setDestination] = useState<[number, number] | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [route, setRoute] = useState<L.LatLngTuple[]>([]);
  const [bounds, setBounds] = useState<LatLngBounds | null>(null);

  // Calcular límites y ajustarlos
  useEffect(() => {
    const calculateBounds = () => {
      const allPoints: L.LatLngTuple[] = [...route];
      if (origin) allPoints.push(origin);
      if (destination) allPoints.push(destination);
      if (allPoints.length > 0) {
        const bounds = L.latLngBounds(allPoints);
        setBounds(bounds);
      }
    };

    calculateBounds();
  }, [origin, destination, route]);

  // Obtener la ruta utilizando el proxy
  const fetchRoute = async (start: [number, number], end: [number, number]) => {
    if (!start || !end) {
      console.error("Coordenadas de inicio o fin inválidas");
      return;
    }

    const startCoords = `${start[1]},${start[0]}`;
    const endCoords = `${end[1]},${end[0]}`;
    const url = `http://localhost:3001/api/directions?start=${startCoords}&end=${endCoords}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.statusText}`);
      }
      const data = await response.json();

      if (data.features?.[0]?.geometry?.coordinates) {
        const coordinates = data.features[0].geometry.coordinates.map(
          ([lng, lat]: [number, number]) => [lat, lng]
        );
        setRoute(coordinates);
      } else {
        console.error("No se encontraron rutas en la respuesta.");
      }
    } catch (error) {
      console.error("Error obteniendo la ruta:", error instanceof Error ? error.message : "Error desconocido");
    }
  };

  // Cargar coordenadas desde sessionStorage y calcular la ruta
  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const storedOrigin = sessionStorage.getItem("direccionOrigen") || "Santiago, Chile";
        const storedDestination = sessionStorage.getItem("direccionDestino") || "Valparaíso, Chile";

        const originCoords = await geocode(storedOrigin);
        const destinationCoords = await geocode(storedDestination);

        if (originCoords && destinationCoords) {
          setOrigin(originCoords);
          setDestination(destinationCoords);
          await fetchRoute(originCoords, destinationCoords);
        } else {
          console.error("No se pudieron obtener las coordenadas de origen o destino.");
        }
      } catch (error) {
        console.error("Error al obtener coordenadas:", error instanceof Error ? error.message : "Error desconocido");
      }
    };

    fetchCoordinates();
  }, []);

  // Geocodificar una dirección utilizando el proxy
  const geocode = async (address: string): Promise<[number, number] | null> => {
    try {
      const response = await fetch(`http://localhost:3001/api/geocode?address=${encodeURIComponent(address)}`);
      if (!response.ok) {
        throw new Error(`Error en la solicitud de geocodificación: ${response.statusText}`);
      }
      const data = await response.json();

      if (data.length > 0) {
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      }
      console.error("No se encontraron resultados para la dirección:", address);
      return null;
    } catch (error) {
      console.error("Error al geocodificar la dirección:", error instanceof Error ? error.message : "Error desconocido");
      return null;
    }
  };

  // Obtener la ubicación actual del usuario y ajustar límites
  const locateUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
        },
        (error) => {
          console.error("Error obteniendo la ubicación:", error.message);
        }
      );
    } else {
      alert("Geolocalización no soportada por este navegador.");
    }
  };

  return (
    <div>
      <IonButton
        onClick={locateUser}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: 1000,
        }}
      >
        Mi ubicación
      </IonButton>

      <MapContainer
        center={[-33.4489, -70.6693]}
        zoom={12}
        style={{ width: "100%", height: "100vh" }}
      >
        <FitBounds bounds={bounds} userLocation={userLocation} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {userLocation && (
          <Marker position={userLocation} icon={customIcon}>
            <Popup>Tu ubicación actual</Popup>
          </Marker>
        )}

        {origin && (
          <Marker position={origin} icon={customIcon}>
            <Popup>Origen</Popup>
          </Marker>
        )}

        {destination && (
          <Marker position={destination} icon={customIcon}>
            <Popup>Destino</Popup>
          </Marker>
        )}

        {route.length > 0 && <Polyline positions={route} color="blue" />}
      </MapContainer>
    </div>
  );
};

export default Maps;
