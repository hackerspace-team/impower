Run spark games in a browser environment.

## Getting Started

```javascript
import { SparkParser, SparkContext } from "spark-engine";

const parser = new SparkParser();
const result = parser.parse(script);
const gameContext = new SparkContext(result);

let prevTime = 0;
let loopRequestId = 0;

/**
 * Execute the game loop
 */
const gameLoop = () => {
  const time = Date.now();
  const delta = (time - prevTime) / 1000; // Get time since last frame
  prevTime = time;
  // Execute game logic
  if (gameContext.update(time, delta)) {
    loopRequestId = window.requestAnimationFrame(gameLoop); // Continue the game loop
  } else {
    window.cancelAnimationFrame(loopRequestId); // Stop the game loop
  }
};

/**
 * Load the game
 */
const loadGame = async () => {
  gameContext.init(); // Initialize game
  await gameContext.start(); // Start game
  loopRequestId = window.requestAnimationFrame(gameLoop); // Start the game loop
};

// Load the game once the window loads
window.onload = loadGame;
```