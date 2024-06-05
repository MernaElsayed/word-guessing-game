
let originalWord = '';
let shuffledWord = [];
let enteredWord = '';
let score = 0;
let chances = 5;

async function fetchRandomWord() {
    try {
        const response = await fetch('https://random-word-api.herokuapp.com/word');
        const data = await response.json();
        if (data && Array.isArray(data) && data.length > 0) {
            const filteredWords = data.filter(word => word.length >= 2 && word.length <= 8);
            if (filteredWords.length > 0) {
                originalWord = filteredWords[0];
                shuffleWord();
            } else {
                console.error('No words found within the specified range.'); 
                setTimeout(fetchRandomWord, 400);
            }
        }
    } catch (error) {
        console.error('Error fetching random word:', error);
    }
}

function shuffleWord() {
    const letters = originalWord.split('');
    shuffledWord = letters.sort(() => Math.random() - 0.5);
    displayShuffledWord();
}

function displayShuffledWord() {
    const gridContainer = document.getElementById('gridContainer');
    gridContainer.innerHTML = '';
    shuffledWord.forEach(letter => {
        const gridItem = document.createElement('div');
        gridItem.classList.add('grid-item');
        gridItem.textContent = letter;
        gridItem.addEventListener('click', () => {
            enteredWord += letter;
            document.getElementById('enteredWord').textContent = enteredWord;
        });
        gridContainer.appendChild(gridItem);
    });
}

function showAlert(message) {
    const alertBox = document.createElement('div');
    alertBox.classList.add('alert-box');
    alertBox.textContent = message;

    const base = document.getElementById('base');
    base.appendChild(alertBox);

    setTimeout(() => {
        alertBox.remove();
    }, 2000); 
}

function checkWord() {
    if (enteredWord === originalWord) {
        score++;
        document.getElementById('score').textContent = 'Score: ' + score;
        enteredWord = '';
        fetchRandomWord();
    } else {
        chances--;
        document.getElementById('chances').textContent = 'Chances: ' + chances;
        if (chances === 0) {
            showAlert('Game over!');
            score = 0;
            document.getElementById('score').textContent = 'Score: ' + score;
            chances = 5;
            document.getElementById('chances').textContent = 'Chances: ' + chances;
            fetchRandomWord();
        } else {
            showAlert('Invalid word, please try again.');
            enteredWord = '';
            document.getElementById('enteredWord').textContent = enteredWord;
        }
    }
}

function solveWord() {
    const solvedWord = dfs(originalWord, shuffledWord.join(''));
    if (solvedWord) {
        showAlert('Solved word: ' + solvedWord);
    } else {
        showAlert('No valid words found');
    }
}

function dfs(originalWord, shuffledWord, visited = new Set()) {
    if (shuffledWord.length === 0) return '';
    for (let i = 0; i < shuffledWord.length; i++) {
        const nextLetter = shuffledWord[i];
        const newShuffledWord = shuffledWord.slice(0, i) + shuffledWord.slice(i + 1);
        const newWord = originalWord.slice(0, originalWord.length - newShuffledWord.length) + nextLetter;
        if (!visited.has(newShuffledWord)) {
            visited.add(newShuffledWord);
            if (newWord === originalWord) return newWord;
            const foundWord = dfs(originalWord, newShuffledWord, visited);
            if (foundWord) return foundWord;
            visited.delete(newShuffledWord);
        }
    }
    return '';
}

fetchRandomWord();
