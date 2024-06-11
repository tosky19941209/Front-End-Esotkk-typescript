import React, { useState } from 'react';
import Filter from './filter';
import OfferDashboard from './offer_dashboard';
import OfferButtonGroup from './offerbuttongroup';

const Dashboard: React.FC = () => {
  const [offerType, setOfferType] = useState<number>(1);

  return (
    <div className="flex flex-col items-center lg:items-start">
      <OfferButtonGroup setOfferType={setOfferType} />
      <Filter />
      <OfferDashboard offerType={offerType} />
    </div>
  );
};

export default Dashboard;
