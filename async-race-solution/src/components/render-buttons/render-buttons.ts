import { BaseComponent } from '../base/base-component';
import './render-buttons.scss';

export class RenderButtons extends BaseComponent {
  private renderButtons: RenderButtons[] = [];

  constructor() {
    super('div', ['render']);
    this.element.innerHTML = `
      <button class="render__button" id="btn-garage">to garage</button>
      <button class="render__button"id="btn-winners">to winners</button>
    `;
  }

  listen: () => Promise<void> = async () => {
    const garagePage = <HTMLElement>document.getElementById('garage-page');
    const garagePagination = <HTMLElement>document.getElementById('garage-pagination');
    const winnersPage = <HTMLElement>document.getElementById('winners-page');
    const winnersPagination = <HTMLElement>document.getElementById('winners-pagination');

    const btnWinners = <HTMLButtonElement>document.getElementById('btn-winners');
    btnWinners.addEventListener('click', () => {
      garagePage.style.display = 'none';
      winnersPage.style.display = 'block';
      garagePagination.style.display = 'none';
      winnersPagination.style.display = 'block';
    });

    const btnGarage = <HTMLButtonElement>document.getElementById('btn-garage');
    btnGarage.addEventListener('click', async () => {
      winnersPage.style.display = 'none';
      garagePage.style.display = 'block';
      winnersPagination.style.display = 'none';
      garagePagination.style.display = 'block';
    });
  };

  async addRenderButtons(): Promise<void> {
    this.renderButtons.forEach((button) => this.element.appendChild(button.element));
    this.listen();
  }
}
