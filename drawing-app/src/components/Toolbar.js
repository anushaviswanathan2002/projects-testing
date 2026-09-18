import React from 'react';
import './Toolbar.css';

const Toolbar = ({
  brushSize,
  setBrushSize,
  brushColor,
  setBrushColor,
  onClear,
  onDownload,
}) => {
  return (
    <div className="toolbar">
      <div className="toolbar-section">
        <label htmlFor="color-picker">Color:</label>
        <input
          id="color-picker"
          type="color"
          value={brushColor}
          onChange={(e) => setBrushColor(e.target.value)}
          className="color-picker"
        />
      </div>

      <div className="toolbar-section">
        <label htmlFor="brush-size">Brush Size: {brushSize}px</label>
        <input
          id="brush-size"
          type="range"
          min="1"
          max="50"
          value={brushSize}
          onChange={(e) => setBrushSize(Number(e.target.value))}
          className="brush-slider"
        />
      </div>

      <div className="toolbar-section">
        <button onClick={onClear} className="btn btn-danger">
          Clear Canvas
        </button>
        <button onClick={onDownload} className="btn btn-primary">
          Download
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
