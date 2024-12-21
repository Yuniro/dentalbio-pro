'use client'
import React, { useRef, useEffect, useState } from 'react';
import { fabric } from 'fabric';

const ImageEditor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasInstance = useRef<fabric.Canvas | null>(null);
  const [originalImage, setOriginalImage] = useState<fabric.Image | null>(null); // Store original image
  const [zoomLevel, setZoomLevel] = useState(1); // Track zoom level

  useEffect(() => {
    if (canvasRef.current) {
      canvasInstance.current = new fabric.Canvas(canvasRef.current, {
        width: 600,
        height: 400,
      });
    }

    return () => {
      if (canvasInstance.current) {
        canvasInstance.current.dispose();
      }
    };
  }, []);

  // const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (file && canvasInstance.current) {
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       const imgElement = new Image();
  //       imgElement.src = e.target?.result as string;
  //       imgElement.onload = () => {
  //         const img = new fabric.Image(imgElement);
  //         canvasInstance.current?.clear();
  //         canvasInstance.current?.add(img);
  //         canvasInstance.current?.setActiveObject(img);
  //         setOriginalImage(img.clone()); // Store original image state
  //       };
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  const resetFilters = () => {
    const activeObject = canvasInstance.current?.getActiveObject();
    if (activeObject instanceof fabric.Image) {
      // Remove all filters
      activeObject.filters = [];
      activeObject.applyFilters();
      canvasInstance.current?.renderAll();
    }
  };

  const applyFilter = (filterType: string, value: number) => {
    const activeObject = canvasInstance.current?.getActiveObject();
    if (activeObject instanceof fabric.Image) {
      // Remove all previous filters
      activeObject.filters = [];

      // Apply the selected filter
      switch (filterType) {
        case 'brightness':
          activeObject.filters.push(new fabric.Image.filters.Brightness({ brightness: value }));
          break;
        case 'contrast':
          activeObject.filters.push(new fabric.Image.filters.Contrast({ contrast: value }));
          break;
        case 'saturation':
          activeObject.filters.push(new fabric.Image.filters.Saturation({ saturation: value }));
          break;
        default:
          break;
      }

      activeObject.applyFilters();
      canvasInstance.current?.renderAll();
    }
  };

  const handleBrightnessChange = (value: number) => {
    applyFilter('brightness', value);
  };

  const handleContrastChange = (value: number) => {
    applyFilter('contrast', value);
  };

  const handleSaturationChange = (value: number) => {
    applyFilter('saturation', value);
  };

  // Zoom feature with centering
  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newZoom = parseFloat(e.target.value);
    setZoomLevel(newZoom);

    if (canvasInstance.current) {
      const canvas = canvasInstance.current;
      const center = canvas.getCenter(); // Get canvas center

      if (canvas.viewportTransform) {
        // Get the current scroll position to prevent zoom from shifting the canvas
        const scrollLeft = canvas.viewportTransform[4];
        const scrollTop = canvas.viewportTransform[5];

        // Set zoom level
        canvas.setZoom(newZoom);

        // Calculate the offset to center the zoom on the canvas center
        canvas.viewportTransform[4] = scrollLeft - (center.left * (newZoom - zoomLevel));
        canvas.viewportTransform[5] = scrollTop - (center.top * (newZoom - zoomLevel));
      }

      canvas.renderAll(); // Re-render the canvas after zoom
    }
  };

  return (
    <div>
      {/* <input type="file" onChange={handleImageUpload} /> */}
      <canvas ref={canvasRef}></canvas>

      <div>
        <button onClick={resetFilters}>Reset Filters</button>
        <input
          type="range"
          min="-1"
          max="1"
          step="0.1"
          onChange={(e) => handleBrightnessChange(parseFloat(e.target.value))}
          placeholder="Brightness"
        />
        <input
          type="range"
          min="-1"
          max="1"
          step="0.1"
          onChange={(e) => handleContrastChange(parseFloat(e.target.value))}
          placeholder="Contrast"
        />
        <input
          type="range"
          min="-1"
          max="1"
          step="0.1"
          onChange={(e) => handleSaturationChange(parseFloat(e.target.value))}
          placeholder="Saturation"
        />
      </div>

      <div>
        <label htmlFor="zoom">Zoom: </label>
        <input
          type="range"
          id="zoom"
          min="0.5"
          max="3"
          step="0.1"
          value={zoomLevel}
          onChange={handleZoomChange}
        />
        <span>{(zoomLevel * 100).toFixed(0)}%</span>
      </div>
    </div>
  );
};

export default ImageEditor;
