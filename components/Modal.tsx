'use client';

import React, { useEffect, useRef } from 'react';
import { X, AlertTriangle, Info, CheckCircle2, AlertCircle } from 'lucide-react';

export type ModalVariant = 'danger' | 'warning' | 'info' | 'success' | 'default';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  variant?: ModalVariant;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  confirmDisabled?: boolean;
  isConfirming?: boolean;
  children?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  icon,
  variant = 'default',
  confirmText,
  cancelText = 'Cancel',
  onConfirm,
  confirmDisabled = false,
  isConfirming = false,
  children,
  maxWidth = 'md',
  showCloseButton = true,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Max width classes
  const widthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  }[maxWidth];

  // Variant accent styles
  const variantStyles = {
    danger: {
      badgeBg: 'bg-danger-500/10 dark:bg-danger-500/20 text-danger-600 dark:text-danger-400',
      confirmBtn: 'bg-danger-600 hover:bg-danger-500 text-white shadow-danger-500/25',
      defaultIcon: <AlertCircle className="w-5 h-5 text-danger-500" />,
    },
    warning: {
      badgeBg: 'bg-warning-500/10 dark:bg-warning-500/20 text-warning-600 dark:text-warning-400',
      confirmBtn: 'bg-warning-600 hover:bg-warning-500 text-white shadow-warning-500/25',
      defaultIcon: <AlertTriangle className="w-5 h-5 text-warning-500" />,
    },
    info: {
      badgeBg: 'bg-brand-500/10 dark:bg-brand-500/20 text-brand-600 dark:text-brand-300',
      confirmBtn: 'bg-python-blue hover:bg-brand-600 text-white shadow-brand-500/25',
      defaultIcon: <Info className="w-5 h-5 text-python-blue dark:text-python-blue-light" />,
    },
    success: {
      badgeBg: 'bg-success-500/10 dark:bg-success-500/20 text-success-600 dark:text-success-400',
      confirmBtn: 'bg-success-600 hover:bg-success-500 text-white shadow-success-500/25',
      defaultIcon: <CheckCircle2 className="w-5 h-5 text-success-500" />,
    },
    default: {
      badgeBg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
      confirmBtn: 'bg-python-blue hover:bg-brand-600 text-white shadow-brand-500/25',
      defaultIcon: null,
    },
  }[variant];

  const renderedIcon = icon || variantStyles.defaultIcon;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={modalRef}
        className={`w-full ${widthClasses} bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-2xl space-y-4 relative transition-all animate-scale-in`}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {renderedIcon && (
              <div className={`p-2.5 rounded-2xl shrink-0 ${variantStyles.badgeBg}`}>
                {renderedIcon}
              </div>
            )}
            <div>
              <h3
                id="modal-title"
                className="text-lg font-bold text-slate-900 dark:text-white leading-tight"
              >
                {title}
              </h3>
              {typeof description === 'string' ? (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {description}
                </p>
              ) : (
                description
              )}
            </div>
          </div>

          {showCloseButton && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Custom Body Content */}
        {children && <div className="text-xs text-slate-600 dark:text-slate-300">{children}</div>}

        {/* Actions Footer */}
        {(onConfirm || cancelText) && (
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            {cancelText && (
              <button
                type="button"
                onClick={onClose}
                disabled={isConfirming}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
              >
                {cancelText}
              </button>
            )}
            {onConfirm && confirmText && (
              <button
                type="button"
                onClick={onConfirm}
                disabled={confirmDisabled || isConfirming}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer ${variantStyles.confirmBtn}`}
              >
                {isConfirming && (
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                <span>{confirmText}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
