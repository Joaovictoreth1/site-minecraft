import { formatGameError } from './startup.js';

window.onerror = function (message, source, line) {
  const log = document.getElementById('error-log');
  log.hidden = false;
  log.textContent += formatGameError(message, line);
};

try {
  const { GameEngine } = await import('./game.js');
  const game = new GameEngine();
  await game.initWorld();
  window.App = game;
} catch (error) {
  console.error('Behemoth Engine:', error);
  document.querySelector('.loader-bar-container').hidden = true;
  document.getElementById('loader-text').hidden = true;
  document.getElementById('startup-error').hidden = false;
  document.getElementById('startup-error-heading').focus();
}
