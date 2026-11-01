import { useState } from 'react';

export const useProcurementListings = () => {
  const [listings] = useState([]);
  const [isLoading] = useState(false);
  return { listings, isLoading };
};

export default useProcurementListings;

