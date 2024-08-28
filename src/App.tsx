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
import Tab1 from './pages/Tab1';
import Tab2 from './pages/Tab2';
import Tab3 from './pages/Tab3';
import Login from './pages/Login';
import ProgramarViaje from './pages/ProgramarViaje';

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

  return (
    <>
      {!isLoginPage && !isSplashPage && (
        <IonTabs>
          <IonRouterOutlet>
            <Switch>
              <Route exact path="/tab1" component={Tab1} />
              <Route exact path="/tab2" component={Tab2} />
              <Route path="/tab3" component={Tab3} />
              <Route path="/programar-viaje" component={ProgramarViaje} exact={true} />
              <Redirect from="/" to="/login" />
            </Switch>
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton tab="tab1" href="/tab1">
              <IonIcon aria-hidden="true" icon={home} />
              <IonLabel>Inicio</IonLabel>
            </IonTabButton>
            <IonTabButton tab="tab2" href="/tab2">
              <IonIcon aria-hidden="true" icon={reader} />
              <IonLabel>Recientes</IonLabel>
            </IonTabButton>
            <IonTabButton tab="tab3" href="/tab3">
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
