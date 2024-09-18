import { useState } from "react";
import { mnemonicToSeed } from "bip39";
import { ethers, Wallet, HDNodeWallet } from "ethers";  // Import ethers

export const EthWallet = ({ mnemonic }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [addresses, setAddresses] = useState([]);
    const [balances, setBalances] = useState([]);
    const [selectedWallet, setSelectedWallet] = useState(null);
    const [recipientAddress, setRecipientAddress] = useState('');
    const [sendAmount, setSendAmount] = useState('');

    const addWallet = async () => {
        const seed = await mnemonicToSeed(mnemonic);
        const derivationPath = `m/44'/60'/${currentIndex}'/0'`;
        const hdNode = HDNodeWallet.fromSeed(seed);
        const child = hdNode.derivePath(derivationPath);
        const privateKey = child.privateKey;
        const wallet = new Wallet(privateKey);
        setCurrentIndex(currentIndex + 1);
        setAddresses([...addresses, wallet.address]);
        setBalances([...balances, null]);
    };

    const handleWalletClick = (index) => {
        setSelectedWallet(index === selectedWallet ? null : index);
        getBalance(addresses[index], index);
    };

    const getBalance = async (address, index) => {
        try {
            const response = await fetch('http://localhost:5000/api/get-eth-balance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ address }),
            });

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const data = await response.json();

            if (data.error) {
                throw new Error(`API error: ${data.error.message}`);
            }

            const balanceInEth = parseFloat(data.balance).toFixed(4);

            setBalances((prevBalances) => {
                const newBalances = [...prevBalances];
                newBalances[index] = balanceInEth;
                return newBalances;
            });

        } catch (error) {
            console.error('Error fetching balance:', error.message);

            setBalances((prevBalances) => {
                const newBalances = [...prevBalances];
                newBalances[index] = 'Error';
                return newBalances;
            });
        }
    };

    const handleCopy = (address) => {
        navigator.clipboard.writeText(address);
        alert("Address copied to clipboard!");
    };

    const handleSendEthereum = async (index) => {
        try {
            const seed = await mnemonicToSeed(mnemonic);
            const derivationPath = `m/44'/60'/${index}'/0'`;
            const hdNode = HDNodeWallet.fromSeed(seed);
            const child = hdNode.derivePath(derivationPath);
            const privateKey = child.privateKey;
            const wallet = new Wallet(privateKey);

            const provider = new ethers.providers.InfuraProvider('goerli', '89a9860db5744bd7b55e84ea3aabc97f');
            const walletWithProvider = wallet.connect(provider);

            const tx = {
                to: recipientAddress,
                value: ethers.parseEther(sendAmount),
            };

            const transactionResponse = await walletWithProvider.sendTransaction(tx);
            console.log('Transaction hash:', transactionResponse.hash);

            await transactionResponse.wait();
            alert(`Transaction sent! Hash: ${transactionResponse.hash}`);
        } catch (error) {
            console.error('Error sending Ethereum:', error);
            alert('Failed to send Ethereum. Please check the console for more details.');
        }
    };

    return (
        <div>
            <div className="flex justify-center">
                <button
                    className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
                    onClick={addWallet}
                >
                    Add Ethereum wallet
                </button>
            </div>

            <section className="text-gray-600 body-font">
                <div className="container px-5 py-24 mx-auto">
                    <div className="flex flex-wrap -m-2">
                        {addresses.map((address, index) => (
                            <div key={index} className="p-2 w-full md:w-1/2 lg:w-1/3 relative">
                                <div className="h-full flex items-center border-gray-200 border p-4 rounded-lg cursor-pointer relative z-10" onClick={() => handleWalletClick(index)}>
                                    <img
                                        alt="wallet"
                                        className="w-16 h-16 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4"
                                        src="https://dummyimage.com/80x80"
                                    />
                                    <div className="flex-grow overflow-hidden">
                                        <h2 className="text-gray-900 title-font font-medium">
                                            Wallet {index + 1}
                                        </h2>
                                        <p
                                            className="text-gray-500 text-sm font-mono overflow-hidden overflow-ellipsis whitespace-nowrap"
                                            style={{ maxWidth: '260px' }}
                                        >
                                            Public Address: {address}
                                        </p>
                                    </div>
                                </div>
                                {selectedWallet === index && (
                                    <div className="absolute top-0 left-0 transform -translate-y-full bg-white rounded-lg shadow-lg p-6 w-full z-20">
                                        <h2 className="text-gray-900 text-lg mb-1 font-medium title-font">
                                            Wallet {index + 1}
                                        </h2>
                                        <p className="leading-relaxed mb-5 text-gray-600">
                                            Public Address: {address}
                                        </p>
                                        <p className="leading-relaxed mb-5 text-gray-600">
                                            Balance: {balances[index]} ETH
                                        </p>
                                        <button className="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg mb-4">
                                            Buy
                                        </button>
                                        <div className="relative mb-4">
                                            <label htmlFor={`receiver-${index}`} className="leading-7 text-sm text-gray-600">
                                                Receiver address:
                                            </label>
                                            <input
                                                type="text"
                                                id={`receiver-${index}`}
                                                name="receiver"
                                                value={recipientAddress}
                                                onChange={(e) => setRecipientAddress(e.target.value)}
                                                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out mb-4"
                                            />
                                            <label htmlFor={`amount-${index}`} className="leading-7 text-sm text-gray-600">
                                                Amount:
                                            </label>
                                            <input
                                                type="text"
                                                id={`amount-${index}`}
                                                name="amount"
                                                value={sendAmount}
                                                onChange={(e) => setSendAmount(e.target.value)}
                                                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                            />
                                        </div>
                                        <button
                                            className="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg"
                                            onClick={() => handleSendEthereum(index)}
                                        >
                                            Send
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};
