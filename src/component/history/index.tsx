import React, { useEffect, useState } from 'react';
import Filter from './filter';
import OfferDashboard from './offer_dashboard';
const Dashboard: React.FC = () => {
  const [offerType, setOfferType] = useState<number>(1);
  const [searchKeyWord, setSearchKeyWord] = useState<any>()
  
  return (
    <div className="flex flex-col items-center lg:items-start w-[80%]">
      <OfferDashboard offerType={offerType} searchKeyWord = {searchKeyWord} />
    </div>
  );
};

export default Dashboard;
