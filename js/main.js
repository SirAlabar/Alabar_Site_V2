
import { SwordButtonComponent, createSwordButton } from './components/SwordButtonComponent.js';
import { getSceneManager, initSceneManager } from './manager/SceneManager.js';
import { LoadingManager } from './loading/LoadingManager.js';
import { CloudsManager } from './manager/CloudsManager.js'; 

document.addEventListener('DOMContentLoaded', () => {

	const swordButton = createSwordButton();

	const loadingManager = new LoadingManager();

	loadingManager.start();

	console.log('Application initialization started');
});