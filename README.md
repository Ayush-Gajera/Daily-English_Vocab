# 📚 VocabDaily - English Vocabulary Enhancement App

A beautiful, mobile-friendly web application that helps you enhance your English vocabulary with 10 new words every day, powered by Google Gemini AI.

## ✨ Features

- 🌟 **Daily Word Generation**: Get 10 carefully selected English words every day
- 📖 **Comprehensive Learning**: Each word includes:
  - Clear meaning and definition
  - Pronunciation in IPA format
  - 2-3 example sentences
  - Communication tips for effective usage
- 📱 **Mobile-Friendly**: Fully responsive design that works on all devices
- 💾 **History Tracking**: All previous days' words are stored in MongoDB
- 🎨 **Modern UI**: Beautiful dark theme with smooth animations
- ⚡ **Auto-Refresh**: New words are automatically generated at midnight

## 🛠️ Tech Stack

- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Backend**: Node.js, Express
- **Database**: MongoDB Atlas (Cloud)
- **AI**: Google Gemini API
- **Scheduling**: node-cron

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB)
- Google Gemini API key

## 🚀 Installation

1. **Clone the repository** (or navigate to the project directory):
   ```bash
   cd DataSlush
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment variables are already configured in `.env`**:
   - MongoDB connection string
   - Gemini API key
   - Server port

4. **Start the server**:
   ```bash
   npm start
   ```

5. **Open your browser and visit**:
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
DataSlush/
├── models/
│   └── Word.js           # MongoDB schema for words
├── public/
│   ├── index.html        # Main HTML file
│   ├── styles.css        # Styling with modern dark theme
│   └── app.js            # Frontend JavaScript
├── server.js             # Express server & API endpoints
├── package.json          # Dependencies
├── .env                  # Environment variables
├── .gitignore           # Git ignore file
└── README.md            # This file
```

## 🔌 API Endpoints

### GET `/api/today-words`
Get today's 10 words (generates new ones if they don't exist)

**Response:**
```json
{
  "success": true,
  "date": "2025-12-12",
  "words": [...]
}
```

### GET `/api/history`
Get previous days' words (last 30 days by default)

**Query Parameters:**
- `limit` (optional): Number of days to retrieve (default: 30)

**Response:**
```json
{
  "success": true,
  "history": [...]
}
```

### POST `/api/generate-words`
Manually generate new words for today (overwrites existing)

**Response:**
```json
{
  "success": true,
  "message": "New words generated successfully",
  "words": [...]
}
```

## 🎯 Usage

1. **Daily Learning**: Visit the app each day to see 10 new words
2. **Review**: Click on each word card to read detailed information
3. **Refresh**: Use the "Refresh Words" button to generate new words manually
4. **History**: Click "View History" to see all previously learned words
5. **Mobile**: Access from your phone for learning on the go!

## 🌙 Features Breakdown

### Word Card Information
Each word card displays:
- **Word**: The vocabulary word
- **Pronunciation**: IPA phonetic transcription
- **Meaning**: Clear, simple definition
- **Examples**: 2-3 real-world usage examples
- **Communication Tip**: How to use it effectively in conversation

### Auto-Refresh System
- Runs daily at midnight (00:00)
- Automatically generates new words
- Stores previous days in database

### Responsive Design
- Mobile-first approach
- Works on phones, tablets, and desktops
- Touch-friendly buttons and cards
- Smooth animations and transitions

## 🔒 Security Notes

- The `.env` file contains sensitive information (API keys, database credentials)
- Never commit `.env` to version control
- For production, use environment variables on your hosting platform

## 🐛 Troubleshooting

### Server won't start
- Check if MongoDB connection string is correct in `.env`
- Verify Gemini API key is valid
- Ensure port 3000 is not already in use

### Words not loading
- Check server console for error messages
- Verify MongoDB Atlas is accessible
- Check internet connection for Gemini API calls

### Mobile display issues
- Clear browser cache
- Ensure you're using a modern browser
- Try different viewport sizes

## 📝 License

ISC

## 👨‍💻 Author

Built with ❤️ for English language learners

## 🙏 Acknowledgments

- Google Gemini AI for word generation
- MongoDB Atlas for cloud database
- All English language learners around the world
