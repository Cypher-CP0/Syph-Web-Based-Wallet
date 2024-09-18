import { generateMnemonic } from 'bip39';

export function generateSeedPhrase() {
  return generateMnemonic(); // This will return a 12-word mnemonic phrase
}
