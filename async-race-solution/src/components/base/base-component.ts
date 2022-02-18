export class BaseComponent {
  readonly element: HTMLElement;

  constructor(tag: keyof HTMLElementTagNameMap = 'div', className: string[] = ['main']) {
    this.element = document.createElement(tag);
    this.element.classList.add(...className);
  }
}
