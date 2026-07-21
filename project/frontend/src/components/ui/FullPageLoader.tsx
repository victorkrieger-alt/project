interface FullPageLoaderProps {
  message?: string;
}

export default function FullPageLoader({ message = 'Carregando...' }: FullPageLoaderProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-50/70 backdrop-blur-sm select-none transition-all">
      <div className="flex flex-col items-center gap-3.5">
        
        {/* Spinner Mínimo e Fino */}
        <div className="relative w-9 h-9 flex items-center justify-center">
          {/* Anel Guia Suave */}
          <div className="absolute inset-0 rounded-full border-2 border-slate-200/60" />
          
          {/* Anel de Rotação Azul */}
          <div className="absolute inset-0 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
        </div>

        {/* Texto Leve e Discreto */}
        <p className="text-xs font-medium text-slate-500 tracking-wide animate-pulse">
          {message}
        </p>

      </div>
    </div>
  );
}