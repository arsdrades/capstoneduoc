import React, { useEffect, useState, useRef } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import Webcam from 'react-webcam';
import OpenCVComponent from './OpenCVComponent'; // Asegúrate de que la ruta sea correcta
import { IonList, IonSelect, IonSelectOption, IonCard, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom'; // Importa useHistory
import './Pedido.css';

const Pedido: React.FC = () => {
    const [startAddress, setStartAddress] = useState('');
    const [endAddress, setEndAddress] = useState('');
    const [length, setLength] = useState(''); // Estado para el largo
    const [cantidad, setCantidad] = useState(''); // Estado para la cantidad de productos
    const [image, setImage] = useState<string | null>(null); // Estado para la imagen seleccionada
    const [totalCost, setTotalCost] = useState<number | null>(null);
    const history = useHistory(); // Usa useHistory aquí

    // Función para abrir la cámara o galería
    const takePicture = async () => {
        const image = await Camera.getPhoto({
            quality: 90,
            allowEditing: false,
            resultType: CameraResultType.DataUrl, // Usamos DataUrl para obtener la imagen en base64
            source: CameraSource.Prompt // Esto permite seleccionar entre cámara y galería
        });

        setImage(image.dataUrl); // Guardar la imagen seleccionada en el estado
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
                    {/* Selección de tipo de transporte */}
                    <IonItem>
                        <IonSelect label="Tipo de Transporte" placeholder="Seleccionar">
                            <IonSelectOption value="pequeno">Pequeño</IonSelectOption>
                            <IonSelectOption value="mediano">Mediano</IonSelectOption>
                            <IonSelectOption value="grande">Grande</IonSelectOption>
                        </IonSelect>
                    </IonItem>

                    {/* Selección de tipo de producto */}
                    <IonItem>
                        <IonSelect label="Tipo de Producto" placeholder="Seleccionar">
                            <IonSelectOption value="pequeno">Pequeño</IonSelectOption>
                            <IonSelectOption value="mediano">Mediano</IonSelectOption>
                            <IonSelectOption value="grande">Grande</IonSelectOption>
                        </IonSelect>
                    </IonItem>

                    {/* Dimensiones del producto: Alto, Ancho y Largo en la misma línea */}
                    <IonItem lines="none" style={{ '--background': 'transparent', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, marginRight: '10px' }}>
                            <IonLabel>Alto</IonLabel>
                            <IonInput
                                value={startAddress}
                                onIonInput={(e: any) => setStartAddress(e.target.value)}
                                color='#01c380'
                                placeholder="cm" // Placeholder para 'cm'
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                            <IonLabel>Ancho</IonLabel>
                            <IonInput
                                value={endAddress}
                                onIonInput={(e: any) => setEndAddress(e.target.value)}
                                color="#01c380"
                                placeholder="cm" // Placeholder para 'cm'
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, marginLeft: '10px' }}>
                            <IonLabel>Largo</IonLabel>
                            <IonInput
                                value={length}
                                onIonInput={(e: any) => setLength(e.target.value)}
                                color="#01c380"
                                placeholder="cm" // Placeholder para 'cm'
                            />
                        </div>
                    </IonItem>

                    {/* Campo para la cantidad de productos */}
                    <IonItem lines="none" style={{ '--background': 'transparent', display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <IonLabel>Cantidad de productos</IonLabel>
                            <IonInput
                                value={cantidad}
                                onIonInput={(e: any) => setCantidad(e.target.value)}
                                placeholder="Cantidad"
                            />
                        </div>
                    </IonItem>

                    {/* Botón para agregar foto */}
                    <IonItem lines="none" style={{ '--background': 'transparent', display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                        <IonButton onClick={takePicture} color="secondary">
                            Agregar Foto del Producto
                        </IonButton>
                    </IonItem>

                   

                    {/* Botón de ubicación */}

                </IonCard>
            </IonContent>
        </IonPage>
    );
};

export default Pedido;
