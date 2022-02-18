import { BaseComponent } from '../base/base-component';
import './pagination.scss';

export class Pagination extends BaseComponent {
  public currentPage = 1;

  constructor() {
    super('div', ['pagination']);
    this.element.innerHTML = `
      <div id="garage-pagination">
        <button class="prev-page" id="prev">Prev</button>
        <button class="next-page" id="next">Next</button>
      </div>
      <div id="winners-pagination">
        <button class="prev-page-win" id="prev-win">Prev</button>
        <button class="next-page-win" id="next-win">Next</button>
      </div>
    `;
  }
}
