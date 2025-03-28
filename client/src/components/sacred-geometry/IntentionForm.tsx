import React, { useEffect, useRef } from 'react';

interface IntentionFormProps {
  size: number;
  color: string;
  animated?: boolean;
  intention?: string;
  frequency?: number;
}

const IntentionForm: React.FC<IntentionFormProps> = ({ 
  size, 
  color, 
  animated = false, 
  intention = "",
  frequency = 7.83
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Convert intention to a geometric pattern based on its semantic meaning and frequency
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
    
    // Center of the canvas
    const centerX = size / 2;
    const centerY = size / 2;
    
    // Base radius for the pattern
    const radius = size * 0.4;
    
    // Set styles
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    
    // Generate a consistent numerical seed from the intention string
    const intentionSeed = generateSeedFromString(intention);
    
    // Use the frequency to influence pattern properties
    const complexity = Math.max(3, Math.min(12, Math.floor(frequency / 60))); // Range 3-12
    const density = Math.max(0.2, Math.min(0.8, frequency / 1000)); // Range 0.2-0.8
    const symmetry = Math.max(3, Math.min(12, Math.floor(intentionSeed * 12))); // Range 3-12
    
    // Draw the intention pattern
    drawIntentionPattern(ctx, centerX, centerY, radius, intentionSeed, complexity, density, symmetry);
    
    // Add animation if enabled
    if (animated) {
      let animationFrame: number;
      let phase = 0;
      
      const animate = () => {
        phase += 0.01;
        if (phase > 2 * Math.PI) phase -= 2 * Math.PI;
        
        // Clear canvas
        ctx.clearRect(0, 0, size, size);
        
        // Draw the animated intention pattern
        drawIntentionPattern(ctx, centerX, centerY, radius, intentionSeed, complexity, density, symmetry, phase);
        
        // Continue animation
        animationFrame = requestAnimationFrame(animate);
      };
      
      animate();
      
      // Clean up animation on component unmount
      return () => {
        cancelAnimationFrame(animationFrame);
      };
    }
  }, [size, color, animated, intention, frequency]);
  
  // Generate a numerical seed from a string
  const generateSeedFromString = (str: string): number => {
    if (!str) return 0.5;
    
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Normalize to 0-1 range
    return (hash & 0xFFFFFFFF) / 0xFFFFFFFF;
  };
  
  // Draw a pattern based on the intention and frequency
  const drawIntentionPattern = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number,
    seed: number,
    complexity: number,
    density: number,
    symmetry: number,
    phase: number = 0
  ) => {
    // Draw base circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();
    
    // Draw cymatic-like pattern (similar to how sound creates patterns)
    drawCymaticPattern(ctx, centerX, centerY, radius, seed, complexity, symmetry, phase);
    
    // Draw intention harmonics (connecting lines)
    drawIntentionHarmonics(ctx, centerX, centerY, radius, seed, complexity, density, symmetry, phase);
    
    // Draw sacred symbols based on intention seed
    drawSacredSymbols(ctx, centerX, centerY, radius, seed, complexity, phase);
  };
  
  // Draw a cymatic-like pattern (similar to sound visualizations)
  const drawCymaticPattern = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number,
    seed: number,
    complexity: number,
    symmetry: number,
    phase: number
  ) => {
    // Draw cymatic rings
    for (let i = 1; i <= complexity; i++) {
      const ringRadius = radius * (i / complexity);
      
      ctx.beginPath();
      
      // Create a wavy circle for each ring
      for (let angle = 0; angle <= Math.PI * 2; angle += 0.05) {
        const waveAmplitude = radius * 0.05 * (1 + Math.sin(complexity * angle + phase));
        const distortion = seed * 0.2 * Math.sin(symmetry * angle + phase * 2);
        
        const x = centerX + (ringRadius + waveAmplitude * distortion) * Math.cos(angle);
        const y = centerY + (ringRadius + waveAmplitude * distortion) * Math.sin(angle);
        
        if (angle === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      ctx.closePath();
      ctx.stroke();
    }
  };
  
  // Draw harmonics connecting lines
  const drawIntentionHarmonics = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number,
    seed: number,
    complexity: number,
    density: number,
    symmetry: number,
    phase: number
  ) => {
    const numPoints = Math.floor(symmetry * 3);
    const points: [number, number][] = [];
    
    // Generate points around the circle
    for (let i = 0; i < numPoints; i++) {
      const angle = (i * 2 * Math.PI) / numPoints;
      const distortion = 0.1 * Math.sin(complexity * angle + phase);
      const r = radius * (0.7 + distortion + 0.2 * seed);
      
      const x = centerX + r * Math.cos(angle);
      const y = centerY + r * Math.sin(angle);
      points.push([x, y]);
    }
    
    // Connect points based on density and seed
    const connectionsPerPoint = Math.floor(density * numPoints / 2);
    
    for (let i = 0; i < numPoints; i++) {
      const seedOffset = Math.floor(seed * numPoints);
      
      for (let j = 1; j <= connectionsPerPoint; j++) {
        const targetIndex = (i + j + seedOffset) % numPoints;
        
        ctx.beginPath();
        ctx.moveTo(points[i][0], points[i][1]);
        
        // Create curved connections for more organic feel
        const midX = (points[i][0] + points[targetIndex][0]) / 2;
        const midY = (points[i][1] + points[targetIndex][1]) / 2;
        const ctrlX = midX + (seed - 0.5) * radius * 0.5 * Math.sin(phase);
        const ctrlY = midY + (seed - 0.5) * radius * 0.5 * Math.cos(phase);
        
        ctx.quadraticCurveTo(ctrlX, ctrlY, points[targetIndex][0], points[targetIndex][1]);
        ctx.stroke();
      }
    }
  };
  
  // Draw sacred symbols based on the intention seed
  const drawSacredSymbols = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number,
    seed: number,
    complexity: number,
    phase: number
  ) => {
    // Determine which symbol to draw based on the seed
    const symbolType = Math.floor(seed * 4); // 0-3
    
    ctx.save();
    ctx.translate(centerX, centerY);
    const rotationAngle = phase || (seed * Math.PI * 2);
    ctx.rotate(rotationAngle);
    
    switch (symbolType) {
      case 0: // Flower of life seed
        drawFlowerSeed(ctx, 0, 0, radius * 0.3, complexity);
        break;
      case 1: // Spiral
        drawSpiral(ctx, 0, 0, radius * 0.7, seed, complexity);
        break;
      case 2: // Star
        drawStar(ctx, 0, 0, radius * 0.6, Math.floor(4 + seed * 8), seed);
        break;
      case 3: // Mandala
        drawMandala(ctx, 0, 0, radius * 0.5, complexity, seed);
        break;
    }
    
    ctx.restore();
  };
  
  // Draw flower of life seed
  const drawFlowerSeed = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    petals: number
  ) => {
    const petalCount = Math.max(6, petals);
    
    // Center circle
    ctx.beginPath();
    ctx.arc(x, y, radius * 0.5, 0, Math.PI * 2);
    ctx.stroke();
    
    // Draw petals as circles
    for (let i = 0; i < petalCount; i++) {
      const angle = (i * 2 * Math.PI) / petalCount;
      const petalX = x + radius * Math.cos(angle);
      const petalY = y + radius * Math.sin(angle);
      
      ctx.beginPath();
      ctx.arc(petalX, petalY, radius * 0.5, 0, Math.PI * 2);
      ctx.stroke();
    }
  };
  
  // Draw spiral
  const drawSpiral = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    seed: number,
    complexity: number
  ) => {
    const maxRotations = 2 + complexity / 2;
    const growthFactor = seed * 0.2 + 0.1;
    
    ctx.beginPath();
    
    for (let angle = 0; angle <= maxRotations * Math.PI * 2; angle += 0.1) {
      const r = growthFactor * angle * radius / (maxRotations * Math.PI * 2);
      const pointX = x + r * Math.cos(angle);
      const pointY = y + r * Math.sin(angle);
      
      if (angle === 0) {
        ctx.moveTo(pointX, pointY);
      } else {
        ctx.lineTo(pointX, pointY);
      }
    }
    
    ctx.stroke();
  };
  
  // Draw star
  const drawStar = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    points: number,
    seed: number
  ) => {
    const innerRadius = radius * (0.3 + seed * 0.2);
    
    ctx.beginPath();
    
    for (let i = 0; i < points * 2; i++) {
      const angle = (i * Math.PI) / points;
      const r = i % 2 === 0 ? radius : innerRadius;
      const pointX = x + r * Math.cos(angle);
      const pointY = y + r * Math.sin(angle);
      
      if (i === 0) {
        ctx.moveTo(pointX, pointY);
      } else {
        ctx.lineTo(pointX, pointY);
      }
    }
    
    ctx.closePath();
    ctx.stroke();
  };
  
  // Draw mandala
  const drawMandala = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    complexity: number,
    seed: number
  ) => {
    const segments = Math.max(6, Math.floor(8 + seed * 12));
    
    // Draw concentric circles
    for (let i = 1; i <= Math.min(5, complexity / 2); i++) {
      const r = radius * (i / 5);
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    // Draw radial lines
    for (let i = 0; i < segments; i++) {
      const angle = (i * 2 * Math.PI) / segments;
      
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + radius * Math.cos(angle), y + radius * Math.sin(angle));
      ctx.stroke();
      
      // Add details along radial lines
      if (complexity > 4) {
        for (let j = 1; j <= 3; j++) {
          const r = radius * (j / 4);
          const width = (Math.PI * r) / segments * 0.7;
          
          const innerAngle = angle - width / r;
          const outerAngle = angle + width / r;
          
          ctx.beginPath();
          ctx.arc(x, y, r, innerAngle, outerAngle);
          ctx.stroke();
        }
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

export default IntentionForm;