import React, { useEffect, useState, useRef } from 'react';
import MarketBtn from '../atmComponent/marketbtn';
import AddOfferModal from './addoffermodal';
import CreateOfferModal from './createoffermodal';
import { useNavigate } from 'react-router-dom';
import useWeb3 from '../../hooks/useWeb3';
import ShowOffer from '../showoffer/showoffer';
import BasicTable from './BasicTable';
interface OfferDashboardProps {
    offerType: number;
}

const OfferDashboard: React.FC<OfferDashboardProps> = (props) => {
    const { estokkYamContract, account, chainId } = useWeb3()
    const [isHover, setIsHover] = useState(false);
    const buttonClass =
        'w-[100%] h-10 flex items-center border-[1px] border-[#00b3ba] text-[#00b3ba] hover:text-[white] hover:bg-[#00b3ba] rounded focus:outline-none duration-150';

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

    const array = [0, 1, 3, 5, 6, 3, 6, 6]
    let arrayOffer: any = []

    const ShowTotalOffer = async () => {
        try {
            const totalOfferCount = await estokkYamContract.methods.getOfferCount().call()

            for (let i = 0; i < totalOfferCount; i++) {
                const eachOfferContent: any = await estokkYamContract.methods.showOffer(i).call()
                // arrayOffer.push(await getOfferContent(eachOfferContent))
                const offerToken: any = await estokkYamContract.methods.tokenInfo(eachOfferContent[0]).call()
                const buyerToken: any = await estokkYamContract.methods.tokenInfo(eachOfferContent[1]).call()
                arrayOffer.push({
                    offerToken: offerToken[1],
                    buyerToken: buyerToken[1],
                    seller: eachOfferContent[2],
                    buyer: eachOfferContent[3],
                    price: eachOfferContent[4],
                    amount: eachOfferContent[5]
                })
            }
            setOfferIDContent(arrayOffer)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        ShowTotalOffer()
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
                            <BasicTable content={offerIDContent} />
                        </>
                    )
                }

                {/* {props.offerType === 1 && (
                        <div className='w-[80vw] bg-red-100 scroll-smooth '>
                            <caption className="caption-top text-center text-xl text-[#00b3ba]">
                                Dex
                            </caption>
                            <p className="text-center text-xl text-[#00b3ba]">Dex</p>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th className="text-sm">Offer ID</th>
                                        <th className="text-sm">Offer Token</th>
                                        <th className="text-sm">Buyer Token</th>
                                        <th className="text-sm">Rate of Return</th>
                                        <th className="text-sm">Official Yield</th>
                                        <th className="text-sm">Yield Delta</th>
                                        <th className="text-sm">Official Price</th>
                                        <th className="text-sm">Price / Token</th>
                                        <th className="text-sm">Price delta</th>
                                        <th className="text-sm">Available quantity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        offerIDContent.map((item: any, index: any) => (
                                            <tr
                                                className="cursor-pointer"
                                                onClick={() => {
                                                    navigate('/showoffer', { state: { index } });
                                                }}
                                            >
                                                <td>{index}</td>
                                                <td>{item.offerToken}</td>
                                                <td>{item.buyerToken}</td>
                                                <td>10%</td>
                                                <td>12%</td>
                                                <td>20%</td>
                                                <td>{String(item.price)}</td>
                                                <td>{String(Number(item.price) * 0.99)}</td>
                                                <td>16.85%</td>
                                                <td>{String(Number(item.amount) / Math.pow(10, 18))}</td>
                                            </tr>
                                        ))

                                    }
                                </tbody>
                            </table>
                        </div>
                    )} */}

                {props.offerType === 2 && (
                    <>
                        <p className="text-center text-xl text-[#00b3ba]">Dex</p>
                        <BasicTable content={offerIDContent} />
                    </>
                    // <>
                    //     <p className="text-center text-xl text-[#00b3ba]">Dex</p>
                    //     <table className="w-[100%] table">
                    //         <thead>
                    //             <tr>
                    //                 <th className="text-sm">Offer ID</th>
                    //                 <th className="text-sm">Offer Token</th>
                    //                 <th className="text-sm">Buyer Token</th>
                    //                 <th className="text-sm">Rate of Return</th>
                    //                 <th className="text-sm">Official Yield</th>
                    //                 <th className="text-sm">Yield Delta</th>
                    //                 <th className="text-sm">Official Price</th>
                    //                 <th className="text-sm">Price / Token</th>
                    //                 <th className="text-sm">Price delta</th>
                    //                 <th className="text-sm">Available quantity</th>
                    //             </tr>
                    //         </thead>
                    //         <tbody>


                    //         </tbody>
                    //     </table>
                    // </>
                )}
                {props.offerType === 3 && (
                    <div className='h-[45vh] mb-5'>
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

                <AddOfferModal
                    isAddOfferModalOpen={isAddOfferModalOpen}
                    setIsAddOfferModalOpen={setIsAddOfferModalOpen}
                    setCreateOffer={setCreateOffer}
                />

                <CreateOfferModal
                    isCreateOfferModalOpen={isCreateOfferModalOpen}
                    setIsCreateOfferModalOpen={setIsCreateOfferModalOpen}
                    createOfferTitle={createOfferTitle}
                    setCreateOffer={setCreateOffer}
                />
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
