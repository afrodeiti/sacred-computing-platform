import { useEffect, useRef } from 'react';

interface TorusFieldProps {
  size?: number;
  color?: string;
  background?: string;
  animated?: boolean;
}

export function TorusField({ 
  size = 300, 
  color = "#f0f0ff", 
  background = "transparent",
  animated = true 
}: TorusFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, size, size);
    
    // Set background if not transparent
    if (background !== "transparent") {
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, size, size);
    }
    
    // Set drawing styles
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    
    const centerX = size / 2;
    const centerY = size / 2;
    const outerRadius = size * 0.4;
    const innerRadius = outerRadius * 0.6;
    
    // Function to draw the torus
    const drawTorus = (rotation = 0) => {
      // Clear canvas
      ctx.clearRect(0, 0, size, size);
      
      // Set background if not transparent
      if (background !== "transparent") {
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, size, size);
      }
      
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(rotation);
      
      // Draw the outer ellipse (representation of the torus from a side view)
      ctx.beginPath();
      ctx.ellipse(0, 0, outerRadius, outerRadius * 0.4, 0, 0, Math.PI * 2);
      ctx.stroke();
      
      // Draw the inner ellipse (representation of the torus hole)
      ctx.beginPath();
      ctx.ellipse(0, 0, innerRadius, innerRadius * 0.4, 0, 0, Math.PI * 2);
      ctx.stroke();
      
      // Draw flow lines to represent the energy circulating through the torus
      const flowLinesCount = 12;
      for (let i = 0; i < flowLinesCount; i++) {
        const angle = (i / flowLinesCount) * Math.PI * 2;
        const startX = Math.cos(angle) * outerRadius;
        const startY = Math.sin(angle) * outerRadius * 0.4;
        
        ctx.beginPath();
        // Draw a curved line to represent energy flow
        ctx.moveTo(startX, startY);
        
        // Control points for the curve
        const cp1x = startX * 0.5;
        const cp1y = -startY * 3; // Flow from top to bottom
        const cp2x = -startX * 0.5;
        const cp2y = -startY * 3;
        const endX = -startX;
        const endY = startY;
        
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);
        ctx.stroke();
      }
      
      // Draw perpendicular view showing the torus from above
      // (appears as two concentric circles)
      ctx.translate(0, outerRadius * 1.2);
      ctx.scale(1, 0.3); // Flatten to create perspective
      
      // Outer circle
      ctx.beginPath();
      ctx.arc(0, 0, outerRadius * 0.8, 0, Math.PI * 2);
      ctx.stroke();
      
      // Inner circle
      ctx.beginPath();
      ctx.arc(0, 0, innerRadius * 0.8, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.restore();
    };
    
    // Initial draw
    drawTorus();
    
    // Animation loop
    if (animated) {
      let rotation = 0;
      
      const animate = () => {
        rotation += 0.01;
        drawTorus(rotation);
        requestAnimationFrame(animate);
      };
      
      const animationFrame = requestAnimationFrame(animate);
      
      // Cleanup
      return () => {
        cancelAnimationFrame(animationFrame);
      };
    }
  }, [size, color, background, animated]);
  
  return (
    <canvas 
      ref={canvasRef} 
      width={size} 
      height={size} 
      style={{ width: size, height: size }}
    />
  );
}