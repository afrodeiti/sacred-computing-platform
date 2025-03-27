import { useSacred } from "@/context/sacred-context";
import WebSocketStatus from "./websocket-status";
import { Link } from "wouter";

export default function Header() {
  return (
    <header className="bg-black border-b border-purple-800/30 dark:bg-sacred-black">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          {/* Sacred Geometry Logo */}
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 flex items-center justify-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="w-6 h-6 text-white animate-pulse"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 2v20M2 12h20M2 12c5 0 10-5 10-10M2 12c5 0 10 5 10 10M22 12c-5 0-10-5-10-10M22 12c-5 0-10 5-10 10"></path>
                </svg>
              </div>
              <h1 className="text-xl font-medium text-white font-montserrat">Sacred Computing Platform</h1>
            </div>
          </Link>
        </div>
        
        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/">
            <span className="text-gray-300 hover:text-white transition-colors cursor-pointer">Dashboard</span>
          </Link>
          <Link href="/healing-search">
            <span className="text-gray-300 hover:text-white transition-colors cursor-pointer">Healing Codes</span>
          </Link>
          <Link href="/intention-recommendation">
            <span className="text-gray-300 hover:text-white transition-colors cursor-pointer">Intention Optimizer</span>
          </Link>
        </nav>
        
        {/* WebSocket Connection Status */}
        <WebSocketStatus />
      </div>
      
      {/* Mobile Navigation */}
      <div className="md:hidden container mx-auto px-4 py-2 flex justify-center border-t border-gray-800">
        <div className="flex space-x-4">
          <Link href="/">
            <span className="text-sm text-gray-300 hover:text-white transition-colors px-3 py-1 cursor-pointer">Dashboard</span>
          </Link>
          <Link href="/healing-search">
            <span className="text-sm text-gray-300 hover:text-white transition-colors px-3 py-1 cursor-pointer">Healing Codes</span>
          </Link>
          <Link href="/intention-recommendation">
            <span className="text-sm text-gray-300 hover:text-white transition-colors px-3 py-1 cursor-pointer">Intention Optimizer</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
