import React, { useEffect, useState, useRef } from 'react';
import Webcam from 'react-webcam';
import OpenCVComponent from './OpenCVComponent'; // Asegúrate de que la ruta sea correcta

const Pedido: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [opencvReady, setOpencvReady] = useState<boolean>(false);
  const webcamRef = useRef<Webcam>(null); // Referencia a la cámara

  useEffect(() => {
    const loadOpenCV = () => {
      const script = document.createElement('script');
      script.src = 'https://docs.opencv.org/master/opencv.js';
      script.async = true;
      script.onload = () => {
        if ((window as any).cv) {
          setOpencvReady(true);
        } else {
          console.error('OpenCV no se cargó correctamente.');
        }
      };
      document.body.appendChild(script);
    };

    loadOpenCV();
  }, []);

  const capture = React.useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot(); // Captura la imagen de la cámara
      if (imageSrc) {
        setImage(imageSrc); // Solo actualiza el estado si se capturó correctamente
      } else {
        console.error('No se pudo capturar la imagen.'); // Manejo de errores
      }
    }
  }, [webcamRef]);

  return (
    <div>
      <h1>Pedido de la Aplicación</h1>
      <Webcam 
        audio={false} 
        ref={webcamRef} 
        screenshotFormat="image/jpeg" // Formato de la captura
        width={320} // Ancho del video
      />
      <button onClick={capture}>Capturar Imagen</button> {/* Botón para capturar la imagen */}
      {opencvReady && image && <OpenCVComponent image={image} />}
      {!opencvReady && <p>Cargando OpenCV...</p>}
    </div>
  );
};

export default Pedido;
