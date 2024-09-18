import { useState } from "react";
import { Connection, clusterApiUrl, PublicKey, LAMPORTS_PER_SOL, Transaction, SystemProgram } from "@solana/web3.js";
import { mnemonicToSeedSync } from "bip39";
import nacl from "tweetnacl";
import { derivePath } from "ed25519-hd-key";

export const SolanaWallet = ({ mnemonic }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [addresses, setAddresses] = useState([]);
    const [balances, setBalances] = useState([]);
    const [selectedWallet, setSelectedWallet] = useState(null);
    const [recipientAddress, setRecipientAddress] = useState('');
    const [sendAmount, setSendAmount] = useState('');

    const connection = new Connection(clusterApiUrl('devnet'));

    const addWallet = async () => {
        const seed = mnemonicToSeedSync(mnemonic);
        const path = `m/44'/501'/${currentIndex}'/0'`;
        const derivedSeed = derivePath(path, seed.toString('hex')).key;
        const keypair = nacl.sign.keyPair.fromSeed(derivedSeed);

        const publicKey = new PublicKey(keypair.publicKey).toString();
        setCurrentIndex(currentIndex + 1);
        setAddresses([...addresses, publicKey]);
        setBalances([...balances, null]);

        // Fetch balance
        const balance = await connection.getBalance(new PublicKey(publicKey));
        setBalances(prevBalances => [...prevBalances.slice(0, currentIndex), balance / LAMPORTS_PER_SOL]);
    };

    const updateBalance = async (index) => {
        const publicKey = new PublicKey(addresses[index]);
        const balance = await connection.getBalance(publicKey);
        setBalances(prevBalances => {
            const updatedBalances = [...prevBalances];
            updatedBalances[index] = balance / LAMPORTS_PER_SOL;
            return updatedBalances;
        });
    };

    const handleWalletClick = (index) => {
        setSelectedWallet(index === selectedWallet ? null : index);
    };

    const handleSendSol = async (index) => {
        try {
            // Derive the seed and generate keypair for the selected wallet
            const seed = mnemonicToSeedSync(mnemonic);
            const path = `m/44'/501'/${index}'/0'`;
            const derivedSeed = derivePath(path, seed.toString('hex')).key;
            const keypair = nacl.sign.keyPair.fromSeed(derivedSeed);

            // Validate the recipient address
            const fromPubkey = new PublicKey(keypair.publicKey);
            let toPubkey;
            try {
                toPubkey = new PublicKey(recipientAddress);
            } catch (error) {
                alert('Invalid recipient address.');
                return;
            }

            // Convert the send amount to lamports (1 SOL = 1 billion lamports)
            const lamports = parseFloat(sendAmount) * LAMPORTS_PER_SOL;

            // Fetch the latest blockhash
            const { blockhash } = await connection.getLatestBlockhash();

            // Create the transaction
            const transaction = new Transaction({
                recentBlockhash: blockhash,
                feePayer: fromPubkey,
            }).add(
                SystemProgram.transfer({
                    fromPubkey,
                    toPubkey,
                    lamports,
                })
            );

            // Sign the transaction
            transaction.sign({
                publicKey: fromPubkey,
                secretKey: keypair.secretKey
            });

            // Send the transaction
            const signature = await connection.sendRawTransaction(transaction.serialize(), {
                skipPreflight: false,
                preflightCommitment: 'confirmed',
            });

            console.log(`Transaction confirmed with signature: ${signature}`);
            alert(`Transaction sent! Signature: ${signature}`);

            // Update the balance after sending SOL
            await updateBalance(index);
            await updateBalance(addresses.indexOf(recipientAddress)); // Update recipient balance if it's one of the wallets
        } catch (error) {
            console.error('Error sending SOL:', error);
            alert('Failed to send SOL. Please check the console for more details.');
        }
    };

    return (
        <div>
            <div className="flex justify-center">
                <button
                    className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
                    onClick={addWallet}
                >
                    Add Solana wallet
                </button>
            </div>

            <section className="text-gray-600 body-font">
                <div className="container px-5 py-10 mx-auto">
                    <div className="flex flex-wrap -m-2">
                        {addresses.map((address, index) => (
                            <div key={index} className="p-2 w-full md:w-1/2 lg:w-1/3 relative">
                                <div className="h-full flex items-center border-gray-200 border p-4 rounded-lg cursor-pointer" onClick={() => handleWalletClick(index)}>
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
                                    <div className="absolute top-0 left-0 transform -translate-y-full bg-white rounded-lg shadow-lg p-4 w-full z-20 overflow-y-auto" style={{ maxHeight: '400px' }}>
                                        <h2 className="text-gray-900 text-lg mb-1 font-medium title-font">
                                            Wallet {index + 1}
                                        </h2>
                                        <p className="leading-relaxed mb-3 text-gray-600">
                                            Public Address: {address}
                                        </p>
                                        <p className="leading-relaxed mb-3 text-gray-600">
                                            Balance: {balances[index]} SOL
                                        </p>
                                        <button className="text-white bg-indigo-500 border-0 py-2 px-4 focus:outline-none hover:bg-indigo-600 rounded text-lg mb-4" onClick={() => updateBalance(index)}>
                                            Refresh Balance
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
                                            className="text-white bg-indigo-500 border-0 py-2 px-4 focus:outline-none hover:bg-indigo-600 rounded text-lg"
                                            onClick={() => handleSendSol(index)}
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


