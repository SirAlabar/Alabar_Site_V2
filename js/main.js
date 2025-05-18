
import { SwordButtonComponent, createSwordButton } from './components/SwordButtonComponent.js';

document.addEventListener('DOMContentLoaded', () => {

  const swordButton = createSwordButton();
  

  window.loadingScreen = new LoadingScreen();
  loadingManager.start();
});