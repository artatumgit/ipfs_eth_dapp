import Navbar from "./Navbar";
import { useParams } from 'react-router-dom';
import AuthJSON from "../Auth.json";
import Tile from "./Tile";
import ListItem from "./ListItem";
import Footer from "./Footer.js";
import axios from "axios";
import { useState } from "react";

export default function Profile () {

	const sampleData = [
		{
			"name": "The Brain Activity Map",
			"tokenId": "21",
			"description": "Howard Hughes Medical Institute",
			"website":"http://axieinfinity.io",
			"hash": "d273685b95de9eb7ce5244c2d9beb8c6",
			"image":"https://indigo-bitter-stork-403.mypinata.cloud/ipfs/QmYkYCCScddypng8J9s5gqZRgonLuUvS7nmbhZM4Dj7ai5",
			"address":"0xC66D5AdDb3e8Bdf4575a0d95c08009d7AEfD88B2",
		},
		{
			"name": "The Care & Keeping of You",
			"tokenId": "22",
			"description": "The Body Book For Girls",
			"website":"http://axieinfinity.io",
			"hash":"na",
			"image":"https://indigo-bitter-stork-403.mypinata.cloud/ipfs/QmYkYCCScddypng8J9s5gqZRgonLuUvS7nmbhZM4Dj7ai5",
			"address":"0xC66D5AdDb3e8Bdf4575a0d95c08009d7AEfD88B2",
		},
		{
			"name": "Shakespeare",
			"tokenId": "23",
			"description": "Shakespeare",
			"website":"http://axieinfinity.io",
			"hash":"na",
			"image":"https://indigo-bitter-stork-403.mypinata.cloud/ipfs/QmYkYCCScddypng8J9s5gqZRgonLuUvS7nmbhZM4Dj7ai5",
			"address":"0xe81Bf5A757C4f7F82a2F23b1e59bE45c33c5b13",
		},
		{
			"name": "We Love Ballet",
			"tokenId": "24",
			"description": "Childrens Book",
			"website":"http://axieinfinity.io",
			"hash":"na",
			"image":"https://indigo-bitter-stork-403.mypinata.cloud/ipfs/QmSNcY6sLqyLLRSYuP61XgPhK5JL5VoiXJM7LSQxbXFUrt",
			"address":"0xe81Bf5A757C4f7F82a2F23b1e59bE45c33c5b13",
		},
		{
			"name": "Isaac's Favorite",
			"tokenId": "25",
			"description": "",
			"website":"http://axieinfinity.io",
			"hash":"na",
			"image":"https://indigo-bitter-stork-403.mypinata.cloud/ipfs/QmQ69AjrbxvGhWpgQPB9WJYmQdosb7vdjwJdXNgm5eD23Q",
			"address":"0xe81Bf5A757C4f7F82a2F23b1e59bE45c33c5b13",
		},
	];

    const [data, updateData] = useState(sampleData); //useState([]);
	const [dataFetched, updateFetched] = useState(false);
    const [address, updateAddress] = useState("0x");
    const [totalPrice, updateTotalPrice] = useState("0");

    async function getNFTData(tokenId) {
        const ethers = require("ethers");
        let sumPrice = 0;

        //After adding your Hardhat network to your metamask, this code will get providers and signers
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const addr = await signer.getAddress();

        //Pull the deployed contract instance
        let contract = new ethers.Contract(AuthJSON.address, AuthJSON.abi, signer)

        //create an NFT Token
        let transaction = await contract.getMyNFTs()

        /*
        * Below function takes the metadata from tokenURI and the data returned by getMyNFTs() contract function
        * and creates an object of information that is to be displayed
        */
        
        const items = await Promise.all(transaction.map(async i => {
            const tokenURI = await contract.tokenURI(i.tokenId);
            let meta = await axios.get(tokenURI);
            meta = meta.data;

            let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
            let item = {
                price,
                tokenId: i.tokenId.toNumber(),
                seller: i.seller,
                owner: i.owner,
                image: meta.image,
                name: meta.name,
                description: meta.description,
            }
            sumPrice += Number(price);
            return item;
        }))

        updateData(items);
        updateFetched(true);
        updateAddress(addr);
        updateTotalPrice(sumPrice.toPrecision(3));
    }

    const params = useParams();
    const tokenId = params.tokenId;
	
	function List({ children }) {
	  return (
		<ul className="divide-y divide-slate-100">
		  {children}
		</ul>
	  )
	}
	
	if(!dataFetched)
		try {
			getNFTData(tokenId);
		}
		catch(e) {
			alert( "Error Retrieving Hash" )
			updateData([]);
		}
    
    return (
        <div class="profileClass justify-center bg-gradient-to-t from-white" style={{"max-height":"125vh"}}>
            <div class="flex flex-col bg-stone-800/50 ml-5 mb-10 mt-10 mr-5 md:mt-20 md:mb-20 md:ml-24 md:mr-24 items-center justify-center rounded-lg shadow-2xl">
            <div class="flex text-center flex-col mt-5 md:text-2xl text-black">
			<div class="flex flex-col text-center items-center mt-4 mb-3 border-b border-slate-200">
                <div class="flex flex-col max-w-md mb-5 ">
                    <h2 class="text-md">Wallet Address</h2>
					<p class="flow-text break-all text-sm">{address}</p>
                </div>
			</div>
            </div>
            <div class="flex flex-row text-center justify-center mt-10 md:text-2xl text-black">
                    <div>
                        <h2 class="font-bold">{address !== "0x" ? "Files":"Demo Files"} </h2>
                        {data.length}
                    </div>

            </div>
            <div class="flex flex-col text-center items-center mt-10 md:text-2xl text-black">
          
			<div class="divide-y-2 divide-black ml-24 mt-5 mb-12">
			  <List>
				{data.map((value, index) => (
				  <ListItem data={value} key={index}/>
				))}
			  </List>
			</div>
                <div class="mt-10 text-xl">
                    {data.length === 0 ? "No data to display. You might not be logged in or you haven't moved any files to your wallet.":""}
                </div>
            </div>
            </div>
		<Footer/>
        </div>
    )
};
