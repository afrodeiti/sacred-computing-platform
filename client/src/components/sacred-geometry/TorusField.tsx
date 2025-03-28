import React, { useEffect, useRef } from 'react';

export interface TorusFieldProps {
  size?: number;
  color?: string;
  animated?: boolean;
  frequency?: number;
}

const TorusField: React.FC<TorusFieldProps> = ({
  size = 200,
  color = '#ffffff',
  animated = false,
  frequency = 7.83 // Schumann resonance default
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Convert frequency to animation speed
    const animationSpeed = frequency / 20;
    
    let animationFrameId: number;
    let angle = 0;
    
    // Set canvas size with device pixel ratio for sharp rendering
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);
    
    // Draw function
    const draw = () => {
      ctx.clearRect(0, 0, size, size);
      
      // Center of the canvas
      const centerX = size / 2;
      const centerY = size / 2;
      
      // Main torus parameters
      const outerRadius = size * 0.35;
      const innerRadius = size * 0.1;
      const torusWidth = size * 0.06;
      
      // Calculate rotation based on frequency
      if (animated) {
        angle += 0.005 * animationSpeed;
      }
      
      // Draw the outer torus
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle);
      
      // Gradient for the torus
      const gradient = ctx.createLinearGradient(-outerRadius, 0, outerRadius, 0);
      gradient.addColorStop(0, 'rgba(120, 90, 255, 0.9)'); // Blue-purple
      gradient.addColorStop(0.5, 'rgba(255, 100, 255, 0.9)'); // Pink
      gradient.addColorStop(1, 'rgba(120, 90, 255, 0.9)'); // Blue-purple
      
      // Draw the main torus shape
      ctx.beginPath();
      
      // Create the torus shape using an elliptical path
      const steps = 100;
      for (let i = 0; i <= steps; i++) {
        const theta = (i / steps) * Math.PI * 2;
        const x = Math.cos(theta) * outerRadius;
        const y = Math.sin(theta) * outerRadius * 0.4; // Flattened to make it more like a torus field
        
        // Add a modulation based on frequency
        const modulationFactor = Math.sin(theta * 8 + angle * 5) * (frequency / 100);
        const modOuterRadius = outerRadius * (1 + modulationFactor * 0.1);
        
        const modX = Math.cos(theta) * modOuterRadius;
        const modY = Math.sin(theta) * modOuterRadius * 0.4;
        
        if (i === 0) {
          ctx.moveTo(modX, modY);
        } else {
          ctx.lineTo(modX, modY);
        }
      }
      
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Inner circle representing the central flow
      ctx.beginPath();
      ctx.arc(0, 0, innerRadius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fill();
      
      // Energy flow lines
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      
      // Draw flow lines
      for (let i = 0; i < 12; i++) {
        const theta = (i / 12) * Math.PI * 2;
        const startX = Math.cos(theta) * innerRadius;
        const startY = Math.sin(theta) * innerRadius;
        const endX = Math.cos(theta) * outerRadius * 1.1;
        const endY = Math.sin(theta) * outerRadius * 0.45;
        
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        
        // Use a bezier curve to create a flow effect
        const controlX1 = Math.cos(theta) * outerRadius * 0.5;
        const controlY1 = Math.sin(theta) * outerRadius * 0.2;
        const controlX2 = Math.cos(theta) * outerRadius * 0.8;
        const controlY2 = Math.sin(theta) * outerRadius * 0.4;
        
        ctx.bezierCurveTo(controlX1, controlY1, controlX2, controlY2, endX, endY);
        ctx.stroke();
        
        // Add energy nodes along the flow lines
        const nodes = 3;
        for (let j = 1; j <= nodes; j++) {
          const t = j / (nodes + 1);
          const nodeX = startX + t * (endX - startX);
          const nodeY = startY + t * (endY - startY);
          
          ctx.beginPath();
          ctx.arc(nodeX, nodeY, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.fill();
        }
      }
      
      ctx.restore();
      
      // Particles around the torus
      if (animated) {
        const particleCount = Math.floor(frequency);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        
        for (let i = 0; i < particleCount; i++) {
          const particleAngle = (i / particleCount) * Math.PI * 2 + angle * 3;
          const distance = outerRadius * (1 + 0.2 * Math.sin(angle * 2 + i));
          const particleX = centerX + Math.cos(particleAngle) * distance;
          const particleY = centerY + Math.sin(particleAngle) * distance * 0.4;
          
          const particleSize = 1 + Math.random() * 2;
          
          ctx.beginPath();
          ctx.arc(particleX, particleY, particleSize, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      
      // Frequency indicator
      ctx.fillStyle = '#ffffff';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${frequency.toFixed(2)} Hz`, centerX, centerY + size * 0.45);
      
      if (animated) {
        animationFrameId = requestAnimationFrame(draw);
      }
    };
    
    draw();
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [size, color, animated, frequency]);
  
  return (
    <div className={`sacred-geometry torus-field ${animated ? 'animated' : ''}`}>
      <canvas 
        ref={canvasRef} 
        style={{ 
          width: size, 
          height: size,
          transition: 'all 0.5s ease',
          transform: animated ? 'scale(1.05)' : 'scale(1)'
        }}
      />
    </div>
  );
};

export default TorusField;