import { useEffect, useRef } from 'react';

interface FlowerOfLifeProps {
  size?: number;
  color?: string;
  background?: string;
  animated?: boolean;
  circleCount?: number;
}

export function FlowerOfLife({ 
  size = 300, 
  color = "#f0f0ff", 
  background = "transparent",
  animated = true,
  circleCount = 19 
}: FlowerOfLifeProps) {
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
    ctx.lineWidth = 1;
    
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 7;
    
    const drawFlowerOfLife = (rotation = 0) => {
      // Clear canvas
      ctx.clearRect(0, 0, size, size);
      
      // Set background if not transparent
      if (background !== "transparent") {
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, size, size);
      }
      
      ctx.save();
      if (rotation !== 0) {
        ctx.translate(centerX, centerY);
        ctx.rotate(rotation);
        ctx.translate(-centerX, -centerY);
      }
      
      // Draw central circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();
      
      // Draw first ring of 6 circles
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      // Draw additional circle rings if needed
      if (circleCount > 7) {
        // Coordinates for second ring
        interface Coordinate {
          x: number;
          y: number;
        }
        
        const secondRingCoords: Coordinate[] = [];
        for (let i = 0; i < 6; i++) {
          const angle = (i / 6) * Math.PI * 2;
          const baseX = centerX + radius * Math.cos(angle);
          const baseY = centerY + radius * Math.sin(angle);
          
          // Each base point spawns additional circles
          for (let j = 1; j < 6; j++) {
            const subAngle = ((j + i) / 6) * Math.PI * 2;
            const x = baseX + radius * Math.cos(subAngle);
            const y = baseY + radius * Math.sin(subAngle);
            
            // Check if this position is already in our list
            const exists = secondRingCoords.some(coord => 
              Math.abs(coord.x - x) < 1 && Math.abs(coord.y - y) < 1
            );
            
            if (!exists) {
              secondRingCoords.push({ x, y });
            }
          }
        }
        
        // Draw second ring circles (up to circleCount)
        const maxSecondRing = Math.min(secondRingCoords.length, circleCount - 7);
        for (let i = 0; i < maxSecondRing; i++) {
          const { x, y } = secondRingCoords[i];
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      
      // Draw outer circle encompassing the entire flower
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 4, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.restore();
    };
    
    // Initial draw
    drawFlowerOfLife();
    
    // Animation loop
    if (animated) {
      let rotation = 0;
      
      const animate = () => {
        rotation += 0.002;
        drawFlowerOfLife(rotation);
        requestAnimationFrame(animate);
      };
      
      const animationFrame = requestAnimationFrame(animate);
      
      // Cleanup
      return () => {
        cancelAnimationFrame(animationFrame);
      };
    }
  }, [size, color, background, animated, circleCount]);
  
  return (
    <canvas 
      ref={canvasRef} 
      width={size} 
      height={size} 
      style={{ width: size, height: size }}
    />
  );
}