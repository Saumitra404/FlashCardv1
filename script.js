document.addEventListener("DOMContentLoaded", () => {
    const learnSection = document.getElementById("learn");
    const practiceSection = document.getElementById("practice");
    const flashcardsSection = document.getElementById("flashcards");

    // Fetch flashcard sets
    if (document.getElementById("sets-list")) {
        fetch('https://raw.githubusercontent.com/Saumitra404/FlashCardv1/main/flashcards.json')
            .then(response => response.json())
            .then(data => {
                const setsList = document.getElementById("sets-list");
                Object.keys(data).forEach(set => {
                    const listItem = document.createElement('li');
                    const link = document.createElement('a');
                    link.href = `sets.html?set=${set}`;
                    link.textContent = set;
                    listItem.appendChild(link);
                    setsList.appendChild(listItem);
                });
            })
            .catch(error => console.error("Error loading flashcard sets:", error));
    }

    // Learn mode
    document.getElementById("start-learn")?.addEventListener("click", () => {
        flashcardsSection.style.display = "none";
        learnSection.style.display = "block";
        fetchAndRenderFlashcards("learn");
    });

    // Practice mode
    document.getElementById("start-practice")?.addEventListener("click", () => {
        flashcardsSection.style.display = "none";
        practiceSection.style.display = "block";
        fetchAndRenderFlashcards("practice");
    });

    // Return to Set
    document.getElementById("return-learn")?.addEventListener("click", () => {
        flashcardsSection.style.display = "block";
        learnSection.style.display = "none";
        practiceSection.style.display = "none";
    });

    document.getElementById("return-practice")?.addEventListener("click", () => {
        flashcardsSection.style.display = "block";
        learnSection.style.display = "none";
        practiceSection.style.display = "none";
    });

});

async function fetchAndRenderFlashcards(mode) {
    const params = new URLSearchParams(window.location.search);
    const setName = params.get("set");
    if (!setName) {
        console.error("No set selected!");
        return;
    }

    try {
        const response = await fetch('https://raw.githubusercontent.com/Saumitra404/FlashCardv1/main/flashcards.json');
        const data = await response.json();
        const flashcards = data[setName];

        let index = 0;

        function render() {
            const questionElement = document.getElementById(mode === "learn" ? "question-learn" : "question-practice");
            const answerElement = document.getElementById(mode === "learn" ? "answer-learn" : "answer-practice");

            // Update question text
            questionElement.textContent = flashcards[index].question;

            // Update answer content
            answerElement.innerHTML = `<img src="${flashcards[index].answerImage}" alt="Answer Image" style="max-width: 100%; height: auto;">`;

            // In practice mode, hide the answer initially
            if (mode === "practice") {
                answerElement.style.visibility = "hidden";
            }
        }

        render();

        // Add event listeners for navigation
        document.getElementById(mode === "learn" ? "next-learn" : "next-practice").addEventListener("click", () => {
            index = (index + 1) % flashcards.length;
            render();
        });

        document.getElementById(mode === "learn" ? "back-learn" : "back-practice").addEventListener("click", () => {
            index = (index - 1 + flashcards.length) % flashcards.length;
            render();
        });

        // Add event listener for revealing the answer in practice mode
        if (mode === "practice") {
            const revealButton = document.getElementById("reveal-answer");
            const answerElement = document.getElementById("answer-practice");
            revealButton.addEventListener("click", () => {
                answerElement.style.visibility = "visible";
            });
        }
    } catch (error) {
        console.error("Error fetching flashcards:", error);
    }
}


