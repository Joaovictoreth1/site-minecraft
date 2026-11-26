import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-600.css';
import '@fontsource/inter/latin-800.css';
import '@fontsource/inter/latin-900.css';
import '@fontsource/press-start-2p/latin-400.css';
import './game.css';
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
} catch (error) {
  console.error('Behemoth Engine:', error);
  document.querySelector('.loader-bar-container').hidden = true;
  document.getElementById('loader-text').hidden = true;
  document.getElementById('startup-error').hidden = false;
  document.getElementById('startup-error-heading').focus();
}
