import {
  IonText,
  IonCard,
  IonItem,
  IonLabel,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonInput,
  IonModal,
  IonPopover,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonList,
  IonItemDivider
} from '@ionic/react';
import { useState, useEffect } from 'react';
import { trash, helpCircle } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import './Recientes.css';
import { guardarProducto, obtenerProductos } from '../CAPA DATOS/supabaseClient';

type Producto = {
  nombre: string;
  alto: number;
  ancho: number;
  largo: number;
  cantidad: number;
  clasificacion?: string;
  costo?: number;
};

const Recientes: React.FC = () => {
  const [productoSeleccionado, setProductoSeleccionado] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const [popoverEvent, setPopoverEvent] = useState<MouseEvent | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [nuevoProducto, setNuevoProducto] = useState<Producto>({ nombre: '', alto: 0, ancho: 0, largo: 0, cantidad: 1 });
  const [productosAgregados, setProductosAgregados] = useState<Producto[]>([]);
  const [productosGuardados, setProductosGuardados] = useState<Producto[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [filteredProductos, setFilteredProductos] = useState<Producto[]>([]);
  const [popoverState, setPopoverState] = useState<{ isOpen: boolean, content: string, event: any }>({ isOpen: false, content: '', event: undefined });
  const [costoTotal, setCostoTotal] = useState<number>(0);

  const history = useHistory();

  useEffect(() => {
    localStorage.removeItem('costoTotal');
    setCostoTotal(0);
    
    const fetchProductos = async () => {
      const productos = await obtenerProductos();
      if (productos && Array.isArray(productos)) {
        setProductosGuardados(
          productos.map((producto: any) => ({
            nombre: producto.nombre,
            alto: producto.alto,
            ancho: producto.ancho,
            largo: producto.largo,
            cantidad: 1
          }))
        );
      }
    };
    fetchProductos();

    const costoGuardado = localStorage.getItem('costoTotal');
    if (costoGuardado) {
      setCostoTotal(parseInt(costoGuardado, 10));
    }
  }, []);

  const abrirModal = () => setShowModal(true);
  const cerrarModal = () => {
    setShowModal(false);
    setNuevoProducto({ nombre: '', alto: 0, ancho: 0, largo: 0, cantidad: 1 });
    setError(null);
    setSearchText('');
  };

  useEffect(() => {
    if (searchText === '') {
      setFilteredProductos(productosGuardados);
    } else {
      setFilteredProductos(
        productosGuardados.filter(producto =>
          producto.nombre.toLowerCase().includes(searchText.toLowerCase())
        )
      );
    }
  }, [searchText, productosGuardados]);

  const handleProductoSelect = (producto: Producto) => {
    setProductoSeleccionado(producto.nombre);
    const productoExistente = productosAgregados.find((p) => p.nombre === producto.nombre);
    if (!productoExistente) {
      setProductosAgregados([...productosAgregados, producto]);
    }
    setShowPopover(false);
  };

  const handleProductoChange = (e: CustomEvent) => {
    const value = e.detail.value;
    setProductoSeleccionado(value);

    if (value === "otro") {
      abrirModal();
    } else {
      const productoSeleccionado = productosGuardados.find((producto) => producto.nombre === value);

      if (productoSeleccionado) {
        const producto = {
          nombre: productoSeleccionado.nombre,
          alto: productoSeleccionado.alto,
          ancho: productoSeleccionado.ancho,
          largo: productoSeleccionado.largo,
          cantidad: 1
        };

        setProductosAgregados([...productosAgregados, producto]);
      }
    }
  };

  const handleGuardarProducto = async () => {
    try {
      const producto = {
        nombre: nuevoProducto.nombre,
        alto: nuevoProducto.alto,
        ancho: nuevoProducto.ancho,
        largo: nuevoProducto.largo,
        cantidad: nuevoProducto.cantidad
      };

      const data = await guardarProducto(
        producto.nombre,
        producto.alto,
        producto.ancho,
        producto.largo
      );

      if (data.success) {
        setProductosAgregados([...productosAgregados, producto]);
        setProductosGuardados([...productosGuardados, { ...producto, cantidad: 1 }]);
        setError(null);
        cerrarModal();
        console.log("Producto guardado exitosamente:", data);
      } else {
        setError('El producto ya existe, revise bien el listado.');
      }
    } catch (error) {
      console.error('Error en la inserción:', error);
      setError('Ocurrió un error al guardar el producto.');
    }
  };

  const handleEliminarProducto = (index: number) => {
    const productosActualizados = productosAgregados.filter((_, i) => i !== index);
    setProductosAgregados(productosActualizados);
  };

  const handleCantidadChange = (index: number, operacion: 'incrementar' | 'decrementar') => {
    const productosActualizados = [...productosAgregados];
    if (operacion === 'incrementar') {
      productosActualizados[index].cantidad += 1;
    } else if (operacion === 'decrementar' && productosActualizados[index].cantidad > 1) {
      productosActualizados[index].cantidad -= 1;
    }
    setProductosAgregados(productosActualizados);
  };

  const clasificarProducto = (alto: number, ancho: number, largo: number): { clasificacion: string, costo: number } => {
    const volumen = alto * ancho * largo;
    if (alto <= 30 && ancho <= 30 && largo <= 30 && volumen <= 27000) {
      return { clasificacion: "Pequeño", costo: 15000 };
    } else if (
      (alto <= 80 && ancho <= 80 && largo <= 80 && volumen <= 512000) || 
      (alto > 30 && ancho > 30 && largo > 30)
    ) {
      return { clasificacion: "Mediano", costo: 25000 };
    } else {
      return { clasificacion: "Grande", costo: 35000 };
    }
  };

  const mostrarPopover = (e: any, producto: Producto) => {
    const { clasificacion, costo } = clasificarProducto(producto.alto, producto.ancho, producto.largo);

    const nuevoCostoTotal = costoTotal + costo;
    setCostoTotal(nuevoCostoTotal);
    localStorage.setItem('costoTotal', nuevoCostoTotal.toString());

    console.log("Costo total acumulado:", nuevoCostoTotal);

    const productosSeleccionados = JSON.parse(localStorage.getItem('productosSeleccionados') || '[]');
    
    productosSeleccionados.push({
      ...producto,
      clasificacion,
      costo: parseInt(costo.toString(), 10),
      cantidad: parseInt(producto.cantidad.toString(), 10)
    });
    
    localStorage.setItem('productosSeleccionados', JSON.stringify(productosSeleccionados));

    setPopoverState({
      isOpen: true,
      content: `Alto: ${producto.alto} cm\nAncho: ${producto.ancho} cm\nLargo: ${producto.largo} cm\nClasificación: ${clasificacion}\nCosto: $${costo}`,
      event: e.nativeEvent
    });
  };

  const handleContinuar = () => {
    // Actualizamos los productos seleccionados en el localStorage con toda la información necesaria
    const productosConClasificacionYCosto = productosAgregados.map((producto) => {
      const { clasificacion, costo } = clasificarProducto(producto.alto, producto.ancho, producto.largo);
      return {
        ...producto,
        clasificacion,
        costo
      };
    });
  
    localStorage.setItem('productosSeleccionados', JSON.stringify(productosConClasificacionYCosto));
    history.push('/ingresarDirecciones');
  };

  return (
    <IonPage>
      <IonHeader class='principal'>
        <IonToolbar color="primary">
          <IonTitle>Inicio</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen >
        <IonItem className='padding fade-in-down'>
          <div className="circular-title">¿Qué vas a transportar hoy?</div>
        </IonItem>

        {productosAgregados.length > 0 && (
          <IonCard>
            <IonLabel color="primary" style={{ display: 'flex', justifyContent: 'center', fontWeight: 'bold', fontSize: 18, padding: 10 }}>
              Productos Agregados
            </IonLabel>
            {productosAgregados.map((producto, index) => (
              <IonItem key={index} lines="full" style={{ marginBottom: '8px' }}>
                <IonGrid>
                  <IonRow>
                    <IonCol size="1" style={{ display: 'flex', alignItems: 'center', fontSize: 16 }}>
                      <IonIcon
                        color='secondary'
                        icon={helpCircle}
                        size='large'
                        className="ion-icon-help"
                        style={{ minWidth: '25px', margin: 0 }}
                        onClick={(e) => mostrarPopover(e, producto)}
                      />
                    </IonCol>
                    <IonCol size="4" style={{ display: 'flex', alignItems: 'center', padding: '0 8px' }}>
                      <IonLabel style={{ fontSize: 16, fontWeight: 'bold' }}>Producto:</IonLabel>
                    </IonCol>
                    <IonCol size="4" style={{ display: 'flex', alignItems: 'center', padding: '0 8px' }}>
                      <IonLabel style={{ fontSize: 16 }}>{producto.nombre}</IonLabel>
                    </IonCol>
                  </IonRow>

                  <IonRow>
                    <IonCol size="7" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        border: '1px solid #ccc',
                        borderRadius: '12px',
                        padding: '4px',
                        backgroundColor: '#f0f0f0',
                        maxWidth: '150px',
                        maxHeight: '30px',
                      }}>
                        <IonButton
                          size="small"
                          onClick={() => handleCantidadChange(index, 'decrementar')}
                          style={{
                            minWidth: '30px',
                            padding: '2px',
                            margin: 0,
                            borderRadius: '8px 0 0 8px'
                          }}
                        >
                          -
                        </IonButton>
                        <IonInput
                          type="number"
                          value={producto.cantidad}
                          readonly
                          style={{
                            textAlign: 'center',
                            margin: '0 8px',
                            width: '40px',
                            fontSize: '16px'
                          }}
                        />
                        <IonButton
                          size="small"
                          onClick={() => handleCantidadChange(index, 'incrementar')}
                          style={{
                            minWidth: '30px',
                            padding: '2px',
                            margin: 0,
                            borderRadius: '0 8px 8px 0'
                          }}
                        >
                          +
                        </IonButton>
                        <IonButton
                          fill="clear"
                          color="danger"
                          size="default"
                          onClick={() => handleEliminarProducto(index)}
                          style={{
                            minWidth: '50px',
                            margin: 0,
                          }}
                        >
                          <IonIcon icon={trash} />
                        </IonButton>
                      </div>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonItem>
            ))}
          </IonCard>
        )}

        <IonButton className="padding fade-in-down" expand="block" onClick={(e) => { setPopoverEvent(e.nativeEvent); setShowPopover(true); }}>
          Seleccionar Producto
        </IonButton>

        <IonPopover
          isOpen={showPopover}
          event={popoverEvent}
          alignment="center"
          onDidDismiss={() => setShowPopover(false)}
        >
          <IonContent>
            <IonItemDivider>
              <IonLabel>Buscar y seleccionar producto</IonLabel>
            </IonItemDivider>
            <IonItem>
              <IonInput
                placeholder="Buscar producto"
                value={searchText}
                onIonInput={(e) => setSearchText(e.detail.value!)}
              />
            </IonItem>

            <IonList>
              {filteredProductos.map((producto, index) => (
                <IonItem key={index} button onClick={() => handleProductoSelect(producto)}>
                  <IonLabel>{producto.nombre}</IonLabel>
                </IonItem>
              ))}
              <IonItem button onClick={abrirModal}>
                <IonLabel>Otro</IonLabel>
              </IonItem>
            </IonList>
          </IonContent>
        </IonPopover>

        <IonButton
          className="fade-in-down custom-button"
          expand="full"
          style={{
            position: 'fixed',
            bottom: '3rem',
            left: '27%',
            transform: 'translateX(-50%)',
            width: '50%',
            fontSize: '18px',
            margin: '0'
          }}
          onClick={handleContinuar}
          disabled={productosAgregados.length === 0}
        >
          Continuar
        </IonButton>

        <IonModal isOpen={showModal} onDidDismiss={cerrarModal}>
          <IonHeader>
            <IonToolbar color="primary">
              <IonTitle>Agregar Producto</IonTitle>
              <IonButton slot="end" onClick={cerrarModal}>Cerrar</IonButton>
            </IonToolbar>
          </IonHeader>

          <IonContent className="ion-padding">
            <IonInput
              value={nuevoProducto.nombre}
              placeholder="Nombre del producto"
              onIonInput={e => setNuevoProducto({ ...nuevoProducto, nombre: e.detail.value! })}
            />
            <IonInput
              value={nuevoProducto.ancho}
              placeholder="Ancho (cm)"
              onIonInput={e => setNuevoProducto({ ...nuevoProducto, ancho: parseFloat(e.detail.value!) })}
            />
            <IonInput
              value={nuevoProducto.alto}
              placeholder="Alto (cm)"
              onIonInput={e => setNuevoProducto({ ...nuevoProducto, alto: parseFloat(e.detail.value!) })}
            />
            <IonInput
              value={nuevoProducto.largo}
              placeholder="Largo (cm)"
              onIonInput={e => setNuevoProducto({ ...nuevoProducto, largo: parseFloat(e.detail.value!) })}
            />

            {error && (
              <IonText color="danger" style={{ display: 'block', marginTop: '10px', backgroundColor: '#ffe6e6', padding: '10px', borderRadius: '5px' }}>
                {error}
              </IonText>
            )}

            <IonButton expand="block" color="primary" onClick={handleGuardarProducto}>Guardar</IonButton>
          </IonContent>
        </IonModal>

        <IonPopover isOpen={popoverState.isOpen} event={popoverState.event} onDidDismiss={() => setPopoverState({ isOpen: false, content: '', event: undefined })}>
          <p style={{ padding: '10px', whiteSpace: 'pre-wrap' }}>{popoverState.content}</p>
        </IonPopover>
      </IonContent>
    </IonPage>
  );
};

export default Recientes;
