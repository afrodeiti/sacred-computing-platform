import React, { useEffect, useRef } from 'react';

export interface FlowerOfLifeProps {
  size?: number;
  color?: string;
  animated?: boolean;
}

const FlowerOfLife: React.FC<FlowerOfLifeProps> = ({
  size = 200,
  color = '#ffffff',
  animated = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
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
      
      // Parameters for Flower of Life
      const baseRadius = size * 0.08;
      const circleCount = 19; // Number of circles
      
      // If animated, rotate
      if (animated) {
        angle += 0.005;
      }
      
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle);
      
      // Draw the first circle (center)
      ctx.beginPath();
      ctx.arc(0, 0, baseRadius, 0, Math.PI * 2);
      
      // Create a radial gradient for subtle effect
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 0.4);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
      gradient.addColorStop(0.7, 'rgba(180, 150, 255, 0.6)');
      gradient.addColorStop(1, 'rgba(120, 90, 255, 0.1)');
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Draw the first ring of 6 circles
      const firstRingRadius = baseRadius * 2;
      for (let i = 0; i < 6; i++) {
        const theta = (i / 6) * Math.PI * 2;
        const x = Math.cos(theta) * firstRingRadius;
        const y = Math.sin(theta) * firstRingRadius;
        
        ctx.beginPath();
        ctx.arc(x, y, baseRadius, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      // Draw the second ring
      const secondRingRadius = firstRingRadius * 2;
      for (let i = 0; i < 12; i++) {
        const theta = (i / 12) * Math.PI * 2 + Math.PI / 12;
        const x = Math.cos(theta) * secondRingRadius;
        const y = Math.sin(theta) * secondRingRadius;
        
        ctx.beginPath();
        ctx.arc(x, y, baseRadius, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      // Draw the outer boundary circle
      ctx.beginPath();
      ctx.arc(0, 0, baseRadius * 8, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw connecting lines (sacred geometry)
      ctx.beginPath();
      const connectionPoints = 12;
      
      for (let i = 0; i < connectionPoints; i++) {
        const theta1 = (i / connectionPoints) * Math.PI * 2;
        const x1 = Math.cos(theta1) * secondRingRadius;
        const y1 = Math.sin(theta1) * secondRingRadius;
        
        for (let j = i + 1; j < connectionPoints; j++) {
          const theta2 = (j / connectionPoints) * Math.PI * 2;
          const x2 = Math.cos(theta2) * secondRingRadius;
          const y2 = Math.sin(theta2) * secondRingRadius;
          
          // Only draw some connections for a cleaner look
          if ((i + j) % 3 === 0) {
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
          }
        }
      }
      
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 0.5;
      ctx.stroke();
      
      // Add shimmer effect if animated
      if (animated) {
        // Draw energy particles
        const particleCount = 30;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        
        for (let i = 0; i < particleCount; i++) {
          const particleAngle = (i / particleCount) * Math.PI * 2 + angle * 10;
          const distance = Math.random() * baseRadius * 8;
          const particleX = Math.cos(particleAngle) * distance;
          const particleY = Math.sin(particleAngle) * distance;
          
          // Only draw particles near circle intersections
          const particleSize = 1 + Math.random() * 1.5;
          
          ctx.beginPath();
          ctx.arc(particleX, particleY, particleSize, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Add pulsing effect
        const pulseSize = Math.sin(angle * 8) * 0.2 + 1;
        
        ctx.beginPath();
        ctx.arc(0, 0, baseRadius * pulseSize, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fill();
      }
      
      ctx.restore();
      
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
  }, [size, color, animated]);
  
  return (
    <div className={`sacred-geometry flower-of-life ${animated ? 'animated' : ''}`}>
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

export default FlowerOfLife;