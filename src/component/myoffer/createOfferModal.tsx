import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import useWeb3 from '../../hooks/useWeb3';
import toastr from 'toastr';
import {
    getTokenBalance,
    getTokenAddress,
    getTokenSalePrice,
    getTokenSymbol,
    getCurrencyTokenAddress,
    defaultContractAddress,
    getCurrencyTokens,
    getRealEstakeTokens
} from '../functions/tokensContract';
interface CreateOfferModalProps {
    isCreateOfferModalOpen: boolean;
    setIsCreateOfferModalOpen: (isOpen: boolean) => void;
    setCreateOffer: (offerType: string) => void;
    createOfferTitle: string | undefined;
}

const CreateOfferModal: React.FC<CreateOfferModalProps> = (props) => {
    const { estokkYamContract, account, tokens, properties } = useWeb3();
    const [offerType, setOfferType] = useState<any>()
    const [sellToken, setSellToken] = useState<any>()
    const [buyerToken, setBuyerToken] = useState<any>()
    const [offerPrice, setOfferPrice] = useState<any>()
    const [offerQuantity, setOfferQuantity] = useState<any>()
    const [offerPriceCurrency, setOfferPriceCurrency] = useState<any>()
    const [tokenId, setTokenId] = useState<any>()
    const [priceDifference, setPriceDifference] = useState<any>()
    const [isPriceAvailable, setIsPriceAvailable] = useState<boolean>(false)
    const [tokenBalance, setTokenBalance] = useState<any>()
    const [isCheckedPrivate, setIsCheckPrivate] = useState<boolean>(false)
    const [sellTokenName, setSellTokenName] = useState<any>("null")
    const [buyTokenName, setBuyTokenName] = useState<any>("null")
    const [salePrice, setSalePrice] = useState<any>()
    const [buyer, setBuyer] = useState<any>(defaultContractAddress)
    const [realEstakeTokens, setRealEstakeTokens] = useState<any>()
    const [currencyTokens, setCurrencyTokens] = useState<any>()
    const [tokenBalancesList, setTokenBalancesList] = useState<any>([])

    const close = () => {
        props.setCreateOffer('none');
        props.setIsCreateOfferModalOpen(false);
        setIsPriceAvailable(false)
        setTokenId(-1)
        setOfferPrice(0)
        setOfferPriceCurrency(0)
        setSellTokenName("null")
        setBuyTokenName("null")
        setSalePrice(0)
    };

    const CreateOffer = async () => {
        if (isPriceAvailable) {
            toastr.error("Offer Content is not available!")
            return
        }
        const _offerQuantity = Number(offerQuantity) / Math.pow(10, 18)
        if (_offerQuantity > tokenBalance) {
            toastr.info("Balance is not available.")
            return
        }
        try {
            const result: any = await estokkYamContract.methods.createOffer(sellToken, buyerToken, buyer, offerPrice, offerQuantity).send({ from: account })
            toastr.success("Offer is created Successfully!")
            close()
        } catch (err) {
            toastr.error("Create Offer Failed")
        }
    }
    useEffect(() => {
        setOfferType(props.createOfferTitle)
    }, [props, tokens, properties])

    useEffect(() => {
        if (!tokens) return
        const _getTokenBalance = async () => {
            const _tokenId: number = Number(tokenId)
            const _tokenAddress = getTokenAddress(_tokenId, tokens)
            const _account = account
            try {
                const _balance = await getTokenBalance(_tokenAddress, _account)
                setTokenBalance(_balance)
            } catch (err) {
                setTokenBalance(0)
            }
        }
        _getTokenBalance()
    }, [tokenId])



    useEffect(() => {
        if (isCheckedPrivate === false)
            setBuyer(defaultContractAddress)
    }, [isCheckedPrivate])

    useEffect(() => {
        setRealEstakeTokens(getRealEstakeTokens(tokens))
        setCurrencyTokens(getCurrencyTokens(tokens))

    }, [tokens])


    useEffect(() => {
        if (!realEstakeTokens) return
        let _tokenBalanceList: any = []
        realEstakeTokens.map((item: any, index: any) => {
            const _getTokenBalance = async () => {
                console.log("Token Id =>", typeof item.id)
                const _tokenAddress = getTokenAddress(item.id, tokens)
                const _account = account
                let _balance: any = 0
                try {
                    _balance = await getTokenBalance(_tokenAddress, _account)

                } catch (err) {
                    _balance = 0
                }
                _tokenBalanceList.push(_balance.toFixed(3))
                setTokenBalancesList(_tokenBalanceList)
            }
            _getTokenBalance()
        })
    }, [realEstakeTokens])

    return (

        <Dialog
            open={props.isCreateOfferModalOpen}
            onClose={close}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <div className="w-[100%] lg:w-[500px] lg:h-[780px] flex flex-col pt-3 pb-3 pr-3 pl-3">
                <div className="flex w-[100%] justify-between items-center">
                    <p className="flex items-center justify-center rounded-md bg-[red] w-32 h-8 text-[25px] text-[white]">
                        {offerType}
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
                            if (value === "null") {
                                setSellTokenName("")
                                setSalePrice(0)
                                return
                            }
                            setTokenId(value)
                            setSellTokenName(getTokenSymbol(value, tokens))
                            setSellToken(getTokenAddress(value, tokens))
                            if (offerType === "sell")
                                setSalePrice(getTokenSalePrice(value, tokens))
                        }}
                    >
                        <option value="null">Select</option>
                        {

                            offerType == "sell" && realEstakeTokens.length > 0 && realEstakeTokens.map((item: any, index: any) => (
                                <option value={item.id}>{item.tokenSymbol + "    " + tokenBalancesList[index]}  </option>
                            ))
                        }
                        {
                            offerType == "buy" && currencyTokens.length > 0 && currencyTokens.map((item: any, index: any) => (
                                <option value={item.id}>{item.tokenSymbol}</option>
                            ))
                        }
                        {
                            offerType == "exchange" && realEstakeTokens.length > 0 && realEstakeTokens.map((item: any, index: any) => (
                                <option value={item.id}>{item.tokenSymbol}</option>
                            ))
                        }
                    </select>
                </div>

                <div className="flex flex-col w-[100%] mt-3">
                    <p>Buyer Token</p>
                    <select className="h-9 border-[2px] mt-1 border-[#00b3ba] rounded-md focus:outline-none"
                        onChange={(e) => {
                            const value = e.target.value
                            if (value == "null") return

                            setTokenId(value)
                            setBuyerToken(getTokenAddress(value, tokens))
                            setBuyTokenName(getTokenSymbol(value, tokens))
                            if (offerType === "buy")
                                setSalePrice(getTokenSalePrice(value, tokens))
                        }}
                    >
                        <option value="null">Select</option>
                        {
                            offerType == "sell" && currencyTokens.length > 0 && currencyTokens.map((item: any, index: any) => (
                                <option value={item.id}>{item.tokenSymbol}</option>
                            ))
                        }
                        {
                            offerType == "buy" && realEstakeTokens.length > 0 &&
                            <>
                                {
                                    realEstakeTokens.map((item: any, index: any) => (
                                        <option value={item.id}>{item.tokenSymbol}</option>
                                    ))
                                }
                            </>
                        }
                        {
                            offerType == "exchange" && realEstakeTokens.length > 0 &&
                            <>
                                {
                                    realEstakeTokens.map((item: any, index: any) => (
                                        <option value={item.id}>{item.tokenSymbol}</option>
                                    ))
                                }
                            </>
                        }
                    </select>
                </div>

                <div className="flex flex-row w-[100%] mt-3 justify-between">
                    <div>
                        <p>
                            {
                                offerType === "exchange" ? sellTokenName : "Buyer price in $"
                            }
                        </p>
                        <input
                            type="number"
                            value={
                                offerType === 'exchange' ? "1" : offerPriceCurrency
                            }
                            disabled={true}
                            className="h-9 w-[100%] border-[2px] mt-1 border-[#00b3ba] rounded-md focus:outline-none"
                            onChange={(e) => {

                            }}
                        />
                    </div>
                    <img src="./img/exchange.svg" className="w-10 h-10 mt-4" alt="exchange" />
                    <div>
                        <p>
                            {
                                offerType === "exchange" ? buyTokenName : "Buyer price in USDC"
                            }
                        </p>
                        <input value={offerPrice} type="number" className="h-9 w-[100%] border-[2px] mt-1 border-[#00b3ba] rounded-md focus:outline-none"
                            onChange={(e) => {
                                if (offerType !== "exchange") {
                                    const purchasePrice = e.target.value
                                    // setSalePrice(getTokenSalePrice(tokenId, tokens))
                                    const _priceDifference = (salePrice - Number(purchasePrice)) * 100 / salePrice

                                    if (_priceDifference > 5 || _priceDifference < -5)
                                        setIsPriceAvailable(true)
                                    else setIsPriceAvailable(false)

                                    setPriceDifference(_priceDifference.toFixed(2))
                                    setOfferPrice(e.target.value)
                                    setOfferPriceCurrency(Number(e.target.value) * 0.99)
                                }
                                else {

                                    setOfferPrice(e.target.value)
                                    setOfferPriceCurrency(Number(e.target.value) * 0.99)
                                }
                            }}
                        />
                    </div>
                </div>
                {
                    isPriceAvailable &&
                    <p className="w-[50%] text-[red]  text-[12px]">
                        Price difference is {priceDifference}% but limit fixed by shield is +5/-5('shied' on top right cover, for more informations)
                    </p>
                }
                {
                    offerType !== "exchange" ?
                        <p className="w-[50%] text-[black] text-[15px] mt-3">
                            "The official property has been selled for {salePrice} $USD.
                            But you are free to choose the price."
                        </p> :
                        <p className="w-[80%] text-[black] text-[15px] mt-3"    >
                            {
                                sellTokenName !== "null" && buyTokenName !== "null" ?
                                    <>
                                        Indicate how many {buyTokenName} tokens you would like to receive in exchange for 1 {sellTokenName} token.
                                    </>
                                    : ""
                            }
                        </p>
                }

                <div className="bg-[#00b3ba] w-[100%] h-[2px] "></div>

                <p className="text-[15px] text-[#00b3ba] mt-3">Wallet balance</p>
                <div className="flex items-center justify-start mt-1">
                    <img src="./img/billing.png" alt="billing" className="w-12" />
                    <div className="ml-2">
                        <p className="font-bold text-[13px]">{getTokenSymbol(tokenId, tokens)}</p>
                        <p className="text-[13px]">With USDC = {tokenBalance}</p>
                    </div>
                </div>

                <p className="text-[15px] text-[black] mt-3">Quantity</p>
                <input type="number" className="h-9 w-[100%] border-[2px] mt-1 border-[#00b3ba] rounded-md focus:outline-none"
                    onChange={(e) => {
                        setOfferQuantity(Number(e.target.value) * Math.pow(10, 18))
                    }}
                />
                <div className="flex items-center mt-3">
                    <input
                        type="checkbox"
                        checked={isCheckedPrivate}
                        onChange={(e) => {
                            setIsCheckPrivate(e.target.checked)
                        }}
                        className="mr-2 w-5 h-5"
                    />
                    <label className="text-[black] mt-2">I want to create a private offer</label>
                </div>
                <p className="text-[#00b3ba] font-bold">
                    You wish to sell up to "{sellTokenName}" with unit price
                </p>

                {
                    isCheckedPrivate &&
                    <>
                        <p className='mt-2'>Buyer's Address (Only private offers)</p>

                        <input type="text" className="h-9 w-[100%] border-[2px] mt-1 border-[#00b3ba] rounded-md focus:outline-none"
                            onChange={(e) => {
                                setBuyer(e.target.value)
                            }}
                        />
                    </>
                }

                <button
                    className="w-60 h-10 mt-3 border-[2px] border-[#00b3ba] text-[#00b3ba] hover:text-[white] hover:bg-[#00b3ba] duration-300 focus:outline-none rounded"
                    onClick={CreateOffer}
                >
                    Add new Offer
                </button>
            </div>
        </Dialog>
    );
};

export default CreateOfferModal;