import { useEffect, useRef } from 'react';

interface SriYantraProps {
  size?: number;
  color?: string;
  background?: string;
  animated?: boolean;
}

export function SriYantra({ 
  size = 300, 
  color = "#f0f0ff", 
  background = "transparent",
  animated = true
}: SriYantraProps) {
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
    const outerRadius = size / 2 - 10;
    
    // Helper function to draw a triangle
    const drawTriangle = (pointDown: boolean, scale: number) => {
      const height = Math.sqrt(3) / 2;
      const triangleSize = outerRadius * scale;
      
      ctx.beginPath();
      
      if (pointDown) {
        // Triangle pointing down
        ctx.moveTo(centerX - triangleSize, centerY - height * triangleSize);
        ctx.lineTo(centerX + triangleSize, centerY - height * triangleSize);
        ctx.lineTo(centerX, centerY + height * triangleSize);
      } else {
        // Triangle pointing up
        ctx.moveTo(centerX - triangleSize, centerY + height * triangleSize);
        ctx.lineTo(centerX + triangleSize, centerY + height * triangleSize);
        ctx.lineTo(centerX, centerY - height * triangleSize);
      }
      
      ctx.closePath();
      ctx.stroke();
    };
    
    // Draw the 9 interlocking triangles
    // Four pointing downward
    drawTriangle(true, 0.9);
    drawTriangle(true, 0.75);
    drawTriangle(true, 0.6);
    drawTriangle(true, 0.45);
    
    // Five pointing upward
    drawTriangle(false, 0.85);
    drawTriangle(false, 0.7);
    drawTriangle(false, 0.55);
    drawTriangle(false, 0.4);
    drawTriangle(false, 0.25);
    
    // Draw outer circles
    for (let i = 1; i <= 3; i++) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius * (0.95 - i * 0.05), 0, Math.PI * 2);
      ctx.stroke();
    }
    
    // Draw central bindu (dot)
    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius * 0.05, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    
    // Draw lotus petals (16 petals)
    const petalCount = 16;
    const petalOuterRadius = outerRadius * 1.1;
    const petalInnerRadius = outerRadius * 0.95;
    
    for (let i = 0; i < petalCount; i++) {
      const angle = (i / petalCount) * Math.PI * 2;
      const nextAngle = ((i + 0.5) / petalCount) * Math.PI * 2;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, petalOuterRadius, angle, nextAngle);
      ctx.arc(centerX, centerY, petalInnerRadius, nextAngle, angle, true);
      ctx.closePath();
      ctx.stroke();
    }
    
    // Animation for rotation effect
    if (animated) {
      let rotation = 0;
      const animate = () => {
        rotation += 0.005;
        
        ctx.clearRect(0, 0, size, size);
        
        // Set background if not transparent
        if (background !== "transparent") {
          ctx.fillStyle = background;
          ctx.fillRect(0, 0, size, size);
        }
        
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(rotation);
        ctx.translate(-centerX, -centerY);
        
        // Redraw everything
        // Draw the 9 interlocking triangles
        // Four pointing downward
        drawTriangle(true, 0.9);
        drawTriangle(true, 0.75);
        drawTriangle(true, 0.6);
        drawTriangle(true, 0.45);
        
        // Five pointing upward
        drawTriangle(false, 0.85);
        drawTriangle(false, 0.7);
        drawTriangle(false, 0.55);
        drawTriangle(false, 0.4);
        drawTriangle(false, 0.25);
        
        // Draw outer circles
        for (let i = 1; i <= 3; i++) {
          ctx.beginPath();
          ctx.arc(centerX, centerY, outerRadius * (0.95 - i * 0.05), 0, Math.PI * 2);
          ctx.stroke();
        }
        
        // Draw central bindu (dot)
        ctx.beginPath();
        ctx.arc(centerX, centerY, outerRadius * 0.05, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        
        ctx.restore();
        
        requestAnimationFrame(animate);
      };
      
      const animationFrame = requestAnimationFrame(animate);
      
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