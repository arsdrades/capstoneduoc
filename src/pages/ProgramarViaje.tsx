import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonButton } from '@ionic/react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine'; // Asegúrate de que esta línea esté presente
import './Perfil.css'; // Asegúrate de que este archivo contenga los estilos adecuados para tu aplicación

const ProgramarViaje: React.FC = () => {
  const [startAddress, setStartAddress] = useState('');
  const [endAddress, setEndAddress] = useState('');
  const [map, setMap] = useState<L.Map | null>(null);
  const [markerStart, setMarkerStart] = useState<L.Marker | null>(null);
  const [markerEnd, setMarkerEnd] = useState<L.Marker | null>(null);
  const [routingControl, setRoutingControl] = useState<L.Control | null>(null);

  useEffect(() => {
    // Inicializa el mapa cuando el componente se monte
    const mapInstance = L.map('map').setView([-33.4489, -70.6693], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(mapInstance);

    setMap(mapInstance);

    // Limpia el mapa al desmontar el componente
    return () => {
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, []);

  const handleSearch = async () => {
    if (map && startAddress && endAddress) {
      try {
        // Llama a la API de Nominatim para obtener las coordenadas de la dirección de inicio
        const startResponse = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(startAddress)}&format=json&limit=1`);
        const startData = await startResponse.json();

        // Llama a la API de Nominatim para obtener las coordenadas de la dirección de destino
        const endResponse = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(endAddress)}&format=json&limit=1`);
        const endData = await endResponse.json();

        if (startData.length > 0 && endData.length > 0) {
          const startLatLng: [number, number] = [parseFloat(startData[0].lat), parseFloat(startData[0].lon)];
          const endLatLng: [number, number] = [parseFloat(endData[0].lat), parseFloat(endData[0].lon)];

          // Centra el mapa en la ubicación de inicio
          map.setView(startLatLng, 13);

          // Si ya hay marcadores, los elimina
          if (markerStart) {
            map.removeLayer(markerStart);
          }
          if (markerEnd) {
            map.removeLayer(markerEnd);
          }

          // Añade nuevos marcadores en las ubicaciones encontradas
          const newMarkerStart = L.marker(startLatLng).addTo(map);
          const newMarkerEnd = L.marker(endLatLng).addTo(map);

          setMarkerStart(newMarkerStart);
          setMarkerEnd(newMarkerEnd);

          // Llama a la API de OpenRouteService para obtener la ruta
          const orsApiKey = '5b3ce3597851110001cf6248fa1f28d215ec4d24b565852484a4cb5f'; // Tu API Key de OpenRouteService
          const routeResponse = await fetch(`https://api.openrouteservice.org/v2/directions/foot-walking?api_key=${orsApiKey}&start=${startLatLng.join(',')}&end=${endLatLng.join(',')}`);
          const routeData = await routeResponse.json();

          if (routeData.routes && routeData.routes[0]) {
            const route = routeData.routes[0];
            const routeCoordinates = route.geometry.coordinates.map((coord: number[]) => [coord[1], coord[0]]);

            // Si ya hay una ruta, la elimina
            if (routingControl) {
              map.removeControl(routingControl);
            }

            // Añade la nueva ruta al mapa
            const newRoutingControl = L.Routing.control({
              waypoints: [
                L.latLng(startLatLng[0], startLatLng[1]),
                L.latLng(endLatLng[0], endLatLng[1])
              ],
              routeWhileDragging: true
            }).addTo(map);

            setRoutingControl(newRoutingControl);

            // Muestra la distancia de la ruta
            console.log('Distancia de la ruta:', route.summary.distance / 1000, 'km');
          } else {
            console.error('Ruta no encontrada.');
          }
        } else {
          console.error('Dirección no encontrada.');
        }
      } catch (error) {
        console.error('Error al buscar la dirección o la ruta:', error);
      }
    }
  };

  return (
    <IonPage>
      <IonHeader className='principal'>
        <IonToolbar color="primary">
          <IonTitle>Bienvenidos a Bolt</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonItem>
          <IonLabel color="dark" position="stacked">Desde</IonLabel>
          <IonInput 
            value={startAddress} 
            onIonInput={(e: any) => setStartAddress(e.target.value)} 
            color="dark" 
            style={{ color: 'black' }} 
          />
        </IonItem>

        <IonItem>
          <IonLabel color="dark" position="stacked">Hasta</IonLabel>
          <IonInput 
            value={endAddress} 
            onIonInput={(e: any) => setEndAddress(e.target.value)} 
            color="dark" 
            style={{ color: 'black' }} 
          />
        </IonItem>

        <IonButton onClick={handleSearch} color="primary">
          Buscar Ruta
        </IonButton>

        <IonItem>
          {/* Contenedor del mapa */}
          <div id="map" style={{ height: '400px', width: '100%' }} />
        </IonItem>

        <div
          onClick={() => console.log('Estableciendo ubicación en el mapa...')}
          style={{
            position: 'fixed',
            bottom: '70px',
            width: '100%',
            textAlign: 'center',
            color: '#3880ff',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Establecer Ubicación en el Mapa
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ProgramarViaje;
