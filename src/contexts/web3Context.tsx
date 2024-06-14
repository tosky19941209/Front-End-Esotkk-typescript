import {
    createContext,
    useEffect,
    useState,
    useCallback,
    useMemo,
} from 'react';
import Web3 from 'web3';
import { ethers, Contract, ContractRunner } from 'ethers';
import { useAccount, useChainId } from 'wagmi';

import { useEthersProvider, useEthersSigner } from '../utils/wagmi-ethers';
import { Web3ContextType } from '../types';
import EstokkYamContractAbi from '../contract/EstokkYam.json';
import { estokkYamContractAddress_Sepolia } from '../constant';
import { estokkYamContractAddress_Chiado } from '../constant';
import { Container } from 'postcss';

declare let window: any;
const Web3Context = createContext<Web3ContextType | null>(null);

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
    const { address, isConnected } = useAccount();
    const chainId = useChainId();
    const signer = useEthersSigner();
    const ethersProvider = useEthersProvider();
    const defaultProvider = new ethers.JsonRpcProvider('https://ethereum-sepolia-rpc.publicnode.com');
    const web3 = new Web3(window.ethereum);

    const [provider, setProvider] = useState<ContractRunner>(defaultProvider);
    const [estokkYamContractAddress, setEstokkYamContractAddress] = useState<any>()
    const [estokkYamContract, setEstokkYamContract] = useState<Contract>({} as Contract);

    const init = useCallback(async () => {
        try {
            if (!isConnected || !ethersProvider) {
                console.log('Not connected wallet');
            } else {
                setProvider(ethersProvider);
                console.log('Connected wallet');
            }

            let _estokkYamContract:any;
            if(chainId === 10200){
                _estokkYamContract = new web3.eth.Contract(
                    EstokkYamContractAbi,
                    estokkYamContractAddress_Chiado
                );
            } else if(chainId === 11155111){
                _estokkYamContract = new web3.eth.Contract(
                    EstokkYamContractAbi,
                    estokkYamContractAddress_Sepolia
                );
            }

            setEstokkYamContract(_estokkYamContract);

        } catch (err) {
            console.log(err);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isConnected, ethersProvider, provider]);

    useEffect(() => {
        init();
    }, [init]);

    const value = useMemo(
        () => ({
            account: address,
            chainId,
            isConnected,
            library: provider ?? signer,
            estokkYamContract,
            estokkYamContractAddress
        }),
        [
            address,
            chainId,
            isConnected,
            provider,
            signer,
            estokkYamContract,
            estokkYamContractAddress
        ]
    );

    return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};

export default Web3Context;
