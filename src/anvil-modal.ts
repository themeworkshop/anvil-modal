class AnvilModal implements AnvilModal {
  id: number;
  root: Element;
  button: Element;
  content: Element;

  constructor(index: number, element: Element) {
    this.root = element;
    this.id = index;
    this.button = this.root.querySelector('[data-modal="button"]');
    this.content = this.root.querySelector('[data-modal="content"]');
    this.load();
  }

  load() {
    this.button.addEventListener('click', () => this.open());
  }

  open() {
    this.button.classList.add('open-test');
  }
}

export default AnvilModal;
