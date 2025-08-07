import { useState } from 'react';

interface UseFlyoutReturn {
  isOpen: boolean;
  openFlyout: () => void;
  closeFlyout: () => void;
  toggleFlyout: () => void;
}

export const useFlyout = (): UseFlyoutReturn => {
  const [isOpen, setIsOpen] = useState(false);

  const openFlyout = () => setIsOpen(true);
  const closeFlyout = () => setIsOpen(false);
  const toggleFlyout = () => setIsOpen(!isOpen);

  return {
    isOpen,
    openFlyout,
    closeFlyout,
    toggleFlyout
  };
};
