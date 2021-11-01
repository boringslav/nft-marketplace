import { useEffect, useState } from "react"
import { ethers } from "ethers"
import axios from "axios"
import Web3Modal from "web3modal"
import { NFTAddress, NFTMarketAddress } from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'//ABI
import NFTMarket from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'//ABI

export default function Home() {
  const [nfts, setNfts] = useState([])
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadNFTs()
  }, [])

  const loadNFTs = async () => {
    const provider = new ethers.providers.JsonRpcProvider()
    const tokenContract = new ethers.Contract(NFTAddress, NFT.abi, provider)
    const marketContract = new ethers.Contract(NFTMarketAddress, NFTMarket.abi, provider)

    const data = await marketContract.fetchMarketItems()

    const items = await Promise.all(data.map(async (i) => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)//get metadata json
      const price = ethers.utils.formatUnits(i.price.toString(), 'ether')

      return {
        tokenId: Number(i.tokenId),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
        price,
      }
    }))
    setNfts(items)
    setIsLoading(false)

  }

  const buyNft = async (nft) => {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)

    const signer = provider.getSigner()
    const contract = new ethers.Contract(NFTMarketAddress, NFTMarket.abi, signer)

    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')

    const transaction = await contract.createMarketSale(NFTAddress, nft.tokenId, { value: price })
    await transaction.wait()

    loadNFTs()
  }
  const renderEmptyShop = () => {
    if (!isLoading && !nfts.length) {
      return <h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>
    }
  }

  return (
    <>
      {renderEmptyShop()}
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
                <div className="p-4 ">
                  <p className="text-2xl font-semibold text-black">{nft.price} Matic</p>
                  <button
                    className="w-full bg-pink-500 text-white font-bold py-2 px-12 rounded"
                    onClick={() => buyNft(nft)}>
                    buy
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
