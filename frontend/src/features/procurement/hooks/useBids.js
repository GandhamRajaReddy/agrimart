import { useState } from 'react';

export const useBids = () => {
  const [bids] = useState([]);
  const [isLoading] = useState(false);
  return { bids, isLoading };
};

export default useBids;

