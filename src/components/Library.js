import Navbar from "./Navbar";
import Footer from "./Footer.js"; 
import AuthJSON from "../Auth.json";
import axios from "axios";
import { useState } from "react";
import ReactModal from 'react-modal';
//import crypto from 'crypto-browserify';
import diagram from '../diagram.png'; 

export default function Authentication() {
const sampleData = [
    {
        "name": "The Brain Activity Map",
		"tokenId": "21",
        "description": "Brain mapping initiative",
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
        "name": "The Bible",
		"tokenId": "24",
        "description": "King James Version",
        "website":"http://axieinfinity.io",
		"hash":"na",
        "image":"https://indigo-bitter-stork-403.mypinata.cloud/ipfs/QmSNcY6sLqyLLRSYuP61XgPhK5JL5VoiXJM7LSQxbXFUrt",
        "address":"0xe81Bf5A757C4f7F82a2F23b1e59bE45c33c5b13",
    },
    {
        "name": "Isaac's Favorite",
		"tokenId": "25",
        "description": "This is a good one!",
        "website":"http://axieinfinity.io",
		"hash":"d273685b95de9eb7ce5244c2d9beb8c6",
        "image":"https://indigo-bitter-stork-403.mypinata.cloud/ipfs/QmQ69AjrbxvGhWpgQPB9WJYmQdosb7vdjwJdXNgm5eD23Q",
        "address":"0xe81Bf5A757C4f7F82a2F23b1e59bE45c33c5b13",
    },
];
const [data, updateData] = useState(sampleData);

const [dataFetched, updateFetched] = useState(false);

const [isOpen, setIsOpen] = useState(true);
const [file, setFile] = useState()
const [res, setRes] = useState([]);

function toggleModal() {
    setIsOpen(!isOpen);
}
	
async function getAllNFTs() {
    const ethers = require("ethers");
    //After adding your Hardhat network to your metamask, this code will get providers and signers
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
	const addr = await signer.getAddress();  ////  ART Added this to stop RPC Error 429 - too many requests for metamask.
	
	//Pull the deployed contract instance
	//try {
    let contract = new ethers.Contract(AuthJSON.address, AuthJSON.abi, signer)
	//}
	//catch(e) {
	//console.log('issue with contract: ', e)
	//}
    //create an NFT Token
    let transaction = await contract.getAllNFTs()

    //Fetch all the details of every NFT from the contract and display
    const items = await Promise.all(transaction.map(async i => {
        const tokenURI = await contract.tokenURI(i.tokenId);
        let meta = await axios({ //axios.get(tokenURI);
				method: "get",
				url: tokenURI,
				headers: {
					'Accept': 'text/plain',
				}
		});
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
        return item;
    }))

    updateFetched(true);
    updateData(items);
}

function List({ children }) {
  return (
    <ul className="slate-100">
      {children}
    </ul>
  )
}

if(!dataFetched)
    try {
		getAllNFTs();
	}
    catch(e) {
        alert( "Error Retrieving Hash" )
    }	
	
return (
		<div class="px-2 py-2" >
		<div class="px-2 py-2">
		 <div class="px-2 py-2">     
			 <h1 className="text-lg ml-10 mr-10 mt-10 border-b">Immutable Knowledge</h1>
			 <p className="flow-text text-md ml-10 mr-10 mb-10 break-word">
			 The goal of this project is to store, make accesible and verify authenticity of digital information using the cryptographic methods of Ethereum and checksums.
			 </p>
			 <p className="flow-text text-md ml-10 mr-10 mb-10 break-word">
			 A file or message is created and then has a checksum run on it. The hash is stored on the Ethereum blockchain.  The PDF is stored on IPFS.  When a user connects their wallet to the library, they can have an md5 checksum run on a pdf and the resulting hash is compared to the md5 checksum stored on Ethereum blockchain from the original PDF. In this way, the original file is stored on a distributed compute system and verification of its authenticity is saved on the immutable Ethereum blockchain, guaranteeing that the document you are reading is the original version.
			 </p>
			 <div class="row text-center">
			 <div class="span4"><img src="diagram.png" class="img-fluid" alt="Responsive image"/></div>
			 </div>
         </div>
		 
		 </div>
		<table class="table table-striped table-dark">
		  <thead>
			<tr>
			  <th scope="col">#</th>
			  <th scope="col">Title</th>
			  <th scope="col">Description</th>
			  <th scope="col">Source</th>
			</tr>
		  </thead>
		  <tbody>
			<tr>
			  <th scope="row">1</th>
			  <td>The Brain Activity Map</td>
			  <td>Initiative by Ivy League Universities</td>
			  <td>PubMed</td>
			</tr>
			<tr>
			  <th scope="row">2</th>
			  <td>The Bible</td>
			  <td>Gutenberg Press</td>
			  <td>History</td>
			</tr>
			<tr>
			  <th scope="row">3</th>
			  <td>Shakespeare</td>
			  <td>All of Shakespeare's works</td>
			  <td>Folger Shakespeare Library</td>
			</tr>
		  </tbody>
		</table>

		<Footer/>
    </div>
  
);

}
