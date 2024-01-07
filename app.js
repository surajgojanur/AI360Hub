const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");

dotenv.config();
const apiKey = process.env.API_KEY;

const genAI = new GoogleGenerativeAI(apiKey);
const app = express();

app.use(express.json());
app.use(express.static('public'));

app.post('/generateText', async (req, res) => {
    try {
        const input = req.body.input; // Assuming the input comes from the POST request

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContentStream([input]);
        let generatedText = '';

        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            generatedText += chunkText;
        }

        res.send(generatedText); // Send the generated text as the response
    } catch (error) {
        console.error('Error generating text:', error);
        res.status(500).send('Error generating text. Please check the server logs.');
    }
});

app.listen(3000, () => {
    console.log("App listening on port 3000");
});
