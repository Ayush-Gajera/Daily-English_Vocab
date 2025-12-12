const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const Word = require('./models/Word');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI + (process.env.MONGODB_URI.includes('?') ? '&' : '?') + 'retryWrites=true&w=majority';
mongoose.connect(mongoURI, {
  dbName: 'englishVocab'
})
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    console.log('📊 Database:', mongoose.connection.db.databaseName);
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Get today's date in YYYY-MM-DD format
function getTodayDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

// Generate words using Gemini API
async function generateDailyWords() {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const prompt = `Generate exactly 10 useful English words for daily casual communication. These should be simple to medium level words that people can use in everyday conversations.

For each word, provide:
1. The word itself
2. Clear meaning/definition
3. Pronunciation in IPA (International Phonetic Alphabet) format
4. 2-3 example sentences showing common usage
5. A brief tip on how this word is useful in effective communication

Format the response as a JSON array with this exact structure:
[
  {
    "word": "word here",
    "meaning": "definition here",
    "pronunciation": "/IPA here/",
    "sentences": ["sentence 1", "sentence 2", "sentence 3"],
    "communicationTip": "tip here"
  }
]

Make sure the words are:
- Practical and commonly used
- Not too basic (avoid words like "hello", "good")
- Not too advanced (avoid rarely used vocabulary)
- Diverse in categories (emotions, actions, descriptions, etc.)
- Different from common beginner vocabulary

Return ONLY the JSON array, no additional text.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // Clean up the response to extract JSON
        text = text.trim();
        // Remove markdown code block if present
        text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');

        const words = JSON.parse(text);

        // Validate we got 10 words
        if (!Array.isArray(words) || words.length !== 10) {
            throw new Error('Generated words are not in the expected format');
        }

        return words;
    } catch (error) {
        console.error('Error generating words:');
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Full error:', JSON.stringify(error, null, 2));
        throw error;
    }
}

// Save daily words to database
async function saveDailyWords(date, words) {
    try {
        const wordDoc = new Word({
            date: date,
            words: words
        });
        await wordDoc.save();
        console.log(`✅ Saved ${words.length} words for ${date}`);
        return wordDoc;
    } catch (error) {
        console.error('Error saving words:', error);
        throw error;
    }
}

// Get or generate today's words
async function getTodayWords() {
    const today = getTodayDate();

    // Check if words already exist for today
    let wordDoc = await Word.findOne({ date: today });

    if (!wordDoc) {
        console.log('🔄 Generating new words for today...');
        const words = await generateDailyWords();
        wordDoc = await saveDailyWords(today, words);
    }

    return wordDoc;
}

// API Routes

// Get today's words
app.get('/api/today-words', async (req, res) => {
    try {
        const wordDoc = await getTodayWords();
        res.json({
            success: true,
            date: wordDoc.date,
            words: wordDoc.words
        });
    } catch (error) {
        console.error('Error fetching today\'s words:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch today\'s words'
        });
    }
});

// Get history of previous days
app.get('/api/history', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 30;
        const history = await Word.find()
            .sort({ date: -1 })
            .limit(limit);

        res.json({
            success: true,
            history: history
        });
    } catch (error) {
        console.error('Error fetching history:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch history'
        });
    }
});

// Manually generate new words (for testing)
app.post('/api/generate-words', async (req, res) => {
    try {
        const today = getTodayDate();

        // Delete existing words for today if any
        await Word.deleteOne({ date: today });

        console.log('🔄 Manually generating new words...');
        const words = await generateDailyWords();
        const wordDoc = await saveDailyWords(today, words);

        res.json({
            success: true,
            message: 'New words generated successfully',
            date: wordDoc.date,
            words: wordDoc.words
        });
    } catch (error) {
        console.error('Error generating words:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate words'
        });
    }
});

// Schedule daily word generation at midnight (00:00)
cron.schedule('0 0 * * *', async () => {
    console.log('🕐 Running scheduled daily word generation...');
    try {
        await getTodayWords();
    } catch (error) {
        console.error('Scheduled word generation failed:', error);
    }
});

// Start server
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 Server is running on http://localhost:${PORT}`);
        console.log('📚 English Vocabulary App is ready!');
    });
}

// Export for Vercel
module.exports = app;
