import { useState } from 'react';

export const useRequestProcessDialog = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return {
    isDialogOpen,
    onOpenChange: setIsDialogOpen,
  };
};
