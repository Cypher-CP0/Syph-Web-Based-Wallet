import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

const ALCHEMY_API_KEY = 'JFIoxG02_gV_2Ofz5VXDyNjqSuy2JVTB';

// Enable CORS for all routes
app.use(cors({
    origin: 'http://localhost:5173', // Make sure this matches your frontend's origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));


// Middleware to parse JSON bodies
app.use(express.json());

// Route to handle Ethereum balance requests
app.post('/api/get-eth-balance', async (req, res) => {
    const { address } = req.body;
    console.log('Received ETH address:', address);

    const url = `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;
    const requestBody = {
        jsonrpc: "2.0",
        id: 1,
        method: "eth_getBalance",
        params: [address, "latest"],
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        const data = await response.json();
        console.log('Alchemy API Response for ETH:', data);

        if (data.error) {
            return res.status(500).json({ error: data.error.message });
        }

        const weiBalance = BigInt(data.result);
        const balanceInEth = (weiBalance / BigInt(1e18)).toString();

        res.json({ balance: balanceInEth });
    } catch (error) {
        console.error('Error fetching ETH balance:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Route to handle Solana balance requests
app.post('/api/get-balance', async (req, res) => {
    const { publicKey } = req.body;
    console.log('Received Solana publicKey:', publicKey);

    const url = `https://solana-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;
    const requestBody = {
        jsonrpc: "2.0",
        id: 1,
        method: "getBalance",
        params: [publicKey],
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        const data = await response.json();
        console.log('Alchemy API Response for Solana:', data);

        if (data.error) {
            return res.status(500).json({ error: data.error.message });
        }

        const balance = data.result.value / Math.pow(10, 9); // Convert lamports to SOL

        res.json({ balance });
    } catch (error) {
        console.error('Error fetching Solana balance:', error.message);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
