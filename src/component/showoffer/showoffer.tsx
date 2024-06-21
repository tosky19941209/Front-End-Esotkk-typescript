import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { convertToObject } from "typescript";
import useWeb3 from "../../hooks/useWeb3";
import toastr from "toastr"

const ShowOffer: React.FC = () => {

    const { estokkYamContract, account } = useWeb3()
    const { state } = useLocation()
    const { index } = state || {};
    const [offerId, setOfferId] = useState<Number>()
    const [offerToken, setOfferToken] = useState<any>()
    const [buyerToken, setBuyerToken] = useState<any>()
    const [seller, setSeller] = useState<any>()
    const [price, setPrice] = useState<any>()
    const [amount, setAmount] = useState<any>()

    const Initialize = async () => {
        const offer = await estokkYamContract.methods.showOffer(offerId).call()
        const _offerToken = await estokkYamContract.methods.tokenInfo(offer[0]).call()
        const _buyerToken = await estokkYamContract.methods.tokenInfo(offer[1]).call()
        const _seller = offer[2]
        const _price = offer[4]
        const _amount = offer[5]
        setOfferToken(_offerToken[2])
        setBuyerToken(_buyerToken[2])
        setSeller(_seller)
        setPrice(_price)
        setAmount(_amount)
    }

    const Buy = async () => {
        try {
            await estokkYamContract.methods.buy(0, price, amount).send({ from: account })
            toastr.success("Successful")
        } catch (err) {
            console.log(err)
            toastr.error("Failed")
        }
    }

    useEffect(() => {
        if (offerId)
            Initialize()
    }, [offerId])

    useEffect(() => {
        setOfferId(index)

    }, [])

    // useEffect(() => {
    //     console.log("Amount: ", amount)
    // }, [price, amount])
    return (
        <div className="flex flex-col items-center justify-center w-[100%] bg-[white]">
            <p className="flex w-[80vw] bg-[#00dbe3] text-[white] text-[30px] items-center justify-center mt-20">
                SELL
            </p>
            <img src='./img/offerbackground.png' alt="offerbackground" className="w-[80vw]" />
            <p className="flex w-[80vw] bg-[#173039] text-[white] text-[30px] items-center justify-center">
                20550 Townsen Blvd Bldg 2 unit 101
                <p className="text-[30px] text-[#00dbe3] ml-3">Humble Tx 77338</p>
            </p>
            <div className="w-[60vw]">
                <div className="flex flex-col items-center justify-center w-40 bg-[#173039] rounded mt-4">
                    <p className="text-[#00dbe3] text-[20px]">
                        {String(offerId)}
                    </p>
                    <p className="text-[white] text-[15px]">1948</p>
                </div>
                <div className="pl-3">
                    <p className="text-[#00dbe3] text-[20px] mt-3">Offer Token Name</p>
                    <p>{offerToken}</p>

                    <p className="text-[#00dbe3] text-[20px] mt-3">Buyer Token Name</p>
                    <p>{buyerToken}</p>

                    <p className="text-[#00dbe3] text-[20px] mt-3">Seller Address</p>
                    <p>{seller}</p>

                    <p className="text-[#00dbe3] text-[20px] mt-3">Quantity</p>
                    <p>{String(Number(amount) / Math.pow(10, 18))}</p>

                    <p className="text-[#00dbe3] text-[20px] mt-3">Price</p>
                    <p>{String(price)}</p>
                </div>
                <button className="flex items-center justify-center w-[100%] bg-[#23a2bb] mt-5 mb-5 "
                    onClick={Buy}
                >
                    <p className="text-[25px] text-[white] font-bold">Cart</p>
                    <img src="./img/cart.svg" alt="cart.svg" className="w-10" />
                </button>
            </div>
        </div>
    )
}

export default ShowOffer;