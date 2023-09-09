var model = {
    boardSize: 7,
    numShips: 3,
    shipLength: 3,
    shipsSunk: 0,

    fire: function (guess) {
        for (var i = 0; i < this.numShips; i++) {
            var ship = this.ships[i];
            var index = ship.locations.indexOf(guess);

            if (index >= 0) {
                ship.hits[index] = "hit";
                view.displayHit(guess);
                view.displayMessage("HIT!");

                if (this.isSunk(ship)) {
                    view.displayMessage("You sank my battleship!");
                    this.shipsSunk++;
                }
                return true;
            }
        }
        view.displayMiss(guess);
        view.displayMessage("MISSED!");
        return false;
    },

    isSunk: function (ship) {
        for (var i = 0; i < this.shipLength; i++) {
            if (ship.hits[i] !== "hit") {
                return false;
            }
        }
        return true;
    },

    generationShipLocation: function () {
        var locations;
        for (var i = 0; i < this.numShips; i++) {
            do {
                locations = this.generateShip();
            } while (this.collision(locations));
            this.ships[i].locations = locations;
        }
    },

    generateShip: function () {
        var direction = Math.floor(Math.random() * 2);
        var row, col;

        if (direction == 1) {
            //horizontal ship
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(
                Math.random() * (this.boardSize - this.shipLength)
            );
        } else {
            //vertical ship
            row = Math.floor(
                Math.random() * (this.boardSize - this.shipLength)
            );
            col = Math.floor(Math.random() * this.boardSize);
        }

        var newShipLocation = [];
        for (var i = 0; i < this.shipLength; i++) {
            if (direction === 1) {
                //new horizental ship
                newShipLocation.push(row + "" + (col + i));
            } else {
                //new vertical ship
                newShipLocation.push(row + i + "" + col);
            }
        }
        return newShipLocation;
    },

    collision: function (locations) {
        for (var i = 0; i < this.numShips; i++) {
            var ship = model.ships[i];
            for (var j = 0; j < locations.length; j++) {
                if (ship.locations.indexOf(locations[j]) >= 0) {
                    return true;
                }
            }
        }
        return false;
    },

    ships: [
        { locations: ["0", "0", "0"], hits: ["", "", ""] },
        { locations: ["0", "0", "0"], hits: ["", "", ""] },
        { locations: ["0", "0", "0"], hits: ["", "", ""] },
    ],
};

var view = {
    displayMessage: function (msg) {
        var messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = msg;
    },

    displayHit: function (location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "hit");
    },

    displayMiss: function (location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
    },
};

var controller = {
    guesses: 0,
    processGuesses: function (guess) {
        var location = parseGuess(guess);
        if (location) {
            this.guesses++;
            var hit = model.fire(location);
            if (hit && model.shipsSunk === model.numShips) {
                view.displayMessage(
                    "You sank all my battleship, in " +
                        this.guesses +
                        " guesses"
                );
            }
        }
    },
};

function parseGuess(guess) {
    var alphabet = ["A", "B", "C", "D", "E", "F", "G"];

    if (guess == null || guess.length !== 2) {
        alert("Oops, plz enter a letter and a number on the board");
    } else {
        firstChar = guess.charAt(0);
        var row = alphabet.indexOf(firstChar);

        var column = guess.charAt(1);
        if (isNaN(row) || isNaN(column)) {
            alert("Oops, that isn't on the board");
        } else if (
            row < 0 ||
            row >= model.boardSize ||
            column < 0 ||
            column >= model.boardSize
        ) {
            alert("Oops, that's off the board");
        } else return row + column;
    }
    return null;
}

function init() {
    var fireButton = document.getElementById("fireButton");
    fireButton.onclick = handleFireButton;
    var guessInput = document.getElementById("guessInput");
    // guessInput.onkeypress = handleKeyPress;

    model.generationShipLocation();
}
window.onload = init;

function handleKeyPress() {
    var fireButton = document.getElementById("fireButton");
    if (e.keyCode === 13) {
        fireButton.click();
        return false;
    }
}

function handleFireButton() {
    var guessInput = document.getElementById("guessInput");
    var guess = guessInput.value;

    controller.processGuesses(guess);
    guessInput.value = "";
}
