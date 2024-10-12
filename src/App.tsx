import React from 'react';
import { Route, Redirect, Switch, useHistory, useLocation } from 'react-router-dom';
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
import '@ionic/react/css/palettes/dark.class.css';

/* Theme variables */
import './theme/variables.css';


setupIonicReact();

const App: React.FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route path="/">

          </Route>
        </Switch>
        <AppContent />
      </IonReactRouter>
    </IonApp>
  );
};

const AppContent: React.FC = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isSplashPage = location.pathname === '/splash';
  const isAboutPage = location.pathname === '/about';
  const isMensajesPage = location.pathname === '/mensajes'; // Verifica si estás en la página About
  const isRegistrarmePage = location.pathname === '/registrarme'; // Verifica si estás en la página About
  const isPedidoPage = location.pathname === '/pedido'; // Verifica si estás en la página About

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
              <Redirect from="/" to="/login" />
            </Switch>
          </IonRouterOutlet>

          {/* Aplica una clase CSS condicional para ocultar el IonTabBar en /about */}
          <IonTabBar slot="bottom" className={(isAboutPage || isMensajesPage || isRegistrarmePage) ? 'hidden' : ''}>
            <IonTabButton tab="inicio" href="/inicio">
              <IonIcon aria-hidden="true" icon={home} />
              <IonLabel>Inicio</IonLabel>
            </IonTabButton>
            <IonTabButton tab="recientes" href="/recientes">
              <IonIcon aria-hidden="true" icon={reader} />
              <IonLabel>Recientes</IonLabel>
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
