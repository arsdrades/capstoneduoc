import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import polyline from '@mapbox/polyline';
import './Inicio.css';
import { supabase } from '../CAPA DATOS/supabaseClient';
import { useUser } from '../CAPA DATOS/userContext'

const Inicio: React.FC = () => {
  const [startAddress, setStartAddress] = useState('');
  const [endAddress, setEndAddress] = useState('');
  const [map, setMap] = useState<L.Map | null>(null);
  const [markerStart, setMarkerStart] = useState<L.Marker | null>(null);
  const [markerEnd, setMarkerEnd] = useState<L.Marker | null>(null);
  const [driverMarker, setDriverMarker] = useState<L.Marker | null>(null);
  const [driverInfo, setDriverInfo] = useState<string | null>(null);
  const [routePolyline, setRoutePolyline] = useState<L.Polyline | null>(null);
  const [totalCostRuta, setTotalCostRuta] = useState<number | null>(null);
  const [totalPedido, setTotalPedido] = useState<number | null>(null);
  const [total, setTotal] = useState<number | null>(null);
  const [driverName, setDriverName] = useState<string | null>(null);
  const [driverType, setDriverType] = useState<string | null>(null);
  const [driverDistance, setDriverDistance] = useState<string | null>(null);
  const [driverFoto, setDriverFoto] = useState<string | null>(null);
  const history = useHistory();
  const orsApiKey = '5b3ce3597851110001cf62485a1eb994cc374ba49c1aa6e890c23343';

  useEffect(() => {
    const mapContainer = document.getElementById('map');
    if (mapContainer) {
      const mapInstance = L.map(mapContainer).setView([-33.4489, -70.6693], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapInstance);

      setMap(mapInstance);

      const checkMapVisibility = () => {
        if (mapContainer.clientWidth > 0 && mapContainer.clientHeight > 0) {
          mapInstance.invalidateSize();
        } else {
          setTimeout(checkMapVisibility, 100);
        }
      };

      checkMapVisibility();

      // Recuperar datos del pedido y la ruta desde sessionStorage
      const costoTotalPedido = sessionStorage.getItem('costoTotalPedido');
      if (costoTotalPedido) {
        setTotalPedido(parseFloat(costoTotalPedido));
      }

      const costoRutaGuardado = sessionStorage.getItem('costoRuta');
      const rutaGuardada = sessionStorage.getItem('rutaGuardada');
      const startCoords = sessionStorage.getItem('startCoords');
      const endCoords = sessionStorage.getItem('endCoords');

      if (costoRutaGuardado && rutaGuardada && startCoords && endCoords && mapInstance) {
        const routeCoordinates = JSON.parse(rutaGuardada);
        const costoRuta = parseFloat(costoRutaGuardado);
        const [startLat, startLng] = JSON.parse(startCoords);
        const [endLat, endLng] = JSON.parse(endCoords);

        const newMarkerStart = L.marker([startLat, startLng]).addTo(mapInstance);
        const newMarkerEnd = L.marker([endLat, endLng]).addTo(mapInstance);
        setMarkerStart(newMarkerStart);
        setMarkerEnd(newMarkerEnd);

        const polylineRoute = L.polyline(routeCoordinates, {
          color: '#6FA1EC',
          weight: 4
        }).addTo(mapInstance);

        setRoutePolyline(polylineRoute);
        setTotalCostRuta(costoRuta);

        // Ajustar el mapa para que encaje la ruta guardada con un pequeño retraso para asegurar que se renderice correctamente
        setTimeout(() => {
          mapInstance.fitBounds(polylineRoute.getBounds());
        }, 500);
      }

      const handleBeforeUnload = () => {
        sessionStorage.removeItem('costoTotalPedido');
        sessionStorage.removeItem('costoRuta');
        sessionStorage.removeItem('rutaGuardada');
        sessionStorage.removeItem('startCoords');
        sessionStorage.removeItem('endCoords');
      };

      window.addEventListener('beforeunload', handleBeforeUnload);

      return () => {
        if (mapInstance) {
          mapInstance.remove();
        }
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, []);

  useEffect(() => {
    if (totalCostRuta !== null && totalPedido !== null) {
      setTotal(totalCostRuta + totalPedido);
    }
  }, [totalCostRuta, totalPedido]);




  //BUSCAR FLETE

  const handleBuscarFlete = async (): Promise<void> => {
    if (map && markerStart && markerEnd) {
        // Obtener las coordenadas de inicio y fin
        const startLatLng = markerStart.getLatLng();
        const endLatLng = markerEnd.getLatLng();
        const midLat = (startLatLng.lat + endLatLng.lat) / 2;
        const midLng = (startLatLng.lng + endLatLng.lng) / 2;

        // Recuperar los datos del usuario desde `localStorage`
        const userId = localStorage.getItem('userId');
        const userId2 = '2ee28127-c2bd-4fbc-b208-b5cf7efafb7e';
        const nombreUsuario = localStorage.getItem('nombreUsuario');
        const apellidoUsuario = localStorage.getItem('apellidoUsuario');

        if (!userId || !nombreUsuario || !apellidoUsuario) {
            console.error('No se encontraron todos los datos del usuario en el almacenamiento local.');
            return;
        }

        // Construir el nombre completo del usuario
        const nombreCompleto = `${nombreUsuario} ${apellidoUsuario}`;

        // Concatenar ambas coordenadas en un solo string
        const coordenadas = `${startLatLng.lat},${startLatLng.lng} - ${endLatLng.lat},${endLatLng.lng}`;

        // Obtener dimensiones del producto como float desde sessionStorage
        const ancho = parseFloat(sessionStorage.getItem('ancho') || '0');
        const largo = parseFloat(sessionStorage.getItem('largo') || '0');
        const alto = parseFloat(sessionStorage.getItem('alto') || '0');

        // Insertar los datos en `solicitud_transporte`
        try {
            const { data, error } = await supabase.from('solicitud_transporte').insert([{

                user_client_id: userId,
                user_id: userId2,
                nombre_usuario: nombreCompleto,
                coordenadas,
                ancho,
                largo,
                alto,
            }]);

            if (error) throw error;
            console.log('Datos almacenados en Supabase:', data);
        } catch (error) {
            console.error('Error al almacenar en Supabase:', error);
        }

        // Colocar el marcador del conductor en el mapa
        if (driverMarker) {
            map.removeLayer(driverMarker);
        }

        const newDriverMarker = L.marker([midLat, midLng], {
            icon: L.icon({
                iconUrl: 'https://maps.google.com/mapfiles/kml/shapes/cabs.png',
                iconSize: [32, 32],
            }),
        }).addTo(map);

        setDriverMarker(newDriverMarker);
        map.setView([midLat, midLng], 14);

        // Configuración del evento click para mostrar la información del conductor
        newDriverMarker.on('click', () => {
            const distanceToDriver = map.distance(startLatLng, newDriverMarker.getLatLng()) / 1000;
            setDriverName('Pedro González');
            setDriverType('Flete Grande');
            setDriverDistance(`${distanceToDriver.toFixed(2)} km`);
            setDriverFoto('https://cdn-icons-png.flaticon.com/512/5283/5283021.png');
        });
    }
};
  
  

  

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

          const routeResponse = await fetch(`https://api.openrouteservice.org/v2/directions/driving-car`, {
            method: 'POST',
            headers: {
              'Authorization': orsApiKey,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              coordinates: [[startLatLng[1], startLatLng[0]], [endLatLng[1], endLatLng[0]]],
              instructions: false,
              units: 'km',
              geometry: true
            })
          });

          if (!routeResponse.ok) {
            const errorData = await routeResponse.json();
            console.error('Error al obtener la ruta:', errorData, routeResponse.status);
            return;
          }

          const routeData = await routeResponse.json();

          if (routeData.routes && routeData.routes[0]) {
            const route = routeData.routes[0];
            const routeCoordinates = polyline.decode(route.geometry);

            if (routeCoordinates.length > 0) {
              if (routePolyline) {
                map.removeLayer(routePolyline);
              }

              const polylineRoute = L.polyline(routeCoordinates.map(coord => [coord[0], coord[1]]), {
                color: '#6FA1EC',
                weight: 4
              }).addTo(map);

              map.fitBounds(polylineRoute.getBounds());
              setRoutePolyline(polylineRoute);

              const distanceInKm = route.summary.distance;
              const cost = distanceInKm * 2000;
              setTotalCostRuta(cost);

              // Guardar datos de la ruta en sessionStorage
              sessionStorage.setItem('rutaGuardada', JSON.stringify(routeCoordinates.map(coord => [coord[0], coord[1]])));
              sessionStorage.setItem('costoRuta', cost.toString());
              sessionStorage.setItem('startCoords', JSON.stringify(startLatLng));
              sessionStorage.setItem('endCoords', JSON.stringify(endLatLng));
            } else {
              console.error('No se encontraron coordenadas en la geometría de la ruta.');
            }
          } else {
            console.error('Ruta no encontrada o estructura de datos incorrecta.', routeData);
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
    history.push('/pedido');
  };

  return (
    <IonPage>
      <IonContent fullscreen className="map-container">
        <div id="map" className="map-background" />
        <div className="overlay-container">
          <IonItem lines="none">
            <IonLabel position="stacked">Desde</IonLabel>
            <IonInput
              value={startAddress}
              onIonInput={(e: any) => setStartAddress(e.target.value)}
            />
          </IonItem>
  
          <IonItem lines="none">
            <IonLabel position="stacked">Hasta</IonLabel>
            <IonInput
              value={endAddress}
              onIonInput={(e: any) => setEndAddress(e.target.value)}
            />
          </IonItem>
  
          <div className="button-container">
            <IonButton className="boton-buscar" expand="block" onClick={handleSearch}>
              Buscar Ruta
            </IonButton>
            <IonButton className="boton-pedido" expand="block" color="secondary" onClick={handlePedido}>
              Ir a Pedido
            </IonButton>
          </div>
          
        </div>
        <div>
          {/* Div para los datos de costos totales */}
          {(totalCostRuta !== null || totalPedido !== null || total !== null) && (
            <div className="cost-summary">
              <div className="cost-item-container">
                {driverName && driverType && driverDistance && driverFoto && (
                  <div className="driver-info-box">
                    <div className="driver-info-content">
                      <div className="driver-details">
                        <p>{driverName}</p>
                        <p>{driverType}</p>
                        <p>{driverDistance}</p>
                      </div>
                      <img src={driverFoto} alt="Foto del conductor" className="driver-photo" />
                    </div>
                  </div>
                )}
                {totalCostRuta !== null && (
                  <div className="cost-item">
                    Total ruta: ${totalCostRuta.toFixed(0)} CLP
                  </div>
                )}
  
                {totalPedido !== null && (
                  <div className="cost-item">
                    Total pedido: ${totalPedido.toFixed(0)} CLP
                  </div>
                )}
  
                {total !== null && (
                  <div className="cost-item">
                    Total: ${total.toFixed(0)} CLP
                  </div>
                )}
                
              </div>
  
              <div className="button-container-inside">
                <IonButton
                  expand="block"
                  color={total !== null ? 'success' : 'tertiary'}
                  onClick={handleBuscarFlete}
                  disabled={total === null}
                >
                  Buscar Flete
                </IonButton>
              </div>
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};


export default Inicio;
