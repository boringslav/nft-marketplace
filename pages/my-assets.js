import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Web3Modal from 'web3modal';

import { NFTAddress, NFTMarketAddress } from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'//ABI
import NFTMarket from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'//ABI


function MyAssets() {
    const [nfts, setNFTs] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        loadNFTs()
    }, []);

    const loadNFTs = async () => {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        const tokenContract = new ethers.Contract(NFTAddress, NFT.abi, provider)
        const marketContract = new ethers.Contract(NFTMarketAddress, NFTMarket.abi, signer)

        const data = await marketContract.fetchMyNFTs()

        const items = await Promise.all(data.map(async i => {
            const tokenUri = await tokenContract.tokenURI(i.tokenId)
            const meta = await axios.get(tokenUri)
            let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
            let item = {
                price,
                tokenId: i.tokenId.toNumber(),
                seller: i.seller,
                owner: i.owner,
                image: meta.data.image,
            }
            return item
        }))
        setNFTs(items)
        setIsLoading(false)
    }

    const renderNoUserNFTs = () => {
        if (!isLoading && !nfts.length) {
            return <h1 className="px-20 py-10 text-3xl">No assets owned</h1>
        }
    }
    return (
        <div>
            {renderNoUserNFTs()}
            <div className="flex justify-center">
                <div className="px-4" style={{ maxWidth: '1600px' }}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                        {nfts.map((nft, i) => (
                            <div key={i} className="border shadow rounded-xl overflow-hidden">
                                <img src={nft.image} />
                                <div className="p-4">
                                    <p className="text-2xl font-semibold">{nft.name}</p>
                                </div>
                                <div style={{ height: '70px', overflow: 'hidden' }}>
                                    <p className="text-gray-400">{nft.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default MyAssets
