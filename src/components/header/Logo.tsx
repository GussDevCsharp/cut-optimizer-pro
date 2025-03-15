
export const Logo = ({ projectName }: { projectName?: string }) => {
  return (
    <div className="flex items-center space-x-2">
      <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-primary flex items-center justify-center">
        <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-primary-foreground"></div>
      </div>
      <div className="flex flex-col">
        <h1 className="text-base sm:text-xl font-semibold tracking-tight">Melhor Corte</h1>
        {projectName && <span className="text-xs text-muted-foreground">{projectName}</span>}
      </div>
    </div>
  );
};
