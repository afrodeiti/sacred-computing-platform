import { useSacred } from "@/context/sacred-context";
import Header from "@/components/header";
import IntentionInput from "@/components/intention-input";
import HealingCodes from "@/components/healing-codes";
import SoulArchive from "@/components/soul-archive";
import TorusField from "@/components/torus-field";
import MerkabaField from "@/components/merkaba-field";
import MetatronsCube from "@/components/metatrons-cube";
import SriYantra from "@/components/sri-yantra";
import FlowerOfLife from "@/components/flower-of-life";
import EnergeticConsole from "@/components/energetic-console";

export default function Dashboard() {
  const { isConnected } = useSacred();

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-6">
            <IntentionInput />
            <HealingCodes />
            <SoulArchive />
          </div>
          
          {/* Middle Column - Main Visualizations */}
          <div className="lg:col-span-1 space-y-6">
            <TorusField />
            <MerkabaField />
          </div>
          
          {/* Right Column */}
          <div className="lg:col-span-1 space-y-6">
            <MetatronsCube />
            <SriYantra />
            <FlowerOfLife />
          </div>
        </div>
        
        {/* Live Output Console */}
        <EnergeticConsole />
      </main>
    </div>
  );
}
