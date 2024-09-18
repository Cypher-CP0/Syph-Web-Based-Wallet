// src/SeedPhrasePage.jsx
import React, { useEffect, useState } from 'react';
import { db } from './firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const SeedPhrasePage = ({ user }) => {
  const [seedPhrase, setSeedPhrase] = useState("");

  // Fetch seed phrase from Firestore
  useEffect(() => {
    const fetchSeedPhrase = async () => {
      if (user) {
        const docRef = doc(db, "seedPhrases", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSeedPhrase(docSnap.data().seedPhrase);
        }
      }
    };
    fetchSeedPhrase();
  }, [user]);

  const handleCopy = () => {
    navigator.clipboard.writeText(seedPhrase);
    alert("Seed phrase copied to clipboard!");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Seed Phrase</h1>
      <div className="bg-gray-100 p-4 rounded-md shadow-md">
        <p className="text-gray-800 text-lg mb-4">{seedPhrase || "Loading..."}</p>
        <button
          onClick={handleCopy}
          className="bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600"
        >
          Copy Seed Phrase
        </button>
      </div>
    </div>
  );
};

export default SeedPhrasePage;
