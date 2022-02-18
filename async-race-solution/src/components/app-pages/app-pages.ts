import { BaseComponent } from '../base/base-component';
import { GarageWrapper } from '../wrap-garage/garage-wrapper';
import { Pagination } from '../pagination/pagination';
import { RenderButtons } from '../render-buttons/render-buttons';
import { listenGarage, renderGarage, updateStageGarage } from '../render-garage/render-garage';
import { listenWinners, renderWinnersTable, updateStageWinners } from '../render-winners/render-winners';
import { WinnersWrapper } from '../wrap-winners/winners-wrapper';

export class AppPages extends BaseComponent {
  private readonly renderButtons: RenderButtons;

  private readonly garage: GarageWrapper;

  private readonly winners: WinnersWrapper;

  private readonly pagination: Pagination;

  constructor() {
    super();
    this.renderButtons = new RenderButtons();
    this.element.appendChild(this.renderButtons.element);
    this.garage = new GarageWrapper();
    this.element.appendChild(this.garage.element);
    this.winners = new WinnersWrapper();
    this.element.appendChild(this.winners.element);
    this.pagination = new Pagination();
    this.element.appendChild(this.pagination.element);
  }

  async addPages(): Promise<void> {
    this.renderButtons.addRenderButtons();
    this.garage.addGarage();
    updateStageGarage();
    renderGarage();
    updateStageWinners();
    renderWinnersTable();
    listenGarage();
    listenWinners();
  }
}
