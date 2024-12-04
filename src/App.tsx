import React from 'react';
import { Route, Redirect, Switch, useLocation } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { home, reader, personCircleOutline } from 'ionicons/icons';
import Inicio from './pages/Inicio';
import Recientes from './pages/Recientes';
import Perfil from './pages/Perfil';
import Login from './pages/Login';
import About from './pages/About';
import ProgramarViaje from './pages/ProgramarViaje';
import Mensajes from './pages/Mensajes';
import Registrarme from './pages/Registrarme';
import Pedido from './pages/Pedido';
import IngresarDirecciones from './pages/ingresarDirecciones';
import Detalles_Solicitud from './pages/Detalles_Solicitud';
import Maps from './pages/Maps';
import MetodoPago from './pages/MetodoPago';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import 'leaflet/dist/leaflet.css';

/* Ionic Dark Mode */
import '@ionic/react/css/palettes/dark.css';

/* Theme variables */
import './theme/variables.css';

import { createClient } from "@supabase/supabase-js";
import { UserProvider } from './CAPA DATOS/userContext';

const supabase = createClient("https://ltfqtkcfoumbtomhjluu.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey..."); // Asegúrate de que tu clave esté correctamente configurada

setupIonicReact();

const App: React.FC = () => {
  return (
    <IonApp>
      <UserProvider>
        {/* Eliminamos GoogleMapsLoader y mantenemos IonReactRouter */}
        <IonReactRouter>
          <Switch>
            {/* Definimos las rutas */}
            <Route exact path="/login" component={Login} />
            <Route path="/perfil" component={Perfil} />
          </Switch>
          {/* AppContent debería estar dentro del IonReactRouter si depende del enrutado */}
          <AppContent />
        </IonReactRouter>
      </UserProvider>
    </IonApp>
  );
};

const AppContent: React.FC = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isSplashPage = location.pathname === '/splash';
  const isAboutPage = location.pathname === '/about';
  const isMensajesPage = location.pathname === '/mensajes';
  const isRegistrarmePage = location.pathname === '/registrarme';
  const isPedidoPage = location.pathname === '/pedido';
  const isMetodoPago = location.pathname === '/metodopago';
  const isMaps = location.pathname === '/Maps'

  return (
    <>
      {!isLoginPage && !isSplashPage && (
        <IonTabs>
          <IonRouterOutlet>
            <Switch>
              <Route exact path="/inicio" component={Inicio} />
              <Route exact path="/recientes" component={Recientes} />
              <Route path="/perfil" component={Perfil} />
              <Route exact path="/about" component={About} />
              <Route path="/programar-viaje" component={ProgramarViaje} exact />
              <Route exact path="/mensajes" component={Mensajes} />
              <Route exact path="/registrarme" component={Registrarme} />
              <Route exact path="/pedido" component={Pedido} />
              <Route exact path="/ingresarDirecciones" component={IngresarDirecciones} />
              <Route exact path="/Detalles" component={Detalles_Solicitud} />
              <Route exact path="/Maps" component={Maps} />
              <Route exact path="/MetodoPago" component={MetodoPago} />
              <Redirect from="/" to="/login" />
            </Switch>
          </IonRouterOutlet>

          {/* Aplica una clase CSS condicional para ocultar el IonTabBar en ciertas páginas */}
          <IonTabBar slot="bottom" className={(isAboutPage || isMensajesPage || isRegistrarmePage || isMaps) ? 'hidden' : ''}>
            <IonTabButton tab="recientes" href="/recientes">
              <IonIcon aria-hidden="true" icon={home} />
              <IonLabel>Inicio</IonLabel>
            </IonTabButton>
            <IonTabButton tab="perfil" href="/perfil">
              <IonIcon aria-hidden="true" icon={personCircleOutline} />
              <IonLabel>Perfil</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      )}
      {isLoginPage && <Login />}
    </>
  );
};

export default App;
