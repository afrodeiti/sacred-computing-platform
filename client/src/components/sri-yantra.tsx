import { useSacred } from "@/context/sacred-context";
import { Button } from "@/components/ui/button";

export default function SriYantra() {
  const { sriYantra, encodeWithSriYantra } = useSacred();

  return (
    <div className="bg-black p-4 rounded-lg border border-purple-800/20 dark:bg-sacred-black flex flex-col items-center">
      <h2 className="font-medium text-lg mb-3 text-white self-start font-montserrat">Sri Yantra</h2>
      
      <div className="sri-yantra-container w-full flex justify-center my-4">
        <svg viewBox="0 0 200 200" width="150" height="150">
          {/* Outer square */}
          <rect x="25" y="25" width="150" height="150" stroke="#E6B422" strokeWidth="1" fill="none" />
          
          {/* Outer circle */}
          <circle cx="100" cy="100" r="75" stroke="#E6B422" strokeWidth="1" fill="none" />
          
          {/* Downward triangles (Shiva - masculine) */}
          <path d="M100,40 L160,130 L40,130 Z" stroke="#3B82F6" strokeWidth="1" fill="none" />
          <path d="M100,50 L150,120 L50,120 Z" stroke="#3B82F6" strokeWidth="1" fill="none" />
          <path d="M100,60 L140,110 L60,110 Z" stroke="#3B82F6" strokeWidth="1" fill="none" />
          <path d="M100,70 L130,105 L70,105 Z" stroke="#3B82F6" strokeWidth="1" fill="none" />
          
          {/* Upward triangles (Shakti - feminine) */}
          <path d="M100,140 L40,70 L160,70 Z" stroke="#EC4899" strokeWidth="1" fill="none" />
          <path d="M100,130 L50,80 L150,80 Z" stroke="#EC4899" strokeWidth="1" fill="none" />
          <path d="M100,120 L60,90 L140,90 Z" stroke="#EC4899" strokeWidth="1" fill="none" />
          <path d="M100,110 L80,95 L120,95 Z" stroke="#EC4899" strokeWidth="1" fill="none" />
          
          {/* Central bindu point */}
          <circle cx="100" cy="100" r="3" fill="#E6B422" className="animate-pulse" />
        </svg>
      </div>
      
      <div className="w-full mt-2">
        <div className="bg-gray-900 p-3 rounded-md">
          <h3 className="text-sm font-medium text-white mb-2">Sri Yantra Data</h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-gray-400">Bindu:</span>
              <span className="font-mono text-teal-500 ml-1 text-xs">
                {sriYantra?.bindu?.substring(0, 6) || 'n/a'}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Yantra Code:</span>
              <span className="font-mono text-teal-500 ml-1 text-xs">
                {sriYantra?.yantra_code || 'n/a'}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="w-full mt-3">
        <Button 
          onClick={encodeWithSriYantra}
          className="w-full bg-black border border-purple-800/50 py-1 rounded-md text-xs text-white font-medium hover:bg-purple-800/20 transition-colors"
          variant="outline"
        >
          Encode Intention
        </Button>
      </div>
    </div>
  );
}
