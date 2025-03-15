
import { Ruler, Scissors } from "lucide-react";

export function LoginDecoration() {
  return (
    <div className="hidden md:flex w-1/2 bg-primary/10 flex-col justify-center items-center p-8">
      <div className="max-w-md text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-4">Melhor Corte</h1>
        <p className="text-lg text-gray-700">Otimize seus cortes, economize material e aumente sua produtividade</p>
      </div>
      
      {/* Decorative elements for cutting plans */}
      <div className="relative w-full max-w-md aspect-square bg-white/80 rounded-lg shadow-lg p-6 flex items-center justify-center">
        <div className="absolute w-full h-full opacity-10 grid-pattern bg-size-[20px_20px]"></div>
        
        <div className="relative z-10 flex flex-col items-center">
          <Ruler className="h-20 w-20 text-primary mb-4" strokeWidth={1.5} />
          <div className="bg-white p-4 rounded-lg shadow-subtle mb-4 flex items-center gap-2">
            <div className="bg-primary/20 h-10 w-32 rounded"></div>
            <Scissors className="h-6 w-6 text-primary/60" />
          </div>
          
          <div className="flex gap-4 mb-4">
            <div className="bg-accent h-16 w-16 rounded flex items-center justify-center border border-primary/20">
              <span className="text-sm font-medium">20×30</span>
            </div>
            <div className="bg-accent h-12 w-20 rounded flex items-center justify-center border border-primary/20">
              <span className="text-sm font-medium">15×45</span>
            </div>
            <div className="bg-accent h-14 w-14 rounded flex items-center justify-center border border-primary/20">
              <span className="text-sm font-medium">25×25</span>
            </div>
          </div>
          
          <div className="flex w-full justify-between items-center mt-2">
            <div className="h-2 w-full bg-primary/30 rounded-full"></div>
            <div className="mx-2 text-xs font-medium text-primary">89%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
