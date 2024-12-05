import React from 'react';
import "@/app/globals.css";
import './CustomDialog.css';

interface CustomDialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const CustomDialog: React.FC<CustomDialogProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="custom-dialog-overlay" onClick={onClose}>
      <div className="custom-dialog-content" onClick={e => e.stopPropagation()}>
        {children}
        <button className="close-button" onClick={onClose}>×</button>
      </div>
    </div>
  );
};

export default CustomDialog;
