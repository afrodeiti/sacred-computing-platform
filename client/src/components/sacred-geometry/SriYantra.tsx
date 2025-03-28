import React, { useEffect, useRef } from 'react';

export interface SriYantraProps {
  size?: number;
  color?: string;
  animated?: boolean;
}

const SriYantra: React.FC<SriYantraProps> = ({
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
      
      // Sri Yantra parameters
      const maxRadius = size * 0.4;
      
      // Update animation angle
      if (animated) {
        angle += 0.002;
      }
      
      ctx.save();
      ctx.translate(centerX, centerY);
      
      // Draw the outer circle
      ctx.beginPath();
      ctx.arc(0, 0, maxRadius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw the sri yantra triangles
      // 9 interlocking triangles - 4 pointing up, 5 pointing down
      // We'll create a simplified version
      
      // Triangle properties
      const triangleCount = 9;
      const triangleLevels = [
        { scale: 0.95, rotation: 0, opacity: 0.4 },
        { scale: 0.85, rotation: Math.PI, opacity: 0.5 },
        { scale: 0.75, rotation: 0, opacity: 0.6 },
        { scale: 0.65, rotation: Math.PI, opacity: 0.7 },
        { scale: 0.55, rotation: 0, opacity: 0.8 },
        { scale: 0.45, rotation: Math.PI, opacity: 0.9 },
        { scale: 0.35, rotation: 0, opacity: 1.0 },
        { scale: 0.25, rotation: Math.PI, opacity: 1.0 },
        { scale: 0.15, rotation: 0, opacity: 1.0 }
      ];
      
      // Draw the triangles
      triangleLevels.forEach((level, index) => {
        const triangleScale = level.scale;
        const rotation = level.rotation + (animated ? angle * (index % 2 === 0 ? 1 : -1) : 0);
        
        ctx.save();
        ctx.rotate(rotation);
        
        // Draw a triangle
        ctx.beginPath();
        
        // Calculate triangle points
        const triangleRadius = maxRadius * triangleScale;
        
        // For a pyramid-like structure
        ctx.moveTo(0, -triangleRadius); // Top point
        ctx.lineTo(triangleRadius * 0.866, triangleRadius * 0.5); // Bottom right
        ctx.lineTo(-triangleRadius * 0.866, triangleRadius * 0.5); // Bottom left
        ctx.closePath();
        
        // Apply a gradient stroke
        const gradient = ctx.createLinearGradient(0, -triangleRadius, 0, triangleRadius);
        gradient.addColorStop(0, `rgba(255, 200, 255, ${level.opacity})`);
        gradient.addColorStop(1, `rgba(120, 90, 255, ${level.opacity})`);
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // For inner triangles, add some fill
        if (index > 4) {
          ctx.fillStyle = `rgba(180, 130, 255, ${level.opacity * 0.2})`;
          ctx.fill();
        }
        
        ctx.restore();
      });
      
      // Draw Bindu (central point)
      ctx.beginPath();
      ctx.arc(0, 0, maxRadius * 0.05, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fill();
      
      // Add energy rays emanating from the center
      if (animated) {
        const rayCount = 12;
        
        for (let i = 0; i < rayCount; i++) {
          const rayAngle = (i / rayCount) * Math.PI * 2 + angle * 2;
          const innerRadius = maxRadius * 0.05;
          const outerRadius = maxRadius * (0.8 + Math.sin(angle * 5 + i) * 0.1);
          
          ctx.beginPath();
          ctx.moveTo(
            Math.cos(rayAngle) * innerRadius,
            Math.sin(rayAngle) * innerRadius
          );
          ctx.lineTo(
            Math.cos(rayAngle) * outerRadius,
            Math.sin(rayAngle) * outerRadius
          );
          
          const rayGradient = ctx.createLinearGradient(
            Math.cos(rayAngle) * innerRadius,
            Math.sin(rayAngle) * innerRadius,
            Math.cos(rayAngle) * outerRadius,
            Math.sin(rayAngle) * outerRadius
          );
          
          rayGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
          rayGradient.addColorStop(1, 'rgba(180, 130, 255, 0)');
          
          ctx.strokeStyle = rayGradient;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
      
      // Add lotus petals around the perimeter
      const petalCount = 16;
      const petalOuterRadius = maxRadius * 1.05;
      const petalInnerRadius = maxRadius * 0.95;
      const petalWidthFactor = 0.25;
      
      for (let i = 0; i < petalCount; i++) {
        const petalAngle = (i / petalCount) * Math.PI * 2;
        const petalMidRadius = (petalInnerRadius + petalOuterRadius) / 2;
        
        // Draw petal shape
        ctx.beginPath();
        
        // Draw a petal shape using bezier curves
        const startX = Math.cos(petalAngle - petalWidthFactor) * petalInnerRadius;
        const startY = Math.sin(petalAngle - petalWidthFactor) * petalInnerRadius;
        
        const endX = Math.cos(petalAngle + petalWidthFactor) * petalInnerRadius;
        const endY = Math.sin(petalAngle + petalWidthFactor) * petalInnerRadius;
        
        const tipX = Math.cos(petalAngle) * petalOuterRadius;
        const tipY = Math.sin(petalAngle) * petalOuterRadius;
        
        ctx.moveTo(startX, startY);
        ctx.quadraticCurveTo(tipX, tipY, endX, endY);
        
        // Adjust opacity based on animation
        let petalOpacity = 0.2;
        if (animated) {
          petalOpacity = 0.1 + Math.abs(Math.sin(angle * 3 + i * 0.7)) * 0.3;
        }
        
        ctx.strokeStyle = `rgba(255, 255, 255, ${petalOpacity})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
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
    <div className={`sacred-geometry sri-yantra ${animated ? 'animated' : ''}`}>
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

export default SriYantra;