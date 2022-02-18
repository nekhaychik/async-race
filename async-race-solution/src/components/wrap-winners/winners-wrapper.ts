import { BaseComponent } from '../base/base-component';
import './winners-wrapper.scss';

export class WinnersWrapper extends BaseComponent {
  constructor() {
    super('div', ['winners-wrapper']);
    this.element.setAttribute('id', 'winners-page');
  }
}
