import { useEffect, useRef } from 'react';

interface MerkabaProps {
  size?: number;
  color?: string;
  background?: string;
  animated?: boolean;
}

export function Merkaba({ 
  size = 300, 
  color = "#f0f0ff", 
  background = "transparent",
  animated = true
}: MerkabaProps) {
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
    const radius = size * 0.4;
    
    // Function to draw a tetrahedron
    const drawTetrahedron = (pointUp: boolean, rotation = 0) => {
      const factor = pointUp ? 1 : -1;
      
      // Define the 4 points of a tetrahedron
      // Using 2D projections of 3D tetrahedron
      const apex = { 
        x: centerX, 
        y: centerY - factor * radius * 0.5 
      };
      
      const basePoints = [];
      for (let i = 0; i < 3; i++) {
        const angle = rotation + (i / 3) * Math.PI * 2;
        basePoints.push({
          x: centerX + radius * 0.8 * Math.cos(angle),
          y: centerY + factor * radius * 0.3 + radius * 0.4 * Math.sin(angle)
        });
      }
      
      // Draw the edges of the tetrahedron
      ctx.beginPath();
      
      // Draw base
      ctx.moveTo(basePoints[0].x, basePoints[0].y);
      ctx.lineTo(basePoints[1].x, basePoints[1].y);
      ctx.lineTo(basePoints[2].x, basePoints[2].y);
      ctx.closePath();
      ctx.stroke();
      
      // Draw edges from apex to base points
      for (let point of basePoints) {
        ctx.beginPath();
        ctx.moveTo(apex.x, apex.y);
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
      }
    };
    
    // Draw the Merkaba pattern
    const drawMerkaba = (rotationUp = 0, rotationDown = 0) => {
      // Clear canvas
      ctx.clearRect(0, 0, size, size);
      
      // Set background if not transparent
      if (background !== "transparent") {
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, size, size);
      }
      
      // Draw the upward-pointing tetrahedron (masculine energy)
      ctx.strokeStyle = color;
      drawTetrahedron(true, rotationUp);
      
      // Draw the downward-pointing tetrahedron (feminine energy)
      ctx.strokeStyle = color.includes('rgba') ? color : color.includes('rgb(') 
        ? color.replace('rgb(', 'rgba(').replace(')', ', 0.8)') 
        : `${color}`;
      drawTetrahedron(false, rotationDown);
      
      // Draw outer circle
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.1, 0, Math.PI * 2);
      ctx.stroke();
    };
    
    // Initial draw
    drawMerkaba(0, Math.PI / 6);
    
    // Animation loop
    if (animated) {
      let rotationUp = 0;
      let rotationDown = Math.PI / 6;
      
      const animate = () => {
        rotationUp += 0.005;
        rotationDown -= 0.003;
        drawMerkaba(rotationUp, rotationDown);
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