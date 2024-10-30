import React, { useState } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { IonList, IonSelect, IonSelectOption, IonCard, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import './Pedido.css';

const Pedido: React.FC = () => {
    const [alto, setAlto] = useState('');
    const [ancho, setAncho] = useState('');
    const [largo, setLargo] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [totalCost, setTotalCost] = useState<number | null>(null);
    const [tipoProducto, setTipoProducto] = useState<string | null>(null);
    const [tipoTransporte, setTipoTransporte] = useState<string | null>(null);
    const history = useHistory();

    /*const takePicture = async () => {
        const image = await Camera.getPhoto({
            quality: 90,
            allowEditing: false,
            resultType: CameraResultType.DataUrl,
            source: CameraSource.Prompt
        });

        setImage(image.dataUrl);
    };*/

    const calcularCosto = () => {
        let costoPedido = 0;
    
        if (tipoProducto === 'grande') costoPedido += 10000;
        else if (tipoProducto === 'mediano') costoPedido += 5000;
        else if (tipoProducto === 'pequeno') costoPedido += 2500;
    
        if (tipoTransporte === 'grande') costoPedido += 10000;
        else if (tipoTransporte === 'mediano') costoPedido += 5000;
        else if (tipoTransporte === 'pequeno') costoPedido += 2500;
    
        if (alto) costoPedido += 5000;
        if (ancho) costoPedido += 5000;
        if (largo) costoPedido += 5000;
        if (cantidad) costoPedido += 5000;
    
        const costoRutaAnterior = sessionStorage.getItem('costoRuta');
        if (costoRutaAnterior) {
            costoPedido += parseFloat(costoRutaAnterior);
        }
    
        setTotalCost(costoPedido);
    
        // Guardar el costo total en sessionStorage
        sessionStorage.setItem('costoTotalPedido', costoPedido.toString());
    
        // Redirigir a la vista "Inicio"
        history.push('/inicio');
    };

    return (
        <IonPage>
            <IonHeader className='principal'>
                <IonToolbar color="primary">
                    <IonTitle>Agrega tu producto</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen>
                <IonCard style={{ color: '#132d46', padding: 0 }}>
                    <IonItem>
                        <IonSelect 
                            label="Tipo de Transporte" 
                            placeholder="Seleccionar"
                            onIonChange={(e) => setTipoTransporte(e.detail.value)}
                        >
                            <IonSelectOption value="pequeno">Transporte Pequeño</IonSelectOption>
                            <IonSelectOption value="mediano">Transporte Mediano</IonSelectOption>
                            <IonSelectOption value="grande">Transporte Grande</IonSelectOption>
                        </IonSelect>
                    </IonItem>

                    <IonItem>
                        <IonSelect 
                            label="Tipo de Producto" 
                            placeholder="Seleccionar"
                            onIonChange={(e) => setTipoProducto(e.detail.value)}
                        >
                            <IonSelectOption value="pequeno">Producto Pequeño</IonSelectOption>
                            <IonSelectOption value="mediano">Producto Mediano</IonSelectOption>
                            <IonSelectOption value="grande">Producto Grande</IonSelectOption>
                        </IonSelect>
                    </IonItem>

                    <IonItem lines="none" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ flex: 1, marginRight: '10px' }}>
                            <IonLabel>Alto</IonLabel>
                            <IonInput
                                value={alto}
                                onIonInput={(e: any) => setAlto(e.target.value)}
                                placeholder="cm"
                            />
                        </div>

                        <div style={{ flex: 1 }}>
                            <IonLabel>Ancho</IonLabel>
                            <IonInput
                                value={ancho}
                                onIonInput={(e: any) => setAncho(e.target.value)}
                                placeholder="cm"
                            />
                        </div>

                        <div style={{ flex: 1, marginLeft: '10px' }}>
                            <IonLabel>Largo</IonLabel>
                            <IonInput
                                value={largo}
                                onIonInput={(e: any) => setLargo(e.target.value)}
                                placeholder="cm"
                            />
                        </div>
                    </IonItem>

                    <IonItem lines="none" style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <IonLabel>Cantidad de productos</IonLabel>
                            <IonInput
                                value={cantidad}
                                onIonInput={(e: any) => setCantidad(e.target.value)}
                                placeholder="Cantidad"
                            />
                        </div>
                    </IonItem>

                    {/*<IonItem lines="none" style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                        <IonButton onClick={takePicture} color="secondary">
                            Agregar Foto del Producto
                        </IonButton>
                    </IonItem>*/}

                    <IonItem lines="none" style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                        <IonButton onClick={calcularCosto} color="primary">
                            Agregar Pedido
                        </IonButton>
                    </IonItem>
                </IonCard>
            </IonContent>
        </IonPage>
    );
};

export default Pedido;
