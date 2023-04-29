let gridSize = "4x4";
let turns = 0;
let firstCard = null;
let secondCard = null;
let isChecking = false;

function createGameBoard(event) {
    if (event) {
        event.preventDefault();
    }
    const gridSize = document.getElementById("grid-size").value;
    const grid = gridSize.split("x");
    const rows = parseInt(grid[0]);
    const cols = parseInt(grid[1]);

    const cardsContainer = document.getElementById("cards");
    cardsContainer.style.setProperty("--rows", rows);
    cardsContainer.style.setProperty("--columns", cols);

    while (cardsContainer.firstChild) {
        cardsContainer.firstChild.remove();
    }

    const numPairs = (rows * cols) / 2;
    const colorStep = 360 / numPairs;

    for (let i = 0; i < numPairs; i++) {
        for (let j = 0; j < 2; j++) {
            const card = document.createElement("div");
            card.className = "card";
            card.dataset.color = `hsl(${i * colorStep}, 100%, 50%)`;

            card.addEventListener("click", handleCardClick);

            const randomIndex = Math.floor(Math.random() * (cardsContainer.childElementCount + 1));
            cardsContainer.insertBefore(card, cardsContainer.children[randomIndex]);
        }
    }
}

function handleCardClick(event) {
    if (isChecking || event.currentTarget.classList.contains("revealed")) return;

    const card = event.currentTarget;
    card.style.backgroundColor = card.dataset.color;
    card.classList.add("revealed");

    if (firstCard === null) {
        firstCard = card;
    } else {
        secondCard = card;
        turns++;
        document.getElementById("turns").innerText = `Turns: ${turns}`;

        if (firstCard.dataset.color === secondCard.dataset.color) {
            firstCard = null;
            secondCard = null;
        } else {
            isChecking = true;
            startCountdown().then(() => {
                firstCard.style.backgroundColor = "gray";
                secondCard.style.backgroundColor = "gray";
                firstCard.classList.remove("revealed");
                secondCard.classList.remove("revealed");
                firstCard = null;
                secondCard = null;
                isChecking = false;
            });
        }
    }
}

function startCountdown() {
    const countdownElem = document.getElementById("countdown");
    return new Promise((resolve) => {
        let counter = 3;
        countdownElem.innerText = counter;
        const countdownInterval = setInterval(() => {
            counter--;
            countdownElem.innerText = counter;
            if (counter === 0) {
                clearInterval(countdownInterval);
                countdownElem.innerText = "";
                resolve();
            }
        }, 1000);
    });
}


document.getElementById("grid-size").addEventListener("change", createGameBoard);
document.getElementById("generate-grid").addEventListener("click", createGameBoard);
document.getElementById("reset-gameboard").addEventListener("click", function () {
    turns = 0;
    document.getElementById("turns").innerText = "Turns: 0";
    createGameBoard();
});

createGameBoard();