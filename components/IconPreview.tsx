
import React, { useEffect, useRef, useCallback } from 'react';
import { IconConfig } from '../types';

interface IconPreviewProps {
  config: IconConfig;
  size?: number;
  className?: string;
  canvasRef?: React.RefObject<HTMLCanvasElement>;
}

const IconPreview: React.FC<IconPreviewProps> = ({ config, size = 512, className = "", canvasRef }) => {
  const localRef = useRef<HTMLCanvasElement>(null);
  const activeRef = canvasRef || localRef;

  const draw = useCallback(() => {
    const canvas = activeRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.clearRect(0, 0, size, size);

    // 1. Draw Background
    ctx.fillStyle = config.backgroundColor;
    if (config.shape === 'rounded') {
      const radius = size * 0.15;
      ctx.beginPath();
      ctx.roundRect(0, 0, size, size, radius);
      ctx.fill();
    } else if (config.shape === 'circle') {
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(0, 0, size, size);
    }

    // 2. Prepare Font/Icon
    const scaledFontSize = config.fontSize * (size / 512);
    ctx.fillStyle = config.fontColor;
    
    let fontStr: string;
    let contentToDraw: string;

    if (config.useIcon) {
      // Use Material Symbols Outlined
      // Note: Material Symbols works by rendering the icon name as text
      fontStr = `400 normal ${scaledFontSize}px "Material Symbols Outlined"`;
      contentToDraw = config.iconName;
    } else {
      fontStr = `${config.fontWeight} ${config.fontVariant} ${scaledFontSize}px "${config.fontFamily}", sans-serif`;
      contentToDraw = config.text;
    }

    ctx.font = fontStr;
    
    // 3. Precision Centering Logic
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';

    const metrics = ctx.measureText(contentToDraw);
    const textX = size / 2;
    const textY = (size / 2) + (metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) / 2;

    ctx.fillText(contentToDraw, textX, textY);
  }, [config, size, activeRef]);

  useEffect(() => {
    draw();

    const loadFont = async () => {
      const fontCheckStr = config.useIcon 
        ? `400 normal 12px "Material Symbols Outlined"`
        : `${config.fontWeight} ${config.fontVariant} 12px "${config.fontFamily}"`;
      
      try {
        await document.fonts.load(fontCheckStr);
        requestAnimationFrame(draw);
      } catch (e) {
        console.warn('Font loading failed', e);
      }
    };

    loadFont();
    document.fonts.addEventListener('loadingdone', draw);
    document.fonts.ready.then(draw);

    return () => {
      document.fonts.removeEventListener('loadingdone', draw);
    };
  }, [config, draw]);

  return (
    <canvas
      ref={activeRef}
      width={size}
      height={size}
      className={`${className}`}
      style={{ width: size, height: size }}
    />
  );
};

export default IconPreview;
