// API Base URL
const API_URL = window.location.origin;

// DOM Elements
const currentDateEl = document.getElementById('currentDate');
const wordsGrid = document.getElementById('wordsGrid');
const loadingState = document.getElementById('loadingState');
const errorState = document.getElementById('errorState');
const errorMessage = document.getElementById('errorMessage');
const refreshBtn = document.getElementById('refreshBtn');
const historyBtn = document.getElementById('historyBtn');
const historyModal = document.getElementById('historyModal');
const closeModal = document.getElementById('closeModal');
const historyContent = document.getElementById('historyContent');
const totalDaysEl = document.getElementById('totalDays');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    displayCurrentDate();
    loadTodayWords();
    setupEventListeners();
});

// Display current date
function displayCurrentDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date();
    currentDateEl.textContent = today.toLocaleDateString('en-US', options);
}

// Setup event listeners
function setupEventListeners() {
    refreshBtn.addEventListener('click', handleRefresh);
    historyBtn.addEventListener('click', showHistory);
    closeModal.addEventListener('click', hideHistory);
    
    // Close modal on outside click
    historyModal.addEventListener('click', (e) => {
        if (e.target === historyModal) {
            hideHistory();
        }
    });
    
    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && historyModal.classList.contains('active')) {
            hideHistory();
        }
    });
}

// Load today's words
async function loadTodayWords() {
    try {
        showLoading();
        hideError();
        
        const response = await fetch(`${API_URL}/api/today-words`);
        const data = await response.json();
        
        if (data.success) {
            displayWords(data.words);
            loadHistoryCount();
        } else {
            showError(data.error || 'Failed to load words');
        }
    } catch (error) {
        console.error('Error loading words:', error);
        showError('Unable to connect to the server. Please check your internet connection.');
    }
}

// Display words in grid
function displayWords(words) {
    hideLoading();
    wordsGrid.innerHTML = '';
    
    words.forEach((word, index) => {
        const wordCard = createWordCard(word, index + 1);
        wordsGrid.appendChild(wordCard);
    });
    
    // Animate cards
    const cards = document.querySelectorAll('.word-card');
    cards.forEach((card, index) => {
        card.style.animation = `fadeIn 0.6s ease-in ${index * 0.1}s both`;
    });
}

// Create word card element
function createWordCard(word, number) {
    const card = document.createElement('div');
    card.className = 'word-card';
    
    card.innerHTML = `
        <div class="word-header">
            <div>
                <h3 class="word-title">${word.word}</h3>
                <p class="word-pronunciation">${word.pronunciation}</p>
            </div>
            <div class="word-number">${number}</div>
        </div>
        
        <div class="word-meaning">${word.meaning}</div>
        
        <div class="word-section-title">Examples</div>
        <ul class="word-sentences">
            ${word.sentences.map(sentence => `<li>${sentence}</li>`).join('')}
        </ul>
        
        <div class="word-section-title">💡 Communication Tip</div>
        <div class="word-tip">${word.communicationTip}</div>
    `;
    
    return card;
}

// Handle refresh button
async function handleRefresh() {
    const confirmed = confirm('This will generate new words for today. Are you sure?');
    if (!confirmed) return;
    
    try {
        refreshBtn.disabled = true;
        refreshBtn.innerHTML = '<span class="btn-icon">⏳</span> Generating...';
        
        const response = await fetch(`${API_URL}/api/generate-words`, {
            method: 'POST'
        });
        const data = await response.json();
        
        if (data.success) {
            displayWords(data.words);
            showNotification('New words generated successfully! 🎉');
        } else {
            showError(data.error || 'Failed to generate new words');
        }
    } catch (error) {
        console.error('Error generating words:', error);
        showError('Unable to generate new words. Please try again.');
    } finally {
        refreshBtn.disabled = false;
        refreshBtn.innerHTML = '<span class="btn-icon">🔄</span> Refresh Words';
    }
}

// Show history modal
async function showHistory() {
    historyModal.classList.add('active');
    historyContent.innerHTML = '<div class="loading-container"><div class="loader"></div></div>';
    
    try {
        const response = await fetch(`${API_URL}/api/history`);
        const data = await response.json();
        
        if (data.success && data.history.length > 0) {
            displayHistory(data.history);
        } else {
            historyContent.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No history available yet.</p>';
        }
    } catch (error) {
        console.error('Error loading history:', error);
        historyContent.innerHTML = '<p style="text-align: center; color: var(--error);">Failed to load history.</p>';
    }
}

// Display history
function displayHistory(history) {
    historyContent.innerHTML = '';
    
    history.forEach(day => {
        const dayEl = document.createElement('div');
        dayEl.className = 'history-day';
        
        const formattedDate = new Date(day.date).toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        dayEl.innerHTML = `
            <div class="history-date">📅 ${formattedDate}</div>
            <div class="history-words">
                ${day.words.map(w => `<span class="history-word">${w.word}</span>`).join('')}
            </div>
        `;
        
        historyContent.appendChild(dayEl);
    });
}

// Hide history modal
function hideHistory() {
    historyModal.classList.remove('active');
}

// Load history count
async function loadHistoryCount() {
    try {
        const response = await fetch(`${API_URL}/api/history`);
        const data = await response.json();
        
        if (data.success) {
            totalDaysEl.textContent = data.history.length;
        }
    } catch (error) {
        console.error('Error loading history count:', error);
    }
}

// Show loading state
function showLoading() {
    loadingState.style.display = 'flex';
    wordsGrid.style.display = 'none';
    errorState.style.display = 'none';
}

// Hide loading state
function hideLoading() {
    loadingState.style.display = 'none';
    wordsGrid.style.display = 'grid';
}

// Show error state
function showError(message) {
    errorState.style.display = 'block';
    errorMessage.textContent = message;
    loadingState.style.display = 'none';
    wordsGrid.style.display = 'none';
}

// Hide error state
function hideError() {
    errorState.style.display = 'none';
}

// Show notification (simple alert for now)
function showNotification(message) {
    alert(message);
}
