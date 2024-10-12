import logo from '../logo_3.png';
import fullLogo from '../full_logo.png';
import background from '../bg.png';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";
import { useEffect, useState } from 'react';

import { useLocation } from 'react-router';
import "../node_modules/jquery/dist/jquery.min.js";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.min.js";

function Navbar() {

	const [connected, toggleConnect] = useState(false);
	const location = useLocation();
	const [currAddress, updateAddress] = useState('0x');
	const [navbarOpen, setNavbarOpen] = useState(false);
	const [loggedIn, setLoggedIn ] = useState(false)



	async function getAddress() {
	  const ethers = require("ethers");
	  const provider = new ethers.providers.Web3Provider(window.ethereum);
	  const signer = provider.getSigner();
	  const addr = await signer.getAddress();
	  updateAddress(addr);
	}

	function updateButton() {
	  const ethereumButton = document.querySelector('.enableEthereumButton');
	  ethereumButton.textContent = "Connected";
	  ethereumButton.classList.remove("hover:bg-blue-70");
	  ethereumButton.classList.remove("bg-blue-500");
	  ethereumButton.classList.add("hover:bg-green-70");
	  ethereumButton.classList.add("bg-green-300");
	}

	async function connectWebsite() {

		const chainId = await window.ethereum.request({ method: 'eth_chainId' });
		if(chainId !== '0x5')
		{
		  //alert('Incorrect network! Switch your metamask network to Rinkeby');
		  await window.ethereum.request({
			method: 'wallet_switchEthereumChain',
			params: [{ chainId: '0x5' }],
		 })
		}  
		await window.ethereum.request({ method: 'eth_requestAccounts' })
		  .then(() => {
			
			console.log("here");
			getAddress();
			window.location.replace(location.pathname)
		  });
		
		window.location.reload();
	}

	useEffect(() => {
		let val = window.ethereum?.isConnected();
		if(val)
		{
		  console.log("here");
		  getAddress();
		  toggleConnect(val);
		  
		}

		window.ethereum?.on('accountsChanged', function(accounts){
		  window.location.replace(location.pathname)
		  updateButton();
		  window.location.reload();
		})
	},[location.pathname]);


    return (

	<nav class="navbar navbar-expand-lg navbar-light bg-light">
	  <div class="container-fluid">
	    <a class="navbar-brand px-10 py-10" href="#" >no-edge</a>
		<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
		  <span class="navbar-toggler-icon"></span>
		</button>

	  <div class="collapse navbar-collapse" id="navbarSupportedContent">
		<ul class="navbar-nav me-auto mb-2 mb-lg-0">
		  <li class="nav-item">
			<a class="nav-link" href="/">Public</a>
		  </li>
		  <li class="nav-item">
			<a class="nav-link" href="/DistributeFile">Distribute File</a>
		  </li>
		  <li class="nav-item">
			<a class="nav-link" href="/profile">My Files</a>
		  </li>
		</ul>
		<form class="form-inline my-2 my-lg-0">
		  <button class="btn btn-outline-success my-2 my-sm-0" type="submit" onClick={connectWebsite}>{connected? "Connected":"Connect Wallet"}</button>
		</form>
	  </div>
	  </div>
	</nav>

    );
  }

export default Navbar;
  
 /*       <div class="navbar navbar-light bg-light px-3 py-2">
		<nav class="navbar navbar-expand-lg navbar-light bg-light ">
		  <a class="navbar-brand px-5" href="#">Gravity</a>
		  <button class="navbar-toggler justify-content-end" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
			<span class="navbar-toggler-icon"></span>
		  </button>
		  <div class="collapse navbar-collapse justify-content-end" id="navbarNavDropdown">
			<ul class="navbar-nav me-auto mb-2 mb-lg-0">
			  <li class="nav-item active pl-5">
				<a class="nav-link" href="/">Public library</a>
			  </li>
			  <li class="nav-item">
				<a class="nav-link" href="/DistributeFile">Distribute File</a>
			  </li>
			  <li class="nav-item">
				<a class="nav-link" href="/profile">My library</a>
			  </li>
			  <li>
			  <button class="btn btn-outline-success my-2 my-sm-0" type="submit" onClick={connectWebsite}>{connected? "Connected":"Connect Wallet"}</button>
			  </li>
			</ul>
		  </div>
		  
		</nav>
        <div className='text-black text-bold text-right mr-10 text-sm'>
          {currAddress !== "0x" ? "Connected to":"Not Connected. Please Connect Wallet"} {currAddress !== "0x" ? (currAddress.substring(0,15)+'...'):""}
        </div>
      </div> */