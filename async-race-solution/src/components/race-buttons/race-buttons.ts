import { createCar } from '../../api';
import { BaseComponent } from '../base/base-component';
import { renderGarage, updateStageGarage } from '../render-garage/render-garage';
import './race-buttons.scss';

export class RaceButtons extends BaseComponent {
  private readonly raceButtons: RaceButtons[] = [];

  public models = ['Tesla', 'Chevrolet', 'Daihatsu', 'BMW', 'Dacia', 'Toyota', 'Ford', 'Nissan', 'Hyundai', 'Peugeot'];

  public names = ['Model S', 'Mustang', 'CLK', '7', 'Camry', 'Combi', '9', 'Corsa', 'DB9', 'Cayene'];

  public lengthOfHexCode = 6;

  constructor() {
    super('div', ['race']);
    this.element.innerHTML = `
      <button class="race__button" id="race">race</button>
      <button class="reset__button" id="reset">reset</button>
      <button class="generate__button" id="generate">generate cars</button>
    `;
  }

  getRandomName: () => string = () => {
    const model = this.models[Math.floor(Math.random() * this.models.length)];
    const name = this.names[Math.floor(Math.random() * this.names.length)];
    return `${model} ${name}`;
  };

  getRandomColor: () => string = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < this.lengthOfHexCode; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  generateRandomCars: (count?: number) => {
    name: string;
    color: string;
  }[] = (count = 100) => new Array(count).fill(1).map(() => ({
    name: this.getRandomName(),
    color: this.getRandomColor(),
  }));

  listenForGenerateCars: () => Promise<void> = async () => {
    const btnGenerateCars = <HTMLButtonElement>document.getElementById('generate');
    btnGenerateCars.addEventListener('click', async () => {
      btnGenerateCars.disabled = true;
      const cars = this.generateRandomCars();
      await Promise.all(cars.map((car) => createCar(car)));
      await updateStageGarage();
      const garage = document.getElementById('garage');
      if (garage !== null) {
        garage.remove();
        renderGarage();
      }
      btnGenerateCars.disabled = false;
    });
  };

  async addRaceButtons(): Promise<void> {
    this.raceButtons.forEach((button) => this.element.appendChild(button.element));
    this.listenForGenerateCars();
  }
}
