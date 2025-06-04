
import React, { ReactNode, useEffect, useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'; // Added more sizes for flexibility
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setIsMounted(true), 10); 
      return () => clearTimeout(timer);
    } else {
      setIsMounted(false); 
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
  };

  const backdropClasses = `fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 transition-opacity duration-300 ease-in-out ${isMounted ? 'opacity-100' : 'opacity-0 pointer-events-none'}`;
  
  const modalDialogClasses = `bg-cardLight dark:bg-cardDark p-6 rounded-lg shadow-2xl w-full ${sizeClasses[size]} transform transition-all duration-300 ease-in-out ${isMounted ? 'scale-100 opacity-100' : 'scale-95 opacity-0'} border border-borderLight dark:border-borderDark`;

  return (
    <div className={backdropClasses} onClick={onClose}>
      <div className={modalDialogClasses} onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4 pb-4 border-b border-borderLight dark:border-borderDark">
          <h2 className="text-xl font-semibold text-textLight dark:text-textDark">{title}</h2>
          <button
            onClick={onClose}
            className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-100 transition-colors p-1 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;