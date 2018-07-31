class AnvilModal {
  id: number;
  openButton: HTMLButtonElement;
  closeButton: HTMLButtonElement;
  dialog: HTMLElement;
  dialogTitle: HTMLElement;
  modalOpened: boolean;
  overlay: HTMLElement;

  constructor(index: number, element: Element) {
    this.id = index;
    this.openButton = element as HTMLButtonElement;
    const dialogId = this.openButton.getAttribute('aria-controls');
    this.dialog = document.getElementById(dialogId);
    this.dialogTitle = this.dialog.querySelector('[data-modal="title"]');
    this.closeButton = this.dialog.querySelector('[data-modal="close-button"]');
    this.modalOpened = false;
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
    document.body.appendChild(this.dialog);
    this.dialog.hidden = false;
    this.modalOpened = true;
  }

  openModal() {
    if (!this.modalOpened) {
      this.createModal();
    } else {
      this.overlay.hidden = false;
    }
    this.dialogTitle.tabIndex = 0;
    this.dialogTitle.focus();
    this.dialogTitle.tabIndex = -1;
  }

  closeModal() {
    this.overlay.hidden = true;
    this.openButton.focus();
  }
}

export default AnvilModal;
