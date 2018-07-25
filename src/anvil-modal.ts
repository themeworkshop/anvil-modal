class AnvilModal implements AnvilModal {
  id: number;
  root: Element;
  openButton: HTMLButtonElement;
  closeButton: HTMLButtonElement;
  content: HTMLElement;
  modalCreated: boolean;
  overlay: HTMLElement;

  constructor(index: number, element: Element) {
    this.root = element;
    this.id = index;
    this.openButton = this.root.querySelector('[data-modal="open-button"]');
    this.closeButton = this.root.querySelector('[data-modal="close-button"]');
    this.content = this.root.querySelector('[data-modal="content"]');
    this.modalCreated = false;
    this.load();
  }

  load() {
    this.openButton.addEventListener('click', () => this.openModal());
    this.closeButton.addEventListener('click', () => this.closeModal());
  }

  createModal() {
    this.overlay = document.createElement('div');
    this.overlay.setAttribute('id', `modal-overlay-${this.id}`);
    this.overlay.setAttribute('data-modal', 'overlay');
    document.body.appendChild(this.overlay);
    document.body.appendChild(this.content);
    this.content.hidden = false;
    this.modalCreated = true;
  }

  openModal() {
    if (!this.modalCreated) {
      this.createModal();
    } else {
      this.overlay.hidden = false;
    }
  }

  closeModal() {
    this.overlay.hidden = true;
  }
}

export default AnvilModal;
