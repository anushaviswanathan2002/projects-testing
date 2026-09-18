import React, { useRef, useState } from 'react';
import './DrawingApp.css';
import Canvas from './Canvas';
import Toolbar from './Toolbar';

const DrawingApp = () => {
  const canvasRef = useRef(null);
  const [brushSize, setBrushSize] = useState(5);
  const [brushColor, setBrushColor] = useState('#000000');
  const [isDrawing, setIsDrawing] = useState(false);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'drawing.png';
      link.click();
    }
  };

  return (
    <div className="drawing-app">
      <Toolbar
        brushSize={brushSize}
        setBrushSize={setBrushSize}
        brushColor={brushColor}
        setBrushColor={setBrushColor}
        onClear={clearCanvas}
        onDownload={downloadImage}
      />
      <Canvas
        ref={canvasRef}
        brushSize={brushSize}
        brushColor={brushColor}
        isDrawing={isDrawing}
        setIsDrawing={setIsDrawing}
      />
    </div>
  );
};

export default DrawingApp;
