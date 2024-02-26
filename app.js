const express = require('express');
const mongoose = require('mongoose');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
const FormDataModel = require('./models/FormData');


dotenv.config();
const apiKey = process.env.API_KEY;

const genAI = new GoogleGenerativeAI(apiKey);
const app = express();

app.use(express.json());
app.use(express.static('public'));

// MongoDB connection
mongoose.connect('mongodb+srv://surajgojanur:jHoyOKLj80kXKwix@cluster0.9lydbqs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('Error connecting to MongoDB Atlas:', err));


// Generate Text route
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
// Registration route
app.post('/registration', async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await FormDataModel.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const newUser = new FormDataModel({ email, password });
        await newUser.save();

        // Send a JSON response indicating success
        res.status(200).json({ message: "Registration successful" });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: "Internal server error" });
    }
});


// Login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await FormDataModel.findOne({ email });

        if (!user || user.password !== password) {
            return res.status(401).json({ message: "Incorrect email or password" });
        }

        // Login successful, send a success message
        res.status(200).json("Success");
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
