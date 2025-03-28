import React, { useEffect, useRef } from 'react';

interface CropCircleProps {
  size: number;
  color: string;
  animated?: boolean;
  complexity?: number; // Controls the complexity of the crop circle pattern
  rotation?: number;   // Controls the rotation of the pattern
}

const CropCircle: React.FC<CropCircleProps> = ({ 
  size, 
  color, 
  animated = false, 
  complexity = 3,
  rotation = 0
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Draw the crop circle pattern on the canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = size;
    canvas.height = size;
    
    // Clear canvas
    ctx.clearRect(0, 0, size, size);
    
    // Center point
    const centerX = size / 2;
    const centerY = size / 2;
    
    // Radius of the main circle
    const radius = size * 0.45;
    
    // Set styles
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    
    // Draw the main circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();
    
    // Apply rotation to the entire canvas
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-centerX, -centerY);
    
    // Draw inner circular patterns
    drawCropCirclePattern(ctx, centerX, centerY, radius, complexity);
    
    // Draw connecting lines
    drawConnectingLines(ctx, centerX, centerY, radius, complexity);
    
    // Restore canvas rotation
    ctx.restore();
    
    // Add animation if enabled
    if (animated) {
      let animationFrame: number;
      let rotationAngle = 0;
      
      const animate = () => {
        rotationAngle += 0.5;
        
        // Clear canvas
        ctx.clearRect(0, 0, size, size);
        
        // Draw the main circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();
        
        // Apply rotation to the entire canvas
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate((rotationAngle * Math.PI) / 180);
        ctx.translate(-centerX, -centerY);
        
        // Draw inner circular patterns
        drawCropCirclePattern(ctx, centerX, centerY, radius, complexity);
        
        // Draw connecting lines
        drawConnectingLines(ctx, centerX, centerY, radius, complexity);
        
        // Restore canvas rotation
        ctx.restore();
        
        // Continue animation
        animationFrame = requestAnimationFrame(animate);
      };
      
      animate();
      
      // Clean up animation on component unmount
      return () => {
        cancelAnimationFrame(animationFrame);
      };
    }
  }, [size, color, animated, complexity, rotation]);
  
  // Function to draw crop circle patterns
  const drawCropCirclePattern = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number,
    complexity: number
  ) => {
    // Draw inner circles
    for (let i = 1; i <= complexity + 1; i++) {
      const innerRadius = radius * (1 - i / (complexity + 2));
      ctx.beginPath();
      ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    // Draw radial lines
    const numLines = 6 + complexity * 4; // Increase lines with complexity
    for (let i = 0; i < numLines; i++) {
      const angle = (i * 2 * Math.PI) / numLines;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(
        centerX + radius * Math.cos(angle),
        centerY + radius * Math.sin(angle)
      );
      ctx.stroke();
    }
    
    // Draw arcs between circles
    const numArcs = 3 + complexity;
    for (let i = 0; i < numArcs; i++) {
      const arcRadius = radius * 0.3 * (i + 1) / numArcs;
      const arcOffset = radius * 0.5;
      
      // Create several arcs around the center
      for (let j = 0; j < 6; j++) {
        const arcAngle = (j * Math.PI) / 3 + (i % 2) * Math.PI / 6;
        const arcX = centerX + arcOffset * Math.cos(arcAngle);
        const arcY = centerY + arcOffset * Math.sin(arcAngle);
        
        ctx.beginPath();
        ctx.arc(arcX, arcY, arcRadius, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  };
  
  // Function to draw connecting lines
  const drawConnectingLines = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number,
    complexity: number
  ) => {
    // Draw geometric patterns
    const numPoints = 6 + complexity * 2;
    const points: [number, number][] = [];
    
    // Generate points around the circle
    for (let i = 0; i < numPoints; i++) {
      const angle = (i * 2 * Math.PI) / numPoints;
      const x = centerX + radius * 0.8 * Math.cos(angle);
      const y = centerY + radius * 0.8 * Math.sin(angle);
      points.push([x, y]);
    }
    
    // Connect points to create patterns
    for (let i = 0; i < numPoints; i++) {
      // Connect each point to several other points
      for (let j = 1; j <= Math.min(complexity, numPoints / 2); j++) {
        const targetIndex = (i + j) % numPoints;
        ctx.beginPath();
        ctx.moveTo(points[i][0], points[i][1]);
        ctx.lineTo(points[targetIndex][0], points[targetIndex][1]);
        ctx.stroke();
      }
    }
  };
  
  return (
    <canvas 
      ref={canvasRef} 
      width={size} 
      height={size} 
      style={{ 
        width: size, 
        height: size,
        opacity: animated ? '0.85' : '1'
      }}
    />
  );
};

export default CropCircle;