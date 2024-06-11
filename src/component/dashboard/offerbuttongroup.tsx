import React, { useEffect, useState, useRef } from 'react';
import OfferBtn from '../atmComponent/offerbtn';
import useWeb3 from '../../hooks/useWeb3';
interface OfferButtonGroupProps {
  setOfferType: (offerType: number) => void;
}

const OfferButtonGroup: React.FC<OfferButtonGroupProps> = (props) => {

  const { estokkYamContract } = useWeb3()

  const [isBtnPush1, setIsBtnPush1] = useState(false);
  const [isBtnPush2, setIsBtnPush2] = useState(false);
  const [isBtnPush3, setIsBtnPush3] = useState(false);

  const currentRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (currentRef.current) {
      currentRef.current.click();
    }
  }, []);


  const setAdmin = async () => {
    await estokkYamContract.initialize('0x8E71fbF0f1a49ed1a3c774Bf7477dc39f66D268f', '0x88C35151B6290DC6C24072c449bcEf2114f2aF31')
    console.log("Successed")
  }



  return (
    <div className="flex flex-col md:flex-row w-[100%] lg:w-[60%] justify-between">
      <OfferBtn
        btnName="My Offers"
        ref={currentRef}
        onClick={() => {
          props.setOfferType(1);
          setIsBtnPush1(true);
          setIsBtnPush2(false);
          setIsBtnPush3(false);
        }}
        isBtnPush={isBtnPush1}
      />
      <OfferBtn
        btnName="Private Offers"
        onClick={() => {
          props.setOfferType(2);
          setIsBtnPush2(true);
          setIsBtnPush1(false);
          setIsBtnPush3(false);
        }}
        isBtnPush={isBtnPush2}
      />
      <OfferBtn
        btnName="Add Offers"
        onClick={() => {
          props.setOfferType(3);
          setIsBtnPush3(true);
          setIsBtnPush1(false);
          setIsBtnPush2(false);
        }}
        isBtnPush={isBtnPush3}
      />

      <button className='text-[white]' onClick={setAdmin}>Set Admin</button>
    </div>
  );
};

export default OfferButtonGroup;
