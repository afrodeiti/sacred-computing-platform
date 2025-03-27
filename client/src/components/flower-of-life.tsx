import { useSacred } from "@/context/sacred-context";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";

export default function FlowerOfLife() {
  const { flowerOfLife, blessWithFlowerOfLife } = useSacred();
  const containerRef = useRef<HTMLDivElement>(null);

  // Create flower of life pattern
  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    container.innerHTML = '';
    
    // Central circle
    const centralCircle = document.createElement('div');
    centralCircle.className = 'flower-circle absolute';
    centralCircle.style.top = '50%';
    centralCircle.style.left = '50%';
    container.appendChild(centralCircle);
    
    // First ring of 6 circles
    const positions = [
      { top: '50%', left: 'calc(50% + 30px)' },
      { top: 'calc(50% + 26px)', left: 'calc(50% + 15px)' },
      { top: 'calc(50% + 26px)', left: 'calc(50% - 15px)' },
      { top: '50%', left: 'calc(50% - 30px)' },
      { top: 'calc(50% - 26px)', left: 'calc(50% - 15px)' },
      { top: 'calc(50% - 26px)', left: 'calc(50% + 15px)' }
    ];
    
    positions.forEach(pos => {
      const circle = document.createElement('div');
      circle.className = 'flower-circle absolute';
      circle.style.top = pos.top;
      circle.style.left = pos.left;
      container.appendChild(circle);
    });
    
    // Second ring (partial) for visual effect
    const outerPositions = [
      { top: '50%', left: 'calc(50% + 60px)' },
      { top: 'calc(50% + 52px)', left: 'calc(50% + 30px)' },
      { top: 'calc(50% + 52px)', left: 'calc(50% - 30px)' },
      { top: '50%', left: 'calc(50% - 60px)' },
      { top: 'calc(50% - 52px)', left: 'calc(50% - 30px)' },
      { top: 'calc(50% - 52px)', left: 'calc(50% + 30px)' }
    ];
    
    outerPositions.forEach(pos => {
      const circle = document.createElement('div');
      circle.className = 'flower-circle absolute';
      circle.style.top = pos.top;
      circle.style.left = pos.left;
      container.appendChild(circle);
    });
  }, []);

  return (
    <div className="bg-black p-4 rounded-lg border border-purple-800/20 dark:bg-sacred-black flex flex-col items-center">
      <h2 className="font-medium text-lg mb-3 text-white self-start font-montserrat">Flower of Life</h2>
      
      <div ref={containerRef} className="flower-of-life w-full h-40 flex justify-center my-2 relative">
        {/* Circles are created dynamically in useEffect */}
      </div>

      <style jsx>{`
        .flower-circle {
          position: absolute;
          border: 1px solid rgba(230, 180, 34, 0.6);
          border-radius: 50%;
          width: 60px;
          height: 60px;
          transform: translate(-50%, -50%);
        }
      `}</style>
      
      <div className="w-full mt-2">
        <div className="bg-gray-900 p-3 rounded-md">
          <h3 className="text-sm font-medium text-white mb-2">Flower of Life Data</h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-gray-400">Planetary:</span>
              <span className="font-mono text-teal-500 ml-1">
                {flowerOfLife?.planetary_alignment || 'n/a'}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Cosmic Degree:</span>
              <span className="font-mono text-teal-500 ml-1">
                {flowerOfLife?.cosmic_degree?.toFixed(1) || 0}°
              </span>
            </div>
            <div>
              <span className="text-gray-400">Duration:</span>
              <span className="font-mono text-teal-500 ml-1">
                {flowerOfLife?.optimal_duration || 0} sec
              </span>
            </div>
            <div>
              <span className="text-gray-400">Vesica Code:</span>
              <span className="font-mono text-teal-500 ml-1 text-xs">
                {flowerOfLife?.vesica_pisces_code || 'n/a'}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="w-full mt-3">
        <Button 
          onClick={blessWithFlowerOfLife}
          className="w-full bg-black border border-purple-800/50 py-1 rounded-md text-xs text-white font-medium hover:bg-purple-800/20 transition-colors"
          variant="outline"
        >
          Create Blessing
        </Button>
      </div>
    </div>
  );
}
