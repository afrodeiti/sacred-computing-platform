import React, { useEffect, useRef } from 'react';

export interface MetatronsCubeProps {
  size?: number;
  color?: string;
  animated?: boolean;
  boost?: boolean;
}

const MetatronsCube: React.FC<MetatronsCubeProps> = ({
  size = 200,
  color = '#ffffff',
  animated = false,
  boost = false
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
      
      // Metatron's Cube parameters
      const maxRadius = size * 0.4;
      const nodeCount = 13; // Central node plus 12 outer nodes
      
      // Update angle for animation
      if (animated) {
        angle += 0.005;
      }
      
      ctx.save();
      ctx.translate(centerX, centerY);
      
      if (animated) {
        ctx.rotate(angle * 0.1);
      }
      
      // Draw the outer circle
      ctx.beginPath();
      ctx.arc(0, 0, maxRadius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Draw the Fruit of Life pattern (13 circles)
      const innerRadius = maxRadius * 0.1; // Radius of each small circle
      
      // Define the positions of the 13 circles
      const positions = [
        { x: 0, y: 0 }, // Center
        
        // First ring - 6 circles
        { x: 0, y: -maxRadius * 0.4 },
        { x: maxRadius * 0.35, y: -maxRadius * 0.2 },
        { x: maxRadius * 0.35, y: maxRadius * 0.2 },
        { x: 0, y: maxRadius * 0.4 },
        { x: -maxRadius * 0.35, y: maxRadius * 0.2 },
        { x: -maxRadius * 0.35, y: -maxRadius * 0.2 },
        
        // Second ring - 6 more circles
        { x: 0, y: -maxRadius * 0.8 },
        { x: maxRadius * 0.7, y: -maxRadius * 0.4 },
        { x: maxRadius * 0.7, y: maxRadius * 0.4 },
        { x: 0, y: maxRadius * 0.8 },
        { x: -maxRadius * 0.7, y: maxRadius * 0.4 },
        { x: -maxRadius * 0.7, y: -maxRadius * 0.4 }
      ];
      
      // Draw each circle
      positions.forEach((pos, index) => {
        // Add animation effect to positions if needed
        let drawX = pos.x;
        let drawY = pos.y;
        
        if (animated && index > 0) {
          // Add subtle movement to outer nodes
          const orbitSpeed = index % 2 === 0 ? 1 : -1;
          const orbitRadius = index > 6 ? 0.05 : 0.03;
          drawX += Math.cos(angle * orbitSpeed + index) * maxRadius * orbitRadius;
          drawY += Math.sin(angle * orbitSpeed + index) * maxRadius * orbitRadius;
        }
        
        ctx.beginPath();
        ctx.arc(drawX, drawY, innerRadius, 0, Math.PI * 2);
        
        // Different styling based on position
        if (index === 0) {
          // Central circle
          const centerGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, innerRadius);
          centerGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
          centerGradient.addColorStop(1, 'rgba(180, 180, 255, 0.5)');
          
          ctx.fillStyle = centerGradient;
          ctx.fill();
        } else {
          // Outer circles
          const intensity = boost ? 0.7 : 0.5;
          let circleColor;
          
          if (index <= 6) {
            // First ring - more blue/purple
            circleColor = `rgba(180, 160, 255, ${intensity})`;
          } else {
            // Second ring - more pink/violet
            circleColor = `rgba(220, 140, 255, ${intensity})`;
          }
          
          ctx.fillStyle = circleColor;
          ctx.fill();
          
          // Add subtle glow effect
          if (boost || animated) {
            ctx.shadowColor = circleColor;
            ctx.shadowBlur = 5;
          }
        }
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
        
        ctx.shadowBlur = 0;
      });
      
      // Draw the connecting lines - full Metatron's Cube
      ctx.beginPath();
      
      // Connect all points to create the Metatron's Cube pattern
      for (let i = 0; i < positions.length; i++) {
        for (let j = i + 1; j < positions.length; j++) {
          // Skip some connections to avoid overloading
          const distance = Math.sqrt(
            Math.pow(positions[i].x - positions[j].x, 2) + 
            Math.pow(positions[i].y - positions[j].y, 2)
          );
          
          // Only draw lines between nearby nodes
          if (distance < maxRadius * 0.8) {
            ctx.moveTo(positions[i].x, positions[i].y);
            ctx.lineTo(positions[j].x, positions[j].y);
          }
        }
      }
      
      const lineGradient = ctx.createLinearGradient(
        -maxRadius, -maxRadius, maxRadius, maxRadius
      );
      lineGradient.addColorStop(0, 'rgba(150, 100, 255, 0.2)');
      lineGradient.addColorStop(0.5, 'rgba(255, 150, 255, 0.2)');
      lineGradient.addColorStop(1, 'rgba(150, 100, 255, 0.2)');
      
      ctx.strokeStyle = lineGradient;
      ctx.lineWidth = 0.5;
      ctx.stroke();
      
      // Draw platonic solids (simplified outlines)
      if (boost) {
        // Draw cube (hexahedron)
        const cubeSize = maxRadius * 0.5;
        ctx.beginPath();
        
        // Front face
        ctx.moveTo(-cubeSize/2, -cubeSize/2);
        ctx.lineTo(cubeSize/2, -cubeSize/2);
        ctx.lineTo(cubeSize/2, cubeSize/2);
        ctx.lineTo(-cubeSize/2, cubeSize/2);
        ctx.lineTo(-cubeSize/2, -cubeSize/2);
        
        // Back face connections
        ctx.moveTo(-cubeSize/3, -cubeSize/3);
        ctx.lineTo(cubeSize/3, -cubeSize/3);
        ctx.lineTo(cubeSize/3, cubeSize/3);
        ctx.lineTo(-cubeSize/3, cubeSize/3);
        ctx.lineTo(-cubeSize/3, -cubeSize/3);
        
        // Connect front to back
        ctx.moveTo(-cubeSize/2, -cubeSize/2);
        ctx.lineTo(-cubeSize/3, -cubeSize/3);
        ctx.moveTo(cubeSize/2, -cubeSize/2);
        ctx.lineTo(cubeSize/3, -cubeSize/3);
        ctx.moveTo(cubeSize/2, cubeSize/2);
        ctx.lineTo(cubeSize/3, cubeSize/3);
        ctx.moveTo(-cubeSize/2, cubeSize/2);
        ctx.lineTo(-cubeSize/3, cubeSize/3);
        
        ctx.strokeStyle = 'rgba(255, 180, 255, 0.15)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
        
        // Draw tetrahedron outline
        const tetraSize = maxRadius * 0.6;
        ctx.beginPath();
        
        // Base triangle
        const triHeight = tetraSize * Math.sqrt(3) / 2;
        ctx.moveTo(0, -triHeight * 2/3);
        ctx.lineTo(tetraSize/2, triHeight * 1/3);
        ctx.lineTo(-tetraSize/2, triHeight * 1/3);
        ctx.closePath();
        
        // Connect to apex
        ctx.moveTo(0, -triHeight * 2/3);
        ctx.lineTo(0, 0);
        ctx.moveTo(tetraSize/2, triHeight * 1/3);
        ctx.lineTo(0, 0);
        ctx.moveTo(-tetraSize/2, triHeight * 1/3);
        ctx.lineTo(0, 0);
        
        ctx.strokeStyle = 'rgba(180, 255, 255, 0.1)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
      
      // Add energy particles if animated
      if (animated) {
        const particleCount = boost ? 30 : 15;
        
        for (let i = 0; i < particleCount; i++) {
          const particleAngle = (i / particleCount) * Math.PI * 2 + angle * 3;
          const particleDistance = maxRadius * (0.2 + Math.random() * 0.7);
          const particleX = Math.cos(particleAngle) * particleDistance;
          const particleY = Math.sin(particleAngle) * particleDistance;
          
          const particleSize = 1 + Math.random() * 1.5;
          
          ctx.beginPath();
          ctx.arc(particleX, particleY, particleSize, 0, Math.PI * 2);
          
          // Particles color based on position
          const distanceRatio = particleDistance / maxRadius;
          if (distanceRatio < 0.4) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          } else if (distanceRatio < 0.7) {
            ctx.fillStyle = 'rgba(200, 180, 255, 0.7)';
          } else {
            ctx.fillStyle = 'rgba(150, 100, 255, 0.6)';
          }
          
          ctx.fill();
        }
      }
      
      // Add boost indicators
      if (boost) {
        // Draw energy field
        ctx.beginPath();
        ctx.arc(0, 0, maxRadius * 1.05, 0, Math.PI * 2);
        
        const boostGradient = ctx.createRadialGradient(
          0, 0, maxRadius * 0.5,
          0, 0, maxRadius * 1.05
        );
        boostGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
        boostGradient.addColorStop(1, 'rgba(180, 100, 255, 0.15)');
        
        ctx.fillStyle = boostGradient;
        ctx.fill();
        
        // Add pulses if animated
        if (animated) {
          const pulseCount = 3;
          for (let i = 0; i < pulseCount; i++) {
            const pulsePhase = (i / pulseCount) * Math.PI * 2;
            const pulseSize = 0.8 + 0.3 * Math.sin(angle * 5 + pulsePhase);
            
            ctx.beginPath();
            ctx.arc(0, 0, maxRadius * pulseSize, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(255, 200, 255, ${0.1 * Math.sin(angle * 5 + pulsePhase) ** 2})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
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
  }, [size, color, animated, boost]);
  
  return (
    <div className={`sacred-geometry metatrons-cube ${animated ? 'animated' : ''} ${boost ? 'boosted' : ''}`}>
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

export default MetatronsCube;