import React from 'react';
import { UseHotelTab } from '../../Left/HotelTabContext';

import Request from './request';

const RequestDisplay = () => {
  const { selectedTab } = UseHotelTab();

  if (selectedTab === 'request') return <Request />;
  
};

export default RequestDisplay;