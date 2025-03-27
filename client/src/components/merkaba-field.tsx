import { useSacred } from "@/context/sacred-context";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function MerkabaField() {
  const { merkabaField, activateMerkaba } = useSacred();
  const [rotationSpeed, setRotationSpeed] = useState(20); // in seconds

  return (
    <div className="bg-black p-4 rounded-lg border border-purple-800/20 dark:bg-sacred-black flex flex-col items-center">
      <h2 className="font-medium text-lg mb-3 text-white self-start font-montserrat">Merkaba Field</h2>
      
      <div className="merkaba-container h-48 w-48 my-4 relative">
        <div className="merkaba absolute w-full h-full" style={{
          animation: `rotate-merkaba ${rotationSpeed}s linear infinite`,
          transformStyle: 'preserve-3d'
        }}>
          {/* Tetrahedron Up - Masculine Energy */}
          <svg viewBox="0 0 100 100" width="100%" height="100%" className="absolute top-0 left-0">
            <path 
              d="M50,20 L80,70 L20,70 Z" 
              fill="none" 
              stroke="#3B82F6" 
              strokeWidth="1" 
              opacity="0.7"
            />
          </svg>
          
          {/* Tetrahedron Down - Feminine Energy */}
          <svg 
            viewBox="0 0 100 100" 
            width="100%" 
            height="100%" 
            className="absolute top-0 left-0" 
            style={{ transform: 'rotateX(180deg)' }}
          >
            <path 
              d="M50,20 L80,70 L20,70 Z" 
              fill="none" 
              stroke="#EC4899" 
              strokeWidth="1" 
              opacity="0.7"
            />
          </svg>
        </div>
      </div>

      <style jsx>{`
        @keyframes rotate-merkaba {
          0% {
            transform: rotateX(0) rotateY(0) rotateZ(0);
          }
          100% {
            transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg);
          }
        }
      `}</style>
      
      <div className="w-full mt-2">
        <div className="bg-gray-900 p-3 rounded-md">
          <h3 className="text-sm font-medium text-white mb-2">Merkaba Data</h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-gray-400">Field Intensity:</span>
              <span className="font-mono text-teal-500 ml-1">
                {merkabaField?.field_intensity?.toFixed(1) || 0}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Solfeggio:</span>
              <span className="font-mono text-teal-500 ml-1">
                {merkabaField?.solfeggio_alignment || 0} Hz
              </span>
            </div>
            <div>
              <span className="text-gray-400">Tetra Up:</span>
              <span className="font-mono text-teal-500 ml-1 text-xs">
                {merkabaField?.tetra_up || 'n/a'}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Tetra Down:</span>
              <span className="font-mono text-teal-500 ml-1 text-xs">
                {merkabaField?.tetra_down || 'n/a'}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="w-full mt-3">
        <Button 
          onClick={activateMerkaba}
          className="w-full bg-black border border-purple-800/50 py-1 rounded-md text-xs text-white font-medium hover:bg-purple-800/20 transition-colors"
          variant="outline"
        >
          Activate Field
        </Button>
      </div>
    </div>
  );
}
