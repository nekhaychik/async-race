import { AppPages } from './components/app-pages/app-pages';

export class App {
  private readonly garage: AppPages;

  constructor(private readonly rootElement: HTMLElement) {
    this.garage = new AppPages();
    this.rootElement.appendChild(this.garage.element);
  }

  async start(): Promise<void> {
    this.garage.addPages();
  }
}
