import { createCar } from '../../api';
import { BaseComponent } from '../base/base-component';
import { renderGarage, updateStageGarage } from '../render-garage/render-garage';
import './update-create.scss';

export class CreateCar extends BaseComponent {
  private readonly createCarForm: CreateCar[] = [];

  constructor() {
    super('form', ['create-car__form']);
    this.element.setAttribute('id', 'create');
    this.element.innerHTML = `
      <input type="text" id="create-name" name="car" class="input">
      <input type="color" id="create-color" name="color" class="color" value="#ffffff">
      <button type="submit" class="create__button">create</button>
    `;
  }

  listen: () => Promise<void> = async () => {
    const carName = <HTMLInputElement>document.getElementById('create-name');
    const carColor = <HTMLInputElement>document.getElementById('create-color');

    const btnCreate = <HTMLButtonElement>document.getElementById('create');
    btnCreate.addEventListener('submit', async (event) => {
      event.preventDefault();
      const car = { name: carName.value, color: carColor.value };
      await createCar(car);
      await updateStageGarage();
      const garage = document.getElementById('garage');
      if (garage !== null) {
        garage.remove();
        renderGarage();
      }
      this.clearCreateFields(carName, carColor);
    });
  };

  clearCreateFields: (name: HTMLInputElement, color: HTMLInputElement) =>
  Promise<void> = async (name: HTMLInputElement, color: HTMLInputElement) => {
    name.value = '';
    color.value = '#ffffff';
  };

  async addCreateCarForm(): Promise<void> {
    this.createCarForm.forEach((form) => this.element.appendChild(form.element));
    this.listen();
  }
}
