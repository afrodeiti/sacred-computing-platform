import { useSacred } from "@/context/sacred-context";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

export default function MetatronsCube() {
  const { metatronCube, isMetatronBoostActive, toggleMetatronBoost, resetMetatron } = useSacred();
  const svgRef = useRef<SVGSVGElement>(null);

  // Animate the Metatron's Cube lines when data changes
  useEffect(() => {
    if (!svgRef.current || !metatronCube) return;
    
    // Add class to animate stroke-dasharray
    const paths = svgRef.current.querySelectorAll('path');
    paths.forEach(path => {
      path.classList.add('metatron-animate');
    });
    
    // Clean up animation class when component unmounts
    return () => {
      paths.forEach(path => {
        path.classList.remove('metatron-animate');
      });
    };
  }, [metatronCube]);

  return (
    <div className="bg-black p-4 rounded-lg border border-purple-800/20 dark:bg-sacred-black flex flex-col items-center">
      <h2 className="font-medium text-lg mb-3 text-white self-start font-montserrat">Metatron's Cube</h2>
      
      <div className="my-4 phi-container w-full flex justify-center items-center">
        <svg 
          ref={svgRef}
          viewBox="0 0 200 200" 
          width="160" 
          height="160" 
          className="metatron-cube"
        >
          {/* Central point */}
          <circle cx="100" cy="100" r="3" fill="#E6B422" />
          
          {/* First circle of 6 points */}
          <circle cx="130" cy="100" r="3" fill="#E6B422" />
          <circle cx="115" cy="125.98" r="3" fill="#E6B422" />
          <circle cx="85" cy="125.98" r="3" fill="#E6B422" />
          <circle cx="70" cy="100" r="3" fill="#E6B422" />
          <circle cx="85" cy="74.02" r="3" fill="#E6B422" />
          <circle cx="115" cy="74.02" r="3" fill="#E6B422" />
          
          {/* Outer circle of 6 points */}
          <circle cx="160" cy="100" r="3" fill="#E6B422" />
          <circle cx="130" cy="151.96" r="3" fill="#E6B422" />
          <circle cx="70" cy="151.96" r="3" fill="#E6B422" />
          <circle cx="40" cy="100" r="3" fill="#E6B422" />
          <circle cx="70" cy="48.04" r="3" fill="#E6B422" />
          <circle cx="130" cy="48.04" r="3" fill="#E6B422" />
          
          {/* Connecting lines - inner hexagon */}
          <path d="M130,100 L115,125.98 L85,125.98 L70,100 L85,74.02 L115,74.02 L130,100" stroke="#8E44AD" strokeWidth="1" fill="none" />
          
          {/* Connecting lines - outer hexagon */}
          <path d="M160,100 L130,151.96 L70,151.96 L40,100 L70,48.04 L130,48.04 L160,100" stroke="#8E44AD" strokeWidth="1" fill="none" />
          
          {/* Connecting lines - star pattern */}
          <path d="M100,100 L130,100 M100,100 L115,125.98 M100,100 L85,125.98 M100,100 L70,100 M100,100 L85,74.02 M100,100 L115,74.02" stroke="#E6B422" strokeWidth="1" fill="none" />
          
          {/* Connecting lines - extended pattern */}
          <path d="M130,100 L160,100 M115,125.98 L130,151.96 M85,125.98 L70,151.96 M70,100 L40,100 M85,74.02 L70,48.04 M115,74.02 L130,48.04" stroke="#3B82F6" strokeWidth="1" fill="none" />
          
          {/* Platonic solid outlines - only show when boosted */}
          {isMetatronBoostActive && (
            <>
              <path d="M130,100 L70,151.96 L70,48.04 Z" stroke="#EC4899" strokeWidth="0.5" fill="none" opacity="0.4" />
              <path d="M70,100 L130,151.96 L130,48.04 Z" stroke="#EC4899" strokeWidth="0.5" fill="none" opacity="0.4" />
            </>
          )}
        </svg>
      </div>

      <style jsx>{`
        .metatron-animate {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: dash 5s linear forwards infinite;
        }

        @keyframes dash {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
      
      <div className="w-full mt-2">
        <div className="bg-gray-900 p-3 rounded-md">
          <h3 className="text-sm font-medium text-white mb-2">Metatron Data</h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-gray-400">Harmonic:</span>
              <span className="font-mono text-teal-500 ml-1">
                {metatronCube?.harmonic || 0}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Activation Key:</span>
              <span className="font-mono text-teal-500 ml-1">
                {metatronCube?.activation_key || 'n/a'}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="w-full mt-3 grid grid-cols-2 gap-2">
        <Button 
          onClick={toggleMetatronBoost}
          variant="outline"
          className={cn(
            "bg-black border border-purple-800/50 py-1 rounded-md text-xs text-white font-medium hover:bg-purple-800/20 transition-colors",
            isMetatronBoostActive && "bg-purple-800/20"
          )}
        >
          Amplify
        </Button>
        <Button 
          onClick={resetMetatron}
          variant="outline"
          className="bg-black border border-purple-800/50 py-1 rounded-md text-xs text-white font-medium hover:bg-purple-800/20 transition-colors"
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
