import './styles.scss';
import { App } from './app';

window.onload = async () => {
  const appElement = document.getElementById('app');
  if (!appElement) throw Error('App root element not found');
  new App(appElement).start();
};
