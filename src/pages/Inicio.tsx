import React, { useEffect, useState } from 'react';
import { IonCard, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom'; // Importa useHistory
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import './Perfil.css';

const Inicio: React.FC = () => {
  const [startAddress, setStartAddress] = useState('');
  const [endAddress, setEndAddress] = useState('');
  const [map, setMap] = useState<L.Map | null>(null);
  const [markerStart, setMarkerStart] = useState<L.Marker | null>(null);
  const [markerEnd, setMarkerEnd] = useState<L.Marker | null>(null);
  const [routingControl, setRoutingControl] = useState<L.Control | null>(null);
  const [totalCost, setTotalCost] = useState<number | null>(null);
  const history = useHistory(); // Usa useHistory aquí

  useEffect(() => {
    const mapInstance = L.map('map').setView([-33.4489, -70.6693], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(mapInstance);

    setMap(mapInstance);

    return () => {
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, []);

  const handleSearch = async () => {
    if (map && startAddress && endAddress) {
      try {
        const startResponse = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(startAddress)}&format=json&limit=1`);
        const startData = await startResponse.json();

        const endResponse = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(endAddress)}&format=json&limit=1`);
        const endData = await endResponse.json();

        if (startData.length > 0 && endData.length > 0) {
          const startLatLng: [number, number] = [parseFloat(startData[0].lat), parseFloat(startData[0].lon)];
          const endLatLng: [number, number] = [parseFloat(endData[0].lat), parseFloat(endData[0].lon)];

          map.setView(startLatLng, 13);

          if (markerStart) {
            map.removeLayer(markerStart);
          }
          if (markerEnd) {
            map.removeLayer(markerEnd);
          }

          const newMarkerStart = L.marker(startLatLng).addTo(map);
          const newMarkerEnd = L.marker(endLatLng).addTo(map);

          setMarkerStart(newMarkerStart);
          setMarkerEnd(newMarkerEnd);

          const orsApiKey = '5b3ce3597851110001cf6248fa1f28d215ec4d24b565852484a4cb5f';
          const routeResponse = await fetch(`https://api.openrouteservice.org/v2/directions/driving-car?api_key=${orsApiKey}&start=${startLatLng.join(',')}&end=${endLatLng.join(',')}`);

          if (!routeResponse.ok) {
            const errorData = await routeResponse.json();
            console.error('Error al obtener la ruta:', errorData);
            return;
          }

          const routeData = await routeResponse.json();

          if (routeData.routes && routeData.routes[0]) {
            const route = routeData.routes[0];
            const routeCoordinates = route.geometry.coordinates.map((coord: number[]) => [coord[1], coord[0]]);

            if (routingControl) {
              map.removeControl(routingControl);
            }

            const newRoutingControl = L.Routing.control({
              waypoints: [
                L.latLng(startLatLng[0], startLatLng[1]),
                L.latLng(endLatLng[0], endLatLng[1])
              ],
              routeWhileDragging: true
            }).addTo(map);

            setRoutingControl(newRoutingControl);

            const distanceInKm = route.summary.distance / 1000;
            const cost = distanceInKm * 2000;
            console.log('Distancia de la ruta:', distanceInKm, 'km');
            console.log('Costo estimado de la ruta:', cost, 'pesos');
            setTotalCost(cost); // Establece el costo total aquí
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

  const handlePedido = (): void => {
    history.push('/pedido'); // Redirige a la página "Registrarme"
  };

  return (
    <IonPage>
      <IonHeader className='principal'>
        <IonToolbar color="primary">
          <IonTitle>¿Para donde necesitas el envío?</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonCard style={{  color: '#132d46', padding: 0 }}>
          <IonItem lines="none" style={{ '--background': 'transparent' }}>
            <IonLabel  position="stacked">Desde</IonLabel>
            <IonInput
              value={startAddress}
              onIonInput={(e: any) => setStartAddress(e.target.value)}
              color='#01c380'
            />
          </IonItem>

          <IonItem lines="none" style={{ '--background': 'transparent' }}>
            <IonLabel  position="stacked">Hasta</IonLabel>
            <IonInput
              value={endAddress}
              onIonInput={(e: any) => setEndAddress(e.target.value)}
              color="#01c380"
            />
          </IonItem>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <IonButton onClick={handleSearch} color="primary">
              Buscar Ruta
            </IonButton>
            <IonButton onClick={handlePedido} color="primary">
              Agregar Productos
            </IonButton>
          </div>

          <IonItem lines="none" style={{ '--background': 'transparent' }}>
            <div id="map" style={{ height: '300px', width: '100%' }} />
          </IonItem>

          {totalCost !== null && (
            <div style={{ textAlign: 'center', color: '#01c380', marginTop: '20px' }}>
              <p><strong>Costo del envío:</strong> ${totalCost.toFixed(0)} CLP</p>
            </div>
          )}

          <div
            onClick={() => console.log('Estableciendo ubicación en el mapa...')}
            style={{
              position: 'fixed',
              bottom: '70px',
              width: '100%',
              textAlign: 'center',
              color: '#01c380',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Establecer Ubicación en el Mapa
          </div>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Inicio;
