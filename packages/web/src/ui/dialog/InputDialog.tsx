import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField
} from '@mui/material';

interface InputDialogProps {
  open: boolean;
  title: string;
  label: string;
  initialValue?: string;
  onClose: () => void;
  onSubmit: (value: string) => void;
  submitText?: string;
  cancelText?: string;
  validate?: (value: string) => string | null;
}

const InputDialog: React.FC<InputDialogProps> = ({
  open,
  title,
  label,
  initialValue = '',
  onClose,
  onSubmit,
  submitText = '确定',
  cancelText = '取消',
  validate
}) => {
  const [value, setValue] = useState<string>(initialValue);
  const [error, setError] = useState<string | null>(null);

  const textFieldRef = useRef<HTMLInputElement | null>(null);
  const handleDialogEntered = () => {
    textFieldRef.current?.focus();
  };

  const handleSubmit = () => {
    if (validate) {
      const validationError = validate(value);
      if (validationError) {
        setError(validationError);
        return;
      }
    }
    onSubmit(value);
    setValue('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} slotProps={{ transition: { onEntered: handleDialogEntered } }}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label={label}
          fullWidth
          variant="standard"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError(null);
          }}
          error={!!error}
          helperText={error}
          inputRef={textFieldRef}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{cancelText}</Button>
        <Button onClick={handleSubmit}>{submitText}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default InputDialog;