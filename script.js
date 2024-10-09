document.getElementById('startButton').addEventListener('click', function () {
  var email = document.getElementById('email').value;
  // You can add email validation here if needed

  // Hide the homepage and show the game screen
  document.getElementById('homepage').style.display = 'none';
  document.getElementById('game').style.display = 'block';

  // Initialize the game
  startGame();
});

function startGame() {
  var basket = document.getElementById('basket');
  var gameArea = document.getElementById('game-area');
  var basketX = gameArea.offsetWidth / 2 - basket.offsetWidth / 2;

  var score = 0;
  var otherHits = 0;
  var gameOver = false;
  var scoreDisplay = document.getElementById('score');

  // Create an audio element for the catch sound
  var catchSound = new Audio('catch.mp3');

  // Set a 30-second timer to end the game
  setTimeout(function () {
    gameOver = true;
    if (score >= 100) {
      showCongratulations();
    } else {
      showGameOver();
    }
  }, 30000); // 30000 milliseconds = 30 seconds

  document.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowLeft' && basketX > 0) {
      basketX -= 10;
    } else if (event.key === 'ArrowRight' && basketX < gameArea.offsetWidth - basket.offsetWidth) {
      basketX += 10;
    }
    basket.style.left = basketX + 'px';
  });

  function createFallingObject(type) {
    var object = document.createElement('div');
    object.className = type;
    object.style.left = Math.random() * (gameArea.offsetWidth - 20) + 'px';
    gameArea.appendChild(object);

    var objectY = 0;
    var objectSpeed = 5 ;
    var objectInterval = setInterval(function () {
      objectY += objectSpeed;
      object.style.top = objectY + 'px';

      if (
        objectY + object.offsetHeight > basket.offsetTop &&
        objectY < basket.offsetTop + basket.offsetHeight &&
        object.offsetLeft + object.offsetWidth > basket.offsetLeft &&
        object.offsetLeft < basket.offsetLeft + basket.offsetWidth
      ) {
        if (type === 'doughnut') {
          score++;
          scoreDisplay.textContent = "Score: " + score;
          object.classList.add("explode");
          catchSound.play();

          // Corrected win condition check:
          if (score >= 100) {
            gameOver = true;
            showCongratulations();
          }

          setTimeout(function () {
            gameArea.removeChild(object);
          }, 500);
        } else {
          otherHits++;
          gameArea.style.backgroundColor = 'red';
          setTimeout(function () {
            gameArea.style.backgroundColor = '';
          }, 200);
          if (otherHits >= 2) {
            gameOver = true;
            showGameOver();
          }
          clearInterval(objectInterval);
          gameArea.removeChild(object);
        }
      }

      if (objectY > gameArea.offsetHeight) {
        clearInterval(objectInterval);
        gameArea.removeChild(object);
      }
    }, 30);
  }

  setInterval(function () {
    createFallingObject('doughnut');
    if (Math.random() < 0.2) {
      createFallingObject('other');
    }
  }, 1000);

  function showCongratulations() {
    var code = Math.floor(1000000 + Math.random() * 9000000);
    document.getElementById('code').textContent = code;
    document.getElementById('game').style.display = 'none';
    document.getElementById('congratulations').style.display = 'block';
  }

  function showGameOver() {
    document.getElementById('game').style.display = 'none';
    document.getElementById('gameOver').style.display = 'block';

    // Add a "Restart" button to the game over screen
    var restartButton = document.createElement('button');
    restartButton.textContent = "Restart";
    restartButton.addEventListener('click', function () {
      // Reset the game state
      score = 0;
      otherHits = 0;
      gameOver = false;
      scoreDisplay.textContent = "Score: 0";

      // Remove all falling objects
      var gameArea = document.getElementById('game-area');
      while (gameArea.firstChild) {
        gameArea.removeChild(gameArea.firstChild);
      }

      // Hide the game over screen and show the game screen
      document.getElementById('gameOver').style.display = 'none';
      document.getElementById('game').style.display = 'block';
    });
    document.getElementById('gameOver').appendChild(restartButton);
  }
}