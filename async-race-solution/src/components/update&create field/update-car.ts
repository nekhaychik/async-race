import { getCar, updateCar } from '../../api';
import { BaseComponent } from '../base/base-component';
import { renderGarage, updateStageGarage } from '../render-garage/render-garage';
import './update-create.scss';

let selectedCar = null;

export class UpdateCar extends BaseComponent {
  private readonly updateCarForm: UpdateCar[] = [];

  private selectedCarID: number;

  constructor() {
    super('form', ['update-car__form']);
    this.element.setAttribute('id', 'update');
    this.element.innerHTML = `
      <input type="text" id="update-name" name="car" class="input">
      <input type="color" id="update-color" name="color" class="color" value="#ffffff">
      <button type="submit" id="update-button" class="update__button">update</button>
    `;
    this.selectedCarID = Number();
  }

  blockUpdateFields: () => Promise<void> = async () => {
    const updateName = <HTMLInputElement>document.getElementById('update-name');
    const updateColor = <HTMLInputElement>document.getElementById('update-color');
    const btnUpdate = <HTMLButtonElement>document.getElementById('update-button');

    updateName.disabled = true;
    updateColor.disabled = true;
    btnUpdate.disabled = true;
  };

  listen: () => Promise<void> = async () => {
    const updateName = <HTMLInputElement>document.getElementById('update-name');
    const updateColor = <HTMLInputElement>document.getElementById('update-color');
    const btnUpdate = <HTMLButtonElement>document.getElementById('update-button');

    document.body.addEventListener('click', async (event) => {
      if ((<Element>event.target).classList.contains('select-button')) {
        this.selectedCarID = +(<Element>event.target).id.split('select-car-')[1];
        selectedCar = await getCar(this.selectedCarID);
        updateName.value = selectedCar.name;
        updateColor.value = selectedCar.color;
        updateName.disabled = false;
        updateColor.disabled = false;
        btnUpdate.disabled = false;
      }
    });
    this.submitUpdatedCar(updateName, updateColor);
  };

  async submitUpdatedCar(updateName: HTMLInputElement, updateColor: HTMLInputElement): Promise<void> {
    const updateSubmit = <HTMLButtonElement>document.getElementById('update');
    updateSubmit.addEventListener('submit', async (event) => {
      event.preventDefault();
      const car = { name: updateName.value, color: updateColor.value };
      await updateCar(this.selectedCarID, car);
      await updateStageGarage();
      const garage = document.getElementById('garage');
      if (garage !== null) {
        garage.remove();
        renderGarage();
      }
      this.clearUpdateFields(updateName, updateColor);
    });
  }

  clearUpdateFields: (name: HTMLInputElement, color: HTMLInputElement) =>
  Promise<void> = async (name: HTMLInputElement, color: HTMLInputElement) => {
    name.value = '';
    color.value = '#ffffff';
    this.blockUpdateFields();
  };

  async addUpdateCarForm(): Promise<void> {
    this.updateCarForm.forEach((form) => this.element.appendChild(form.element));
    this.blockUpdateFields();
    this.listen();
  }
}
