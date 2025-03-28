import { useEffect, useRef } from 'react';

interface MetatronsCubeProps {
  size?: number;
  color?: string;
  background?: string;
  animated?: boolean;
  boost?: boolean;
}

export function MetatronsCube({ 
  size = 300, 
  color = "#f0f0ff", 
  background = "transparent",
  animated = true,
  boost = false
}: MetatronsCubeProps) {
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
    const radius = size * 0.4;
    
    // Draw Metatron's Cube
    const drawMetatronsCube = (rotation = 0) => {
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
      
      // 1. Draw the center circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.08, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      
      // 2. Draw the first ring of 6 circles
      const firstRingPoints = [];
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const x = centerX + radius * 0.4 * Math.cos(angle);
        const y = centerY + radius * 0.4 * Math.sin(angle);
        
        firstRingPoints.push({ x, y });
        
        // Draw circle at this point
        ctx.beginPath();
        ctx.arc(x, y, radius * 0.08, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      }
      
      // 3. Draw the second ring (if boosted)
      const secondRingPoints = [];
      if (boost) {
        for (let i = 0; i < 12; i++) {
          const angle = (i / 12) * Math.PI * 2;
          const x = centerX + radius * 0.8 * Math.cos(angle);
          const y = centerY + radius * 0.8 * Math.sin(angle);
          
          secondRingPoints.push({ x, y });
          
          // Draw circle at this point
          ctx.beginPath();
          ctx.arc(x, y, radius * 0.08, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();
        }
      }
      
      // 4. Connect the points to form the cube pattern
      
      // Connect center to all first ring points
      for (const point of firstRingPoints) {
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
      }
      
      // Connect first ring points to each other
      for (let i = 0; i < firstRingPoints.length; i++) {
        for (let j = i + 1; j < firstRingPoints.length; j++) {
          ctx.beginPath();
          ctx.moveTo(firstRingPoints[i].x, firstRingPoints[i].y);
          ctx.lineTo(firstRingPoints[j].x, firstRingPoints[j].y);
          ctx.stroke();
        }
      }
      
      // If boosted, connect to second ring
      if (boost && secondRingPoints.length > 0) {
        // Connect first ring to second ring
        for (const innerPoint of firstRingPoints) {
          for (const outerPoint of secondRingPoints) {
            // Only connect points that are within a certain angle to avoid excessive lines
            const angle = Math.atan2(outerPoint.y - innerPoint.y, outerPoint.x - innerPoint.x);
            const originalAngle = Math.atan2(innerPoint.y - centerY, innerPoint.x - centerX);
            const angleDiff = Math.abs(angle - originalAngle);
            
            if (angleDiff < Math.PI / 4 || angleDiff > Math.PI * 7 / 4) {
              ctx.beginPath();
              ctx.moveTo(innerPoint.x, innerPoint.y);
              ctx.lineTo(outerPoint.x, outerPoint.y);
              ctx.stroke();
            }
          }
        }
        
        // Connect second ring points to adjacent points
        for (let i = 0; i < secondRingPoints.length; i++) {
          const next = (i + 1) % secondRingPoints.length;
          ctx.beginPath();
          ctx.moveTo(secondRingPoints[i].x, secondRingPoints[i].y);
          ctx.lineTo(secondRingPoints[next].x, secondRingPoints[next].y);
          ctx.stroke();
        }
      }
      
      // Draw outer circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.restore();
    };
    
    // Initial draw
    drawMetatronsCube();
    
    // Animation loop
    if (animated) {
      let rotation = 0;
      
      const animate = () => {
        rotation += 0.005;
        drawMetatronsCube(rotation);
        requestAnimationFrame(animate);
      };
      
      const animationFrame = requestAnimationFrame(animate);
      
      // Cleanup
      return () => {
        cancelAnimationFrame(animationFrame);
      };
    }
  }, [size, color, background, animated, boost]);
  
  return (
    <canvas 
      ref={canvasRef} 
      width={size} 
      height={size} 
      style={{ width: size, height: size }}
    />
  );
}