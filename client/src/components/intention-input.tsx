import { useSacred } from "@/context/sacred-context";
import { FIBONACCI } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

export default function IntentionInput() {
  const { 
    intention, 
    frequency, 
    boost, 
    multiplier, 
    setIntention, 
    setFrequency, 
    setBoost, 
    setMultiplier, 
    sendIntention 
  } = useSacred();

  return (
    <div className="bg-black p-4 rounded-lg border border-purple-800/20 dark:bg-sacred-black">
      <h2 className="font-medium text-lg mb-3 text-white font-montserrat">Intention Sender</h2>
      <p className="text-sm text-gray-400 mb-4">Input your intention to transmit through sacred geometry</p>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="intention" className="block text-sm font-medium text-gray-300 mb-1">
            Intention
          </Label>
          <Input 
            id="intention" 
            type="text" 
            value={intention}
            onChange={(e) => setIntention(e.target.value)}
            className="w-full bg-gray-900 border border-purple-800/30 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50" 
            placeholder="Enter your intention..."
          />
        </div>
        
        <div>
          <Label htmlFor="frequency" className="block text-sm font-medium text-gray-300 mb-1">
            Frequency (Hz)
          </Label>
          <Slider
            id="frequency"
            min={1}
            max={20}
            step={0.01}
            value={[frequency]}
            onValueChange={(value) => setFrequency(value[0])}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>1.0 Hz</span>
            <span className="font-mono">{frequency.toFixed(2)} Hz</span>
            <span>20.0 Hz</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Switch
              id="boost"
              checked={boost}
              onCheckedChange={setBoost}
            />
            <Label htmlFor="boost" className="text-sm text-gray-300">
              Divine Amplification
            </Label>
          </div>
          
          <div>
            <Label htmlFor="multiplier" className="block text-xs font-medium text-gray-400">
              Multiplier
            </Label>
            <select 
              id="multiplier" 
              value={multiplier}
              onChange={(e) => setMultiplier(Number(e.target.value))}
              className="bg-gray-900 border border-purple-800/30 rounded-md py-1 px-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50" 
            >
              {FIBONACCI.slice(0, 7).map(value => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
          </div>
        </div>
        
        <Button 
          onClick={sendIntention}
          className="w-full bg-gradient-to-r from-violet-500 to-blue-500 hover:opacity-90 transition-opacity"
        >
          Send Intention
        </Button>
      </div>
    </div>
  );
}
