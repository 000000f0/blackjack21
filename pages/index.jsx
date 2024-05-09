import abi from '../utils/BuyMeACoffee.json';
import { ethers } from 'ethers';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import GameBoard from './GameBoard';

export default function Home() {
  // Contract Address & ABI
  const contractAddress = '0x6968E861b047b4524b1d16Cb30e2F9707B03020E';
  const contractABI = abi.abi;

  // Component state
  const [currentAccount, setCurrentAccount] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [simulationRunning, setSimulationRunning] = useState(false);

  const onNameChange = (event) => {
    setName(event.target.value);
  };

  const onMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const startSimulation = () => {
    console.log('Starting simulation...');
    setSimulationRunning(true);
  };

  const handleSimulationEnd = () => {
    console.log('Simulation ended.');
    setSimulationRunning(false);
  };

  // Wallet connection logic
  const isWalletConnected = async () => {
    try {
      const { ethereum } = window;

      const accounts = await ethereum.request({ method: 'eth_accounts' });
      console.log('accounts: ', accounts);

      if (accounts.length > 0) {
        const account = accounts[0];
        console.log('wallet is connected! ' + account);
      } else {
        console.log('make sure MetaMask is connected');
      }
    } catch (error) {
      console.log('error: ', error);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log('please install MetaMask');
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });

      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const buyCoffee = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum, 'any');
        const signer = provider.getSigner();
        const buyMeACoffee = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        console.log('buying coffee..');
        const coffeeTxn = await buyMeACoffee.buyCoffee(
          name ? name : 'anon',
          message ? message : 'Enjoy your coffee!',
          { value: ethers.utils.parseEther('0.001') }
        );

        await coffeeTxn.wait();

        console.log('mined ', coffeeTxn.hash);

        console.log('coffee purchased!');

        // Clear the form fields.
        setName('');
        setMessage('');
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    isWalletConnected();
  }, []);

  return (
    <center>
      <html
        style={{
          backgroundColor: '#000000',
          opacity: 1,
          backgroundSize: '10px 10px',
        }}
      >
        <div
          className={`container ${isDarkMode ? 'darkMode' : ''}`}
          style={{
            border: isDarkMode ? '1px solid black' : '1px solid black',
            backgroundColor: isDarkMode ? 'black' : 'white',
            color: isDarkMode ? 'white' : 'black',
            width: '90vw'
          }}
        >
          <div
            className="nav-header"
            style={{
              zIndex: '2',
              backgroundColor: isDarkMode ? 'black' : 'white',
              borderBottom: isDarkMode ? '1px solid white' : '1px solid black',
            }}
          >
            <img
              style={{ width: '50px' }}
              src={!isDarkMode ? 'https://imgimg.s3.eu-west-1.amazonaws.com/21_small.png' : 'https://imgimg.s3.eu-west-1.amazonaws.com/21_small_black.png'}
              alt="Logo"
            />
            <div className="wallet-address" style={{ textAlign: 'left', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: isDarkMode ? 'white' : 'black' }}>
              {currentAccount && (
                <>
                  {currentAccount.substring(0, 6)}...{currentAccount.substring(currentAccount.length - 4)}
                </>
              )}
            </div>
            <div className="toggle-darkmode" style={{ marginLeft: 'auto', marginRight: '50px', alignContent: 'right' }}>
              <label className="switch">
                <input type="checkbox" onChange={toggleDarkMode} />
                <span className="slider"></span>
              </label>
            </div>
          </div>
          <Head>
            <title>21bot</title>
            <meta name="description" content="Lottery" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <main className="main">
            <br />
            <br />
            <br />
            <br />
            <div>
              <img
                style={{ width: '50px' }}
                src={!isDarkMode ? 'https://imgimg.s3.eu-west-1.amazonaws.com/21_small.png' : 'https://imgimg.s3.eu-west-1.amazonaws.com/21_small_black.png'}
                alt="Logo"
              />
              <br />
            </div>
            {currentAccount ? (
              <div>
                <form>
                  <div className="formgroup">
                    <label>Name</label>
                    <br />
                    <input
                      id="name"
                      type="text"
                      placeholder="anon"
                      onChange={onNameChange}
                    />
                  </div>
                  <br />
                  <div className="formgroup">
                    <label>Send Erik a message</label>
                    <br />
                    <textarea
                      rows={3}
                      placeholder="Enjoy your coffee!"
                      id="message"
                      onChange={onMessageChange}
                      required
                    ></textarea>
                  </div>
                  <div>
                    <button className="coffee-button" type="button" onClick={buyCoffee}>
                      Send 1 Coffee for 0.001ETH
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <>
                <button className="connect-button" onClick={connectWallet}>
                  Connect your wallet
                </button>
              </>
            )}
            <p>
              Welcome <b>YourAddressHere</b>, you have{' '}
              <b>YourBalanceHere TokenSymbolHere</b>.
            </p>

            <center>
            <GameBoard simulationRunning={simulationRunning} onSimulationEnd={handleSimulationEnd} isDarkMode={isDarkMode} />
            </center>
            <div>
              {!simulationRunning && (
                <button className="simulation-button" onClick={startSimulation}>
                  Start Simulation
                </button>
              )}
            </div>
            <br />
          </main>
        </div>
      </html>
    </center>
  );
}
