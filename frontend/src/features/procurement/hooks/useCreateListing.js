import { useState } from 'react';

export const useCreateListing = () => {
  const [isSubmitting] = useState(false);
  const create = async () => {
    throw new Error('Procurement listing creation is currently disabled.');
  };
  return { create, isSubmitting };
};

export default useCreateListing;

