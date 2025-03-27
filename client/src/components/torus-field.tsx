import { useSacred } from "@/context/sacred-context";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export default function TorusField() {
  const { torusField, isTorusRotating, isTorusPulsing, toggleTorusRotation, toggleTorusPulse, resetTorus } = useSacred();
  const torusRef = useRef<HTMLDivElement>(null);

  // Create animated torus rings and pulses
  useEffect(() => {
    if (!torusRef.current) return;
    
    // Clear existing rings and pulses
    const container = torusRef.current;
    container.innerHTML = '';
    
    // Create torus rings
    const rings = [
      { width: 180, height: 80, top: 85, left: 35 },
      { width: 200, height: 100, top: 75, left: 25 },
      { width: 220, height: 120, top: 65, left: 15 }
    ];
    
    rings.forEach((ring, index) => {
      const ringElement = document.createElement('div');
      ringElement.className = cn(
        'torus-ring absolute rounded-full border-2 border-violet-500/50',
        isTorusRotating ? 'animate-[torus-rotation_12s_linear_infinite]' : ''
      );
      
      Object.assign(ringElement.style, {
        width: `${ring.width}px`,
        height: `${ring.height}px`,
        top: `${ring.top}px`,
        left: `${ring.left}px`,
        transformStyle: 'preserve-3d',
        animation: isTorusRotating ? 'torus-rotation 12s linear infinite' : 'none'
      });
      
      container.appendChild(ringElement);
    });
    
    // Create energy pulse if active
    if (isTorusPulsing) {
      const pulseElement = document.createElement('div');
      pulseElement.className = 'energy-pulse absolute rounded-full';
      
      Object.assign(pulseElement.style, {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.8) 0%, rgba(139, 92, 246, 0.4) 40%, rgba(139, 92, 246, 0) 70%)',
        animation: 'pulse-wave 4s ease-out infinite'
      });
      
      container.appendChild(pulseElement);
    }
  }, [isTorusRotating, isTorusPulsing, torusField]);

  return (
    <div className="bg-black p-4 rounded-lg border border-purple-800/20 dark:bg-sacred-black flex flex-col items-center">
      <h2 className="font-medium text-lg mb-3 text-white self-start font-montserrat">Torus Field</h2>
      
      <div ref={torusRef} className="torus-field relative w-[250px] h-[250px] my-4">
        {/* Torus rings and pulses are created dynamically in useEffect */}
      </div>
      
      <style>{`
        @keyframes torus-rotation {
          0% {
            transform: rotateX(80deg) rotateY(0deg);
          }
          100% {
            transform: rotateX(80deg) rotateY(360deg);
          }
        }
        
        @keyframes pulse-wave {
          0% {
            width: 0;
            height: 0;
            opacity: 1;
          }
          100% {
            width: 300px;
            height: 300px;
            opacity: 0;
          }
        }
      `}</style>
      
      <div className="w-full mt-2">
        <div className="bg-gray-900 p-3 rounded-md">
          <h3 className="text-sm font-medium text-white mb-2">Torus Field Data</h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-gray-400">Frequency:</span>
              <span className="font-mono text-teal-500 ml-1">
                {torusField?.torus_frequency || 0} Hz
              </span>
            </div>
            <div>
              <span className="text-gray-400">Coherence:</span>
              <span className="font-mono text-teal-500 ml-1">
                {torusField?.coherence || 0}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Phase Angle:</span>
              <span className="font-mono text-teal-500 ml-1">
                {torusField?.phase_angle?.toFixed(1) || 0}°
              </span>
            </div>
            <div>
              <span className="text-gray-400">Tesla Node:</span>
              <span className="font-mono text-teal-500 ml-1">
                {torusField?.tesla_node || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="w-full mt-3 grid grid-cols-3 gap-2">
        <Button 
          onClick={toggleTorusRotation}
          variant="outline"
          className={cn(
            "bg-black border border-purple-800/50 py-1 rounded-md text-xs text-white font-medium hover:bg-purple-800/20 transition-colors",
            isTorusRotating && "bg-purple-800/20"
          )}
        >
          Rotation
        </Button>
        <Button 
          onClick={toggleTorusPulse}
          variant="outline"
          className={cn(
            "bg-black border border-purple-800/50 py-1 rounded-md text-xs text-white font-medium hover:bg-purple-800/20 transition-colors",
            isTorusPulsing && "bg-purple-800/20"
          )}
        >
          Pulse
        </Button>
        <Button 
          onClick={resetTorus}
          variant="outline"
          className="bg-black border border-purple-800/50 py-1 rounded-md text-xs text-white font-medium hover:bg-purple-800/20 transition-colors"
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
