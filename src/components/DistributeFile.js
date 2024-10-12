import Navbar from "./Navbar";
import Footer from "./Footer.js"; 
import { useState } from "react";
import { uploadFileToIPFS, uploadJSONToIPFS } from "../pinata";
import AuthJSON from '../Auth.json';
import { useLocation } from "react-router";
import axios from 'axios';
//import { pinata } from "./pinata_config"
import { PinataSDK } from "pinata-web3"

export default function SellNFT () {
  const [selectedFile, setSelectedFile] = useState();
  const [fileURL, setFileURL] = useState(null);
  const [formParams, updateFormParams] = useState({ name: '', description: ''});
  const [resultp, setResultp] = useState('');
  
  const pinata = new PinataSDK({
	  pinataJwt: process.env.REACT_APP_PINATA_JWT,
	  pinataGateway: process.env.REACT_APP_GATEWAY_URL,
	});

/*   async function changeHandler(e) {
	const formData = new FormData();
	const {name, description, price} = formParams;
	var file = e.target.files[0];
	formData.append('file',file)

	const config = {headers: {'Content-Type': 'multipart/form-data'}}

	console.log(file)
	let serv_url = 'http://137.184.210.131:5000/upload'
        //check for file extension
        try {
            //upload the file to IPFS
            const response = await axios
			.post(serv_url, file)
			.then((result) => {
				   console.log("Uploaded file to Pinata: ",result)
				   setFileURL(result);
			});
            }
        catch(e) {
            console.log("Error during file upload", e);
        }
	;} */

    //This function uploads the metadata to IPFS
    async function uploadMetadataToIPFS() {
        const {name, description} = formParams;
		let serv_pinJSON = 'http://137.184.210.131:5000/json_upload'
        //Make sure that none of the fields are empty
        if( !name || !description)
            return;

        const nftJSON = {
            name, description
        }

        try {
            //upload the metadata JSON to IPFS
            const response = await axios 
			.post(serv_pinJSON, nftJSON)
			.then((response) => {
                console.log("Uploaded JSON to IPFS: ", response)
				console.log(response.data)
				setResultp(response.config.data)
				return response.config.data;
			}); //uploadJSONToIPFS(nftJSON); 
			return response
        }
        catch(e) {
            console.log("error uploading JSON metadata:", e)
        }
    }

    async function sendIPFS(e) {
        e.preventDefault();

        //Upload data to IPFS
        try {
            const metadataURL = await uploadMetadataToIPFS();
			console.log("Uploaded!");
        }
        catch(e) {
            alert( "Upload error"+e )
        }
    }

  return (
    <>
      <div class="px-10 py-2">
        <div class="container-fluid px-10" style={{"max-height":"125vh"}}>
        <div class="flex flex-col place-items-center mt-10 ml-10 px-10 bg-gradient-to-t from-white" id="nftForm">
            <form class="bg-white shadow-md rounded px-8 pt-4 pb-8 mb-4">
            <h3 class="text-center font-bold text-purple-500 mb-8">Upload your Message to IPFS</h3>
                <div class="mb-4 px-10">
                    <label class="block text-purple-500 text-sm font-bold mb-2 " htmlFor="name">Name</label>
					<br></br>
                    <input class="shadow appearance-none border rounded w-full py-2 px-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="..." onChange={e => updateFormParams({...formParams, name: e.target.value})} value={formParams.name}></input>
                </div>
                <div class="mb-6 px-10">
                    <label class="block text-purple-500 text-sm font-bold mb-2" htmlFor="description">Description</label>
                    <br></br>
					<textarea class="shadow appearance-none border rounded w-full py-2 px-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" cols="40" rows="5" id="description" type="text" placeholder="This is an immutable message" value={formParams.description} onChange={e => updateFormParams({...formParams, description: e.target.value})}></textarea>
                </div>
                <br></br>
                <button onClick={sendIPFS} class="font-bold mt-10 w-full bg-purple-500 text-black rounded p-2 px-10 shadow-lg">
                    Send to IPFS
                </button>
				<div class="text-green text-center">{resultp}</div>
            </form>
        </div>
		<Footer/>
        </div>
		</div>
    </>
  );
}
