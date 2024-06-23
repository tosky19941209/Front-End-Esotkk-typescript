import React, { useEffect, useState, useRef } from 'react';
import MarketBtn from '../atmComponent/marketbtn';
import { useNavigate } from 'react-router-dom';
import useWeb3 from '../../hooks/useWeb3';
import GlobalOffer from './globaloffer';

interface OfferDashboardProps {
    offerType: number;
    searchKeyWord: string;
}

const OfferDashboard: React.FC<OfferDashboardProps> = (props) => {

    const { estokkYamContract, chainId } = useWeb3()
    const [isHover, setIsHover] = useState(false);
    const buttonClass = 'w-[100%] h-10 flex items-center border-[1px] border-[#00b3ba] text-[#00b3ba] hover:text-[white] hover:bg-[#00b3ba] rounded focus:outline-none duration-150';

    const [isAddOfferModalOpen, setIsAddOfferModalOpen] = useState(false);
    const [isCreateOfferModalOpen, setIsCreateOfferModalOpen] = useState(false);
    const [createoffer, setCreateOffer] = useState<string | undefined>();
    const [createOfferTitle, setCreateOfferTitle] = useState<string | undefined>();

    const [isBtnPush1, setIsBtnPush1] = useState(false);
    const [isBtnPush2, setIsBtnPush2] = useState(false);
    const [isBtnPush3, setIsBtnPush3] = useState(false);
    const currentRef = useRef<HTMLButtonElement | null>(null);

    const btnRefresh = useRef<HTMLButtonElement | null>(null)
    const [offerIDContent, setOfferIDContent] = useState<any>([])
    const [searchOfferIdContent, setSearchOfferIdContent] = useState<any>([])

    let arrayOffer: any = []

    useEffect(() => {

        const result = offerIDContent.filter(
            (item: any) =>
                item.buyerToken.toLowerCase().includes(props.searchKeyWord) ||
                item.offerToken.toLowerCase().includes(props.searchKeyWord)
        )
        setSearchOfferIdContent(result)

    }, [props.searchKeyWord])

    const ShowTotalOffer = async () => {
        try {
            const totalOfferCount = await estokkYamContract.methods.getOfferCount().call()
            for (let i = 0; i < totalOfferCount; i++) {
                try {
                    const eachOfferContent: any = await estokkYamContract.methods.showOffer(i).call()
                    const offerToken: any = await estokkYamContract.methods.tokenInfo(eachOfferContent[0]).call()
                    const buyerToken: any = await estokkYamContract.methods.tokenInfo(eachOfferContent[1]).call()
                    arrayOffer.push({
                        offerId: i,
                        offerToken: offerToken[1],
                        offerTokenAddress: eachOfferContent[0],
                        buyerToken: buyerToken[1],
                        buyerTokenAddress: eachOfferContent[1],
                        seller: eachOfferContent[2],
                        buyer: eachOfferContent[3],
                        price: eachOfferContent[4],
                        amount: eachOfferContent[5],

                    })
                } catch (err) {
                }
            }
            setOfferIDContent(arrayOffer)
            setSearchOfferIdContent(arrayOffer)
        } catch (err) {
        }
    }

    useEffect(() => {
        if (createoffer === 'sell' || createoffer === 'buy' || createoffer === 'exchange') {
            setCreateOfferTitle(createoffer);
            setIsCreateOfferModalOpen(true);
        } else {
            setCreateOffer('none');
        }
    }, [createoffer]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (btnRefresh.current) {
                btnRefresh.current.click();
            }
        }, 1000);
        return () => clearTimeout(timer);
    }, [chainId])

    const navigate = useNavigate();

    useEffect(() => {
        if (currentRef.current) {
            currentRef.current.click();
        }
    }, []);


    return (
        <div className="flex flex-col w-[100%] justify-between">
            <div className="flex">
                <MarketBtn
                    btnName="Sell"
                    ref={currentRef}
                    isBtnPush={isBtnPush1}
                    onClick={() => {
                        setIsBtnPush1(true);
                        setIsBtnPush2(false);
                        setIsBtnPush3(false);
                    }}
                />
                <MarketBtn
                    btnName="Buy"
                    isBtnPush={isBtnPush2}
                    onClick={() => {
                        setIsBtnPush1(false);
                        setIsBtnPush2(true);
                        setIsBtnPush3(false);
                    }}
                />
                <MarketBtn
                    btnName="Exchange"
                    isBtnPush={isBtnPush3}
                    onClick={() => {
                        setIsBtnPush1(false);
                        setIsBtnPush2(false);
                        setIsBtnPush3(true);
                    }}
                />
            </div>

            <div className="mt-4 mb-4 rounded-md bg-white">
                {
                    props.offerType === 1 && (
                        <>
                            <p className="text-center text-xl text-[#00b3ba]">Dex</p>
                            <GlobalOffer content={searchOfferIdContent} />
                        </>
                    )
                }

                {props.offerType === 3 && (
                    <div className='h-[300px] mb-5'>
                        <p className="text-center text-xl text-[#00b3ba] font-bold pt-2">Create Offer</p>
                        <div className='w-[100%] mt-5 pr-2 pl-2'>
                            <button
                                className={buttonClass}
                                onMouseOver={() => setIsHover(true)}
                                onMouseOut={() => setIsHover(false)}
                                onClick={() => {
                                    setIsAddOfferModalOpen(true);
                                }}
                            >
                                <img
                                    src={isHover ? `./img/addoffers_hover.svg` : `./img/addoffers.svg`}
                                    className="w-5 ml-2 mr-2"
                                    alt="Add Offer"
                                />
                                Add Offer
                            </button>
                        </div>
                    </div>

                )}
            </div>
            <button
                ref={btnRefresh}
                onClick={() => {
                    ShowTotalOffer()
                }}>
            </button>
        </div >
    );
};

export default OfferDashboard;
