import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, title, children, actions }) => {
  return (
        <Dialog open={open} onClose={onClose} PaperProps={{ sx: { width: '50%' } }} >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        {actions ? actions : <Button onClick={onClose}>Fechar</Button>}
      </DialogActions>
    </Dialog>
  );
};

export default Modal;
