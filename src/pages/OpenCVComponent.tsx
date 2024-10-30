import React, { useRef, useEffect } from 'react';

const OpenCVComponent: React.FC<{ image: string }> = ({ image }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const detectEdges = () => {
      if ((window as any).cv && imgRef.current && canvasRef.current) {
        const imgElement = imgRef.current;

        // Verificar que la imagen se haya cargado
        if (imgElement.naturalWidth === 0 || imgElement.naturalHeight === 0) {
          console.error('La imagen no se cargó correctamente.');
          return;
        }

        // Crear un canvas temporal
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = imgElement.naturalWidth;
        tempCanvas.height = imgElement.naturalHeight;
        const context = tempCanvas.getContext('2d');

        // Dibuja la imagen en el canvas temporal
        context?.drawImage(imgElement, 0, 0);

        // Obtiene los datos de la imagen
        const imageData = context?.getImageData(0, 0, imgElement.naturalWidth, imgElement.naturalHeight);

        if (imageData) {
          const src = (window as any).cv.matFromImageData(imageData);
          const dst = new (window as any).cv.Mat();
          const gray = new (window as any).cv.Mat();

          // Convertir a escala de grises
          (window as any).cv.cvtColor(src, gray, (window as any).cv.COLOR_RGBA2GRAY);

          // Aplicar detección de bordes
          (window as any).cv.Canny(gray, dst, 100, 200);

          // Muestra la imagen procesada en el canvas
          (window as any).cv.imshow(canvasRef.current, dst);

          // Liberar memoria
          src.delete();
          gray.delete();
          dst.delete();
        }
      }
    };

    if (imgRef.current) {
      imgRef.current.onload = detectEdges; // Llama a detectEdges cuando la imagen se carga
    }
  }, [image]); // Dependencia en la imagen

  return (
    <div>
      <h2>Detección de Bordes con OpenCV</h2>
      <img
        ref={imgRef}
        src={image}
        alt="Cargada"
        style={{ display: 'none' }} // Oculta la imagen
      />
      <canvas ref={canvasRef} style={{ border: '1px solid black' }} />
    </div>
  );
};

export default OpenCVComponent;
