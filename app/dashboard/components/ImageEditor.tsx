'use client'
import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';

const ImageCropper: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [minZoom, setMinZoom] = useState<number>(0.1);
  const [imageObject, setImageObject] = useState<fabric.Image | null>(null);
  const croppingAreaRef = useRef<fabric.Rect | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const fabricCanvas = new fabric.Canvas(canvasRef.current, {
        selection: false,
      });
      setCanvas(fabricCanvas);

      // Create a cropping area (border)
      const cropArea = new fabric.Rect({
        left: 100,
        top: 100,
        width: 300,
        height: 300,
        fill: 'transparent',
        stroke: 'red',
        selectable: false,
        evented: false,
      });
      fabricCanvas.add(cropArea);

      return () => {
        fabricCanvas.dispose();
      };
    }
  }, [canvasRef]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        if (canvas) {
          fabric.Image.fromURL(imageUrl, (img) => {
            const canvasWidth = canvas.getWidth();
            const canvasHeight = canvas.getHeight();
            const croppingWidth = 300;
            const croppingHeight = 300;

            // Scale image to fit canvas
            const scaleX = canvasWidth / (img.width || 1);
            const scaleY = canvasHeight / (img.height || 1);
            const initialScale = Math.max(scaleX, scaleY);

            img.set({
              left: (canvasWidth - (img.width || 0) * initialScale) / 2,
              top: (canvasHeight - (img.height || 0) * initialScale) / 2,
              scaleX: initialScale,
              scaleY: initialScale,
              hasControls: false,
              lockRotation: true,
            });
            canvas.clear();
            canvas.add(img);
            setImageObject(img);
            canvas.setActiveObject(img);

            // Create cropping area on top of the image
            const croppingArea = new fabric.Rect({
              left: (canvasWidth - croppingWidth) / 2,
              top: (canvasHeight - croppingHeight) / 2,
              width: croppingWidth,
              height: croppingHeight,
              fill: 'rgba(255, 255, 255, 0.3)', // Semi-transparent overlay
              stroke: 'red', // Border color
              strokeWidth: 2,
              selectable: false,
              evented: false,
            });
            canvas.add(croppingArea);
            croppingAreaRef.current = croppingArea;

            canvas.renderAll();
            setZoom(initialScale);
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const zoomValue = parseFloat(e.target.value) < minZoom ? minZoom : parseFloat(e.target.value);

    setZoom(zoomValue);
    if (imageObject) {
      imageObject.set({
        scaleX: zoomValue,
        scaleY: zoomValue,
      });
      canvas?.renderAll();
    }
  };

  return (
    <div>
      <div className="mb-4">
        <label htmlFor="fileUpload" className="block text-sm font-medium mb-2">
          Upload an Image:
        </label>
        <input
          id="fileUpload"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="block"
        />
      </div>
      <canvas ref={canvasRef} width={600} height={600} className="border" />
      <div className="mt-4">
        <label htmlFor="zoom" className="mr-2">Zoom:</label>
        <input
          id="zoom"
          type="range"
          min="0.1"
          max="2"
          step="0.01"
          value={zoom}
          onChange={handleZoomChange}
          className="w-64"
        />
      </div>
    </div>
  );
};

export default ImageCropper;
