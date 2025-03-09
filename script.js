document.addEventListener('DOMContentLoaded', function() {
    // Add event listener for the send button
    document.getElementById('sendbtn').addEventListener('click', sendMessage);
});

function showSection(sectionId) {
    // Hide all sections
    const sections = ['user-info', 'answer-area', 'aboutSection', 'servicesSection', 'schoolsSection', 'developersSection'];
    sections.forEach(id => {
        document.getElementById(id).style.display = 'none';
    });

    // Show the selected section
    document.getElementById(sectionId).style.display = 'block';
}

function showAnswerArea(event) {
    event.preventDefault(); // Prevent form submission
    showSection('answer-area'); // Show the answer area
}

async function sendMessage() {
    const inputField = document.getElementById('input'); // Ensure this ID matches your input field
    const userMessage = inputField.value.trim(); // Trim whitespace

    if (!userMessage) {
        alert("Please enter a message."); // Alert if input is empty
        return; // Exit if there's no message
    }

    // Displaying userMessage in the chatbox
    displayMessage('You: ' + userMessage, 'user');
    inputField.value = ''; // Clear input field

    const sendButton = document.getElementById('sendbtn');
    sendButton.disabled = true; // Disable the button while waiting for response

    // Send message to AI
    const response = await fetchAIResponse(userMessage);
    if (response) { // Only display if we got a valid response
        displayMessage('AI: ' + response, 'ai');
    }

    sendButton.disabled = false; // Re-enable the button
}

function displayMessage(message, sender) {
    const answerArea = document.getElementById('income');
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.classList.add('message', sender === 'user' ? 'outgoing' : 'incoming'); // Add classes for styling
    answerArea.appendChild(messageElement);
    answerArea.scrollTop = answerArea.scrollHeight; // Auto-scroll to the bottom
}

async function fetchAIResponse(userMessage) {
    const apiKey = 'YOUR_API_KEY_HERE'; // Replace with your actual API key
    try {
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + apiKey, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: userMessage
                    }]
                }]
            })
        });

        if (!response.ok) { // Check for a successful response
            console.error(`HTTP error! status: ${response.status}`);
            throw new Error(`Network response was not ok: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();

        // Check if the response has the expected structure
        if (data && data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
            return data.candidates[0].content.parts[0].text;
        } else {
            console.error('Unexpected API response structure:', data);
            return 'Sorry, I received an unexpected response from the AI.';
        }

    } catch (error) {
        console.error('Error fetching AI response:', error);
        return 'Sorry, I could not get a response from AI. Check the console for details.'; // More informative error for the user
    }
}