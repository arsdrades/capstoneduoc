import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { LatLngBounds } from "leaflet";
import { supabase } from "../CAPA DATOS/supabaseClient";
import sedanIcon from "../icons/sedan.png";

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
  const [driverLocation, setDriverLocation] = useState<[number, number] | null>(null);
  const [driverDetails, setDriverDetails] = useState<{ nombre: string; apellido: string } | null>(null);
  const [origin, setOrigin] = useState<[number, number] | null>(null);
  const [destination, setDestination] = useState<[number, number] | null>(null);
  const [route, setRoute] = useState<L.LatLngTuple[]>([]);
  const [bounds, setBounds] = useState<LatLngBounds | null>(null);

  const fetchDriverLocation = async () => {
    try {
      const { data, error } = await supabase
        .from("driver_locations")
        .select("latitude, longitude, driver_id")
        .eq("driver_id", "driver-123")
        .single();

      if (error) {
        console.error("Error obteniendo la ubicación del conductor:", error.message);
        setDriverLocation(null);
        setDriverDetails(null);
        return;
      }

      if (data && data.latitude && data.longitude) {
        setDriverLocation([data.latitude, data.longitude]);
        fetchDriverDetails(data.driver_id); // Obtener detalles del conductor
      } else {
        setDriverLocation(null);
        setDriverDetails(null);
      }
    } catch (error) {
      console.error("Error al consultar la ubicación del conductor:", error);
      setDriverLocation(null);
      setDriverDetails(null);
    }
  };

  const fetchDriverDetails = async (driverId: string) => {
    try {
      const { data, error } = await supabase
        .from("usuarios_conductores")
        .select("nombre, apellido")
        .eq("driver_id", driverId)
        .single();

      if (error) {
        console.error("Error obteniendo los detalles del conductor:", error.message);
        setDriverDetails(null);
        return;
      }

      if (data) {
        setDriverDetails({ nombre: data.nombre, apellido: data.apellido });
      }
    } catch (error) {
      console.error("Error al consultar los detalles del conductor:", error);
      setDriverDetails(null);
    }
  };

  useEffect(() => {
    fetchDriverLocation();
    const interval = setInterval(fetchDriverLocation, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const storedOrigin = sessionStorage.getItem("direccionOrigen") || "";
        const storedDestination = sessionStorage.getItem("direccionDestino") || "";

        const originCoords = await geocode(storedOrigin);
        const destinationCoords = await geocode(storedDestination);

        if (originCoords) setOrigin(originCoords);
        if (destinationCoords) setDestination(destinationCoords);

        if (originCoords && destinationCoords) {
          await fetchRoute(originCoords, destinationCoords);
        }
      } catch (error) {
        console.error("Error al cargar ubicaciones:", error);
      }
    };

    fetchLocations();
  }, []);

  useEffect(() => {
    const calculateBounds = () => {
      const allPoints: L.LatLngTuple[] = [];
      if (driverLocation) allPoints.push(driverLocation);
      if (origin) allPoints.push(origin);
      if (destination) allPoints.push(destination);
      if (route.length > 0) allPoints.push(...route);

      if (allPoints.length > 0) {
        setBounds(L.latLngBounds(allPoints));
      }
    };

    calculateBounds();
  }, [driverLocation, origin, destination, route]);

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

  const geocode = async (address: string): Promise<[number, number] | null> => {
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
      console.error("Error al geocodificar la dirección:", error);
      return null;
    }
  };

  return (
    <div style={{ position: "relative", height: "100vh" }}>
      {!driverLocation && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "20%",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <p style={{ fontSize: "18px", fontWeight: "bold", color: "#333" }}>
            Buscando fletes en el área...
          </p>
        </div>
      )}
      <MapContainer
        center={[-33.4489, -70.6693]}
        zoom={12}
        style={{ width: "100%", height: "100vh" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {driverLocation && (
          <Marker position={driverLocation} icon={driverIcon}>
            <Popup>
              {driverDetails ? (
                <>
                  <p><strong>Conductor:</strong> {driverDetails.nombre} {driverDetails.apellido}</p>
                </>
              ) : (
                <p>Cargando información del conductor...</p>
              )}
            </Popup>
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
