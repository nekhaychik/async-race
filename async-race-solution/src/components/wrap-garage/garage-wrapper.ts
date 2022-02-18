import { BaseComponent } from '../base/base-component';
import { RaceButtons } from '../race-buttons/race-buttons';
import { CreateCar } from '../update&create field/create-car';
import { UpdateCar } from '../update&create field/update-car';

export class GarageWrapper extends BaseComponent {
  private readonly createCarForm: CreateCar;

  private readonly updateCarForm: UpdateCar;

  private readonly raceButtons: RaceButtons;

  constructor() {
    super('div', ['garage-wrapper']);
    this.element.setAttribute('id', 'garage-page');
    this.createCarForm = new CreateCar();
    this.element.appendChild(this.createCarForm.element);
    this.updateCarForm = new UpdateCar();
    this.element.appendChild(this.updateCarForm.element);
    this.raceButtons = new RaceButtons();
    this.element.appendChild(this.raceButtons.element);
  }

  async addGarage(): Promise<void> {
    this.createCarForm.addCreateCarForm();
    this.updateCarForm.addUpdateCarForm();
    this.raceButtons.addRaceButtons();
  }
}
