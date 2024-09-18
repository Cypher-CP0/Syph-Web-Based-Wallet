import { useState, useEffect } from 'react';
import { generateMnemonic } from 'bip39';
import { SolanaWallet } from './Solanawallet';
import { db } from './firebaseConfig'; // Firestore import
import { doc, setDoc, getDoc } from 'firebase/firestore';

const WalletDashboard = ({ user }) => {
  const [mnemonicWords, setMnemonicWords] = useState(Array(12).fill(''));
  const [seedCreated, setSeedCreated] = useState(false);
  const [showSeed, setShowSeed] = useState(false); // State to control seed phrase visibility
  const [loading, setLoading] = useState(true); // Loading state to prevent unnecessary operations during initial fetch

  // Fetch the user's seed phrase from Firestore
  const fetchSeedPhrase = async (userId) => {
    setLoading(true); // Set loading to true while fetching data
    try {
      const docRef = doc(db, 'seedPhrases', userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log('Seed phrase found:', docSnap.data().seedPhrase); // Debugging
        // If the seed phrase exists, set it and mark seedCreated as true
        setMnemonicWords(docSnap.data().seedPhrase.split(' '));
        setSeedCreated(true);
      } else {
        console.log('No seed phrase found for user, prompt to create one.');
      }
    } catch (error) {
      console.error('Error fetching seed phrase:', error);
    } finally {
      setLoading(false); // Set loading to false after fetch, whether success or failure
    }
  };

  useEffect(() => {
    if (user) {
      console.log('Fetching seed phrase for user:', user.uid); // Debugging
      fetchSeedPhrase(user.uid); // Fetch the seed phrase when the user logs in
    } else {
      setLoading(false); // In case there's no user logged in, we stop loading
    }
  }, [user]);

  const handleGenerateMnemonic = async () => {
    if (!seedCreated && !loading) {  // Prevent generating the seed if it already exists or during loading
      const mn = generateMnemonic(); // Generate a new mnemonic
      const words = mn.split(' ');
      setMnemonicWords(words);
      setSeedCreated(true);

      // Store the generated seed phrase in Firestore
      const userDoc = doc(db, 'seedPhrases', user.uid);
      await setDoc(userDoc, { seedPhrase: mn });
      console.log('Seed phrase stored:', mn); // Debugging
    }
  };

  const handleShowSeed = () => {
    setShowSeed(!showSeed); // Toggle seed phrase visibility
  };

  return (
    <div className="container px-5 py-24 mx-auto">
      {/* Dashboard Stats Component */}
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-6 mx-auto">
          <div className="flex flex-wrap -m-4 text-center">
            <div className="p-4 md:w-1/4 sm:w-1/2 w-full">
              <div className="border-2 border-gray-200 px-4 py-6 rounded-lg">
                <p className="leading-relaxed">Portfolio balance</p>
                <h2 className="title-font font-medium text-3xl text-lime-400">$0</h2>
              </div>
            </div>
            <div className="p-4 md:w-1/4 sm:w-1/2 w-full">
              <div className="border-2 border-gray-200 px-4 py-6 rounded-lg">
                <p className="leading-relaxed">Portfolio Status</p>
                <h2 className="title-font font-medium text-3xl text-gray-900">+1.3%</h2>
              </div>
            </div>
            <div className="p-4 md:w-1/4 sm:w-1/2 w-full">
              <div className="border-2 border-gray-200 px-4 py-6 rounded-lg">
                <p className="leading-relaxed">Solana Status</p>
                <h2 className="title-font font-medium text-3xl text-gray-900">+7.4%</h2>
              </div>
            </div>
            <div className="p-4 md:w-1/4 sm:w-1/2 w-full">
              <div className="border-2 border-gray-200 px-4 py-6 rounded-lg">
                <p className="leading-relaxed">Wallets</p>
                <h2 className="title-font font-medium text-3xl text-gray-900">46</h2>
              </div>
            </div>
          </div>
        </div>
      </section>

      {loading ? (
        <div>Loading...</div> // Show a loading state while fetching seed phrase
      ) : !seedCreated ? (
        <div>
          <button
            className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
            onClick={handleGenerateMnemonic}
          >
            Create Seed Phrase
          </button>
        </div>
      ) : (
        <div>
          <h2 className="text-lg font-bold mb-4">Your Wallets</h2>
          <SolanaWallet mnemonic={mnemonicWords.join(' ')} />

          

          {showSeed && (
            <div className="mt-4">
              <h3 className="text-md font-semibold">Your Seed Phrase:</h3>
              <div className="relative flex-grow w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {mnemonicWords.map((word, index) => (
                  <input
                    key={index}
                    type="text"
                    value={word}
                    readOnly
                    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-transparent focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WalletDashboard;
