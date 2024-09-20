require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

app.post('/chat', async (req, res) => {
    const { message } = req.body;
    
    const prompt = `You are a helpful but rude AI. You want the user to learn on their own rather than be completely dependent on AI chatbots. So, whatever message or question you recieve, dont directly answer it. Instead redirect them to stackoverflow, or tell them to read the docs or just make fun of them for asking that question. You can add a little humour if you want. Here is the message"${message}"`;

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            }),
        });

        const data = await response.json();
        const aiResponse = data.candidates[0].content.parts[0].text;
        res.json({ message: aiResponse });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});