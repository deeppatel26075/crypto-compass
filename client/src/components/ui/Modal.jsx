import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Button from './Button';

/**
 * Accessible Modal Dialog matching the fintech reference design
 */
const Modal = ({
  isOpen = false,
  onClose,
  title = 'Welcome to Crypto Compass',
  children,
  confirmText = 'Continue',
  cancelText = 'Cancel',
  onConfirm,
  showActions = true,
  maxWidth = 'max-w-md',
}) => {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && onClose) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={`relative w-full ${maxWidth} rounded-2xl fintech-panel p-6 border border-white/10 shadow-glass-panel z-10`}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <h3 className="text-base font-bold text-white tracking-tight">
                {title}
              </h3>
              {onClose && (
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-space-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Body */}
            <div className="py-4 text-sm text-gray-300 leading-relaxed">
              {children || (
                <p>
                  This is a sample modal dialog. It can be used for confirmations, forms, or any important content.
                </p>
              )}
            </div>

            {/* Actions */}
            {showActions && (
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/[0.08]">
                {onClose && (
                  <Button variant="secondary" size="sm" onClick={onClose}>
                    {cancelText}
                  </Button>
                )}
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    if (onConfirm) onConfirm();
                    if (onClose) onClose();
                  }}
                >
                  {confirmText}
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
