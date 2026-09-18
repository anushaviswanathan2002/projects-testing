import React, { useRef, useEffect, forwardRef } from 'react';
import './Canvas.css';

const Canvas = forwardRef(({ brushSize, brushColor, isDrawing, setIsDrawing }, ref) => {
  const isDrawingRef = useRef(false);
  const lastXRef = useRef(0);
  const lastYRef = useRef(0);

  useEffect(() => {
    const canvas = ref.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight - 80; // Account for toolbar
      
      // Fill with white background
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [ref]);

  const handleMouseDown = (e) => {
    isDrawingRef.current = true;
    const rect = ref.current.getBoundingClientRect();
    lastXRef.current = e.clientX - rect.left;
    lastYRef.current = e.clientY - rect.top;
  };

  const handleMouseMove = (e) => {
    if (!isDrawingRef.current) return;

    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(lastXRef.current, lastYRef.current);
    ctx.lineTo(x, y);
    ctx.stroke();

    lastXRef.current = x;
    lastYRef.current = y;
  };

  const handleMouseUp = () => {
    isDrawingRef.current = false;
  };

  const handleMouseLeave = () => {
    isDrawingRef.current = false;
  };

  // Touch events for mobile support
  const handleTouchStart = (e) => {
    if (e.touches.length > 0) {
      isDrawingRef.current = true;
      const rect = ref.current.getBoundingClientRect();
      lastXRef.current = e.touches[0].clientX - rect.left;
      lastYRef.current = e.touches[0].clientY - rect.top;
    }
  };

  const handleTouchMove = (e) => {
    if (!isDrawingRef.current || e.touches.length === 0) return;

    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const y = e.touches[0].clientY - rect.top;

    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(lastXRef.current, lastYRef.current);
    ctx.lineTo(x, y);
    ctx.stroke();

    lastXRef.current = x;
    lastYRef.current = y;
    e.preventDefault();
  };

  const handleTouchEnd = () => {
    isDrawingRef.current = false;
  };

  return (
    <canvas
      ref={ref}
      className="canvas"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    />
  );
});

Canvas.displayName = 'Canvas';

export default Canvas;
