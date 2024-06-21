import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import useWeb3 from '../../hooks/useWeb3';
import toastr from 'toastr';
interface CreateOfferModalProps {
  isCreateOfferModalOpen: boolean;
  setIsCreateOfferModalOpen: (isOpen: boolean) => void;
  setCreateOffer: (offerType: string) => void;
  createOfferTitle: string | undefined;
}

const CreateOfferModal: React.FC<CreateOfferModalProps> = (props) => {
  const { chainId, estokkYamContract, account } = useWeb3();

  const [offerToken, setOfferToken] = useState<any>()
  const [buyerToken, setBuyerToken] = useState<any>()
  const [offerPriceUsdc, setOfferPriceUsdc] = useState<any>()
  const [offerQuantity, setOfferQuantity] = useState<any>()
  const [offerPriceCurrency, setOfferPriceCurrency] = useState<any>()

  const buyer: string = "0x0000000000000000000000000000000000000000"

  const real_token: any = "0x0170A96Cac4dd1D3dE9FB7fB19A6C10D43e663D3"
  const TK_token: any = "0x4069F86aDd448c60546A5363Da9215690086F8c3"
  const usdc_token: any = "0x25F460F2E84608EE83E93b7E36985a37D241fD1F"
  const wdai_token: any = "0x0f6b3cAfD5ab9bE37f8299284D7A30B93F3B76b7"

  const close = () => {
    props.setCreateOffer('none');
    props.setIsCreateOfferModalOpen(false);
  };

  const CreateOffer = async () => {
    try {
      const result: any = await estokkYamContract.methods.createOffer(offerToken, buyerToken, buyer, offerPriceUsdc, offerQuantity).send({ from: account })
      toastr.success("Offer is created Successfully!")
      close()
    } catch (err) {
      toastr.error("Create Offer Failed")
    }
  }

  const tokenAddress = (token_name: any) => {
    if (token_name === 'tk') return TK_token
    if (token_name === 'realtoken') return real_token
    if (token_name === 'usdc') return usdc_token
    if (token_name === 'wdai') return wdai_token
  }

  // useEffect(() => {
  //   console.log("Offer => ", offerToken)
  //   console.log("Buyer => ", buyerToken)
  //   console.log("Price => ", offerPriceCurrency)
  //   console.log("Quantity => ", offerQuantity)

  // }, [offerToken, buyerToken, offerPriceCurrency, offerQuantity])

  return (
    <Modal
      ariaHideApp={false}
      isOpen={props.isCreateOfferModalOpen}
      onRequestClose={close}
      style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
        },
      }}
    >
      <div className="w-[90vw] lg:w-[500px] lg:h-[750px] flex flex-col">
        <div className="flex w-[100%] justify-between items-center">
          <p className="flex items-center justify-center rounded-md bg-[red] w-32 h-8 text-[25px] text-[white]">
            {props.createOfferTitle}
          </p>
          <p className="text-[25px] text-[#00b3ba]">Create your Offer</p>
          <div className="flex items-center justify-center rounded-md bg-[#173039] w-32 h-8 text-[20px] text-[white]">
            <img src="img/mark.png" className="w-8" alt="mark" />
            <p>5%</p>
          </div>
        </div>
        <div className="flex flex-col w-[100%] mt-4">
          <p>Offer Token</p>
          <select className="h-9 border-[2px] mt-1 border-[#00b3ba] rounded-md focus:outline-none"
            onChange={(e) => {
              const value = e.target.value
              if (value == "null") return
              setOfferToken(tokenAddress(value))
            }}
          >
            <option value="null">Select</option>
            <option value="tk">19530 Hickory</option>
            <option value="realtoken">RealToken</option>
          </select>
        </div>

        <div className="flex flex-col w-[100%] mt-3">
          <p>Buyer Token</p>
          <select className="h-9 border-[2px] mt-1 border-[#00b3ba] rounded-md focus:outline-none"
            onChange={(e) => {
              const value = e.target.value
              if (value == "null") return

              setBuyerToken(tokenAddress(value))
            }}
          >
            <option value="null">Select</option>
            <option value="usdc">USDC</option>
            <option value="wdai">WDAI</option>
          </select>
        </div>

        <div className="flex flex-row w-[100%] mt-3 justify-between">
          <div>
            <p>Buyer price in $</p>
            <input type="number" value={offerPriceCurrency} disabled={true} className="h-9 w-[100%] border-[2px] mt-1 border-[#00b3ba] rounded-md focus:outline-none"
              onChange={(e) => {
              }}
            />
          </div>
          <img src="./img/exchange.svg" className="w-10 mt-[40px]" alt="exchange" />
          <div>
            <p>Buyer price in USDC</p>
            <input value={offerPriceUsdc} type="text" className="h-9 w-[100%] border-[2px] mt-1 border-[#00b3ba] rounded-md focus:outline-none"
              onChange={(e) => {
                setOfferPriceUsdc(e.target.value)
                setOfferPriceCurrency(Number(e.target.value) * 0.99)
              }}
            />
          </div>
        </div>
        <p className="w-[50%] text-[red] text-[10px]">
          Price difference is 18.51% but limit by shield fixed
          Price difference is 18.51% but limit by shield fixed
          Price difference is 18.51% but limit by shield fixed
          Price difference is 18.51% but limit by shield fixed
        </p>

        <p className="w-[50%] text-[black] text-[15px] mt-3">
          Price difference is 18.51% but limit by shield fixed
          Price difference is 18.51% but limit by shield fixed
        </p>
        <div className="bg-[#00b3ba] w-[100%] h-[2px] "></div>
        <p className="text-[15px] text-[#00b3ba] mt-3">Wallet balance</p>
        <div className="flex items-center justify-start mt-1">
          <img src="./img/billing.png" alt="billing" className="w-12" />
          <div className="ml-2">
            <p className="font-bold text-[13px]">19530 Hickory</p>
            <p className="text-[13px]">With USDC = 1.00000054$</p>
          </div>
        </div>
        <p className="text-[15px] text-[black] mt-3">Quantity</p>
        <input type="number" className="h-9 w-[100%] border-[2px] mt-1 border-[#00b3ba] rounded-md focus:outline-none"
          onChange={(e) => {
            setOfferQuantity(Number(e.target.value) * Math.pow(10, 18))
          }}
        />
        <div className="flex items-center mt-3">
          <input type="checkbox" className="mr-2 w-5 h-5" />
          <label className="text-[black] mt-2">I want to create a private offer</label>
        </div>
        <p className="text-[#00b3ba] font-bold">
          You wish to sell up to 12 "19530 Hickory" with unit price
        </p>

        <button
          className="w-60 h-10 mt-3 border-[2px] border-[#00b3ba] text-[#00b3ba] hover:text-[white] hover:bg-[#00b3ba] duration-300 focus:outline-none rounded"
          onClick={CreateOffer}
        >
          Add new Offer
        </button>
      </div>
    </Modal>
  );
};

export default CreateOfferModal;
