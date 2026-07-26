import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full px-4 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const getStyle = () => {
    switch (toast.type) {
      case 'success':
        return {
          bg: 'bg-emerald-900/90 text-emerald-100 border-emerald-700/50',
          icon: CheckCircle2,
          iconColor: 'text-emerald-400',
        };
      case 'error':
        return {
          bg: 'bg-rose-900/90 text-rose-100 border-rose-700/50',
          icon: AlertCircle,
          iconColor: 'text-rose-400',
        };
      default:
        return {
          bg: 'bg-slate-900/90 text-slate-100 border-slate-700/50',
          icon: Info,
          iconColor: 'text-indigo-400',
        };
    }
  };

  const style = getStyle();
  const Icon = style.icon;

  return (
    <div
      className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-xl border backdrop-blur-md shadow-xl text-xs font-medium transition-all animate-in slide-in-from-bottom-2 fade-in ${style.bg}`}
    >
      <div className="flex items-center gap-2.5">
        <Icon className={`w-4 h-4 shrink-0 ${style.iconColor}`} />
        <span>{toast.text}</span>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer ml-2"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
