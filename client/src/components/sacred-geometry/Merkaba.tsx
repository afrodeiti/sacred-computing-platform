import React, { useEffect, useRef } from 'react';

export interface MerkabaProps {
  size?: number;
  color?: string;
  animated?: boolean;
}

const Merkaba: React.FC<MerkabaProps> = ({
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
      
      // Merkaba parameters
      const maxRadius = size * 0.4;
      
      // Update angle for animation
      if (animated) {
        angle += 0.01;
      }
      
      ctx.save();
      ctx.translate(centerX, centerY);
      
      // Draw the outer circle
      ctx.beginPath();
      ctx.arc(0, 0, maxRadius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Draw the two interlocking tetrahedrons (simplified in 2D as triangles)
      const tetrahedronRadius = maxRadius * 0.85;
      
      // Upward-pointing tetrahedron (masculine energy)
      ctx.save();
      if (animated) {
        ctx.rotate(angle * 0.5);
      }
      
      ctx.beginPath();
      const upPoints = [];
      for (let i = 0; i < 3; i++) {
        const pointAngle = (i / 3) * Math.PI * 2 + Math.PI / 6;
        const x = Math.cos(pointAngle) * tetrahedronRadius;
        const y = Math.sin(pointAngle) * tetrahedronRadius;
        upPoints.push({ x, y });
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      
      // Create gradient for upward tetrahedron
      const upGradient = ctx.createLinearGradient(0, -tetrahedronRadius, 0, tetrahedronRadius);
      upGradient.addColorStop(0, 'rgba(100, 200, 255, 0.9)'); // Blue (masculine)
      upGradient.addColorStop(1, 'rgba(70, 120, 255, 0.2)');
      
      ctx.strokeStyle = upGradient;
      ctx.lineWidth = 2;
      ctx.stroke();
      
      ctx.fillStyle = 'rgba(100, 200, 255, 0.1)';
      ctx.fill();
      
      // Draw energy lines within upward tetrahedron
      ctx.beginPath();
      ctx.moveTo(upPoints[0].x, upPoints[0].y);
      ctx.lineTo(0, 0);
      ctx.moveTo(upPoints[1].x, upPoints[1].y);
      ctx.lineTo(0, 0);
      ctx.moveTo(upPoints[2].x, upPoints[2].y);
      ctx.lineTo(0, 0);
      
      ctx.strokeStyle = 'rgba(150, 220, 255, 0.4)';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      ctx.restore();
      
      // Downward-pointing tetrahedron (feminine energy)
      ctx.save();
      if (animated) {
        ctx.rotate(-angle * 0.5);
      } else {
        ctx.rotate(Math.PI);
      }
      
      ctx.beginPath();
      const downPoints = [];
      for (let i = 0; i < 3; i++) {
        const pointAngle = (i / 3) * Math.PI * 2 + Math.PI / 6;
        const x = Math.cos(pointAngle) * tetrahedronRadius;
        const y = Math.sin(pointAngle) * tetrahedronRadius;
        downPoints.push({ x, y });
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      
      // Create gradient for downward tetrahedron
      const downGradient = ctx.createLinearGradient(0, -tetrahedronRadius, 0, tetrahedronRadius);
      downGradient.addColorStop(0, 'rgba(255, 100, 200, 0.9)'); // Pink (feminine)
      downGradient.addColorStop(1, 'rgba(255, 70, 120, 0.2)');
      
      ctx.strokeStyle = downGradient;
      ctx.lineWidth = 2;
      ctx.stroke();
      
      ctx.fillStyle = 'rgba(255, 100, 200, 0.1)';
      ctx.fill();
      
      // Draw energy lines within downward tetrahedron
      ctx.beginPath();
      ctx.moveTo(downPoints[0].x, downPoints[0].y);
      ctx.lineTo(0, 0);
      ctx.moveTo(downPoints[1].x, downPoints[1].y);
      ctx.lineTo(0, 0);
      ctx.moveTo(downPoints[2].x, downPoints[2].y);
      ctx.lineTo(0, 0);
      
      ctx.strokeStyle = 'rgba(255, 150, 220, 0.4)';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      ctx.restore();
      
      // Draw the central sphere (unity point)
      ctx.beginPath();
      ctx.arc(0, 0, maxRadius * 0.15, 0, Math.PI * 2);
      
      const sphereGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, maxRadius * 0.15);
      sphereGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
      sphereGradient.addColorStop(1, 'rgba(220, 220, 255, 0.5)');
      
      ctx.fillStyle = sphereGradient;
      ctx.fill();
      
      // Draw spinning energy field effect
      if (animated) {
        const fieldPoints = 8;
        const fieldRadius = maxRadius * 0.6;
        
        for (let i = 0; i < fieldPoints; i++) {
          const fieldAngle = (i / fieldPoints) * Math.PI * 2 + angle * 2;
          const fieldX = Math.cos(fieldAngle) * fieldRadius;
          const fieldY = Math.sin(fieldAngle) * fieldRadius;
          
          // Draw energy spiral
          ctx.beginPath();
          for (let j = 0; j <= 10; j++) {
            const spiralAngle = fieldAngle + (j / 10) * Math.PI * 0.5;
            const spiralRadius = (1 - j / 10) * fieldRadius * 0.4;
            const spiralX = fieldX + Math.cos(spiralAngle) * spiralRadius;
            const spiralY = fieldY + Math.sin(spiralAngle) * spiralRadius;
            
            if (j === 0) {
              ctx.moveTo(spiralX, spiralY);
            } else {
              ctx.lineTo(spiralX, spiralY);
            }
          }
          
          const spiralGradient = ctx.createLinearGradient(fieldX, fieldY, 0, 0);
          spiralGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
          spiralGradient.addColorStop(1, 'rgba(200, 200, 255, 0)');
          
          ctx.strokeStyle = spiralGradient;
          ctx.lineWidth = 0.8;
          ctx.stroke();
          
          // Draw small energy particles
          if (i % 2 === 0) {
            const particleCount = 5;
            for (let k = 0; k < particleCount; k++) {
              const particleDistance = (k / particleCount) * fieldRadius * 0.4;
              const particleAngle = fieldAngle + Math.sin(angle * 3) * 0.5;
              const particleX = fieldX + Math.cos(particleAngle) * particleDistance;
              const particleY = fieldY + Math.sin(particleAngle) * particleDistance;
              
              ctx.beginPath();
              ctx.arc(particleX, particleY, 1, 0, Math.PI * 2);
              ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
              ctx.fill();
            }
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
  }, [size, color, animated]);
  
  return (
    <div className={`sacred-geometry merkaba ${animated ? 'animated' : ''}`}>
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

export default Merkaba;