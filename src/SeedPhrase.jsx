import { useEffect } from 'react';
import { generateMnemonic } from 'bip39'; // Assuming you're using bip39
import { setDoc, doc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { useNavigate } from 'react-router-dom';

function SeedPhrase({ user, setMnemonicWords, setSeedCreated, seedCreated }) {
  const navigate = useNavigate();

  useEffect(() => {
    const generateAndSaveMnemonic = async () => {
      if (user && !seedCreated) {
        const seedPhrase = generateMnemonic();
        const words = seedPhrase.split(' ');

        setMnemonicWords(words);
        setSeedCreated(true);

        await setDoc(doc(db, 'users', user.uid), {
          seedPhrase: seedPhrase,
        });

        navigate('/');
      }
    };

    generateAndSaveMnemonic();
  }, [user, setMnemonicWords, setSeedCreated, seedCreated, navigate]);

  return <div>Generating your seed phrase...</div>;
}

export default SeedPhrase;
