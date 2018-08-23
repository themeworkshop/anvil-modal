class AnvilModal {
  id: number;
  openButton: HTMLButtonElement;
  closeButton: HTMLButtonElement;
  dialog: HTMLElement;
  dialogTitle: HTMLElement;
  modalOpened: boolean;
  overlay: HTMLElement;
  interactiveElements: HTMLElement[];

  constructor(index: number, element: Element) {
    this.id = index;
    this.openButton = element as HTMLButtonElement;
    const dialogId = this.openButton.getAttribute('aria-controls');
    this.dialog = document.getElementById(dialogId);
    this.dialogTitle = this.dialog.querySelector('[data-modal="title"]');
    this.interactiveElements = [].slice.call(
      this.dialog.querySelectorAll(
        'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]'
      )
    );
    this.closeButton = this.dialog.querySelector('[data-modal="close-button"]');
    this.modalOpened = false;
    this.load();
  }

  load() {
    this.openButton.addEventListener('click', () => this.openModal());
    this.closeButton.addEventListener('click', () => this.closeModal());
    this.dialog.addEventListener('keydown', event =>
      this.handleEscape(event as KeyboardEvent)
    );
    this.interactiveElements.forEach(el =>
      el.addEventListener('keydown', event =>
        this.handleTabbing(event as KeyboardEvent)
      )
    );
  }

  createModal() {
    this.overlay = document.createElement('div');
    this.overlay.setAttribute('id', `modal-overlay-${this.id}`);
    this.overlay.setAttribute('data-modal', 'overlay');
    this.overlay.classList.add('modal-overlay');
    document.body.appendChild(this.overlay);
    this.overlay.appendChild(this.dialog);
    this.overlay.addEventListener('click', event =>
      this.closeModalViaOverlay(event)
    );
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
    document.body.classList.add('modal-open');
  }

  closeModal() {
    this.overlay.hidden = true;
    this.openButton.focus();
    document.body.classList.remove('modal-open');
  }

  closeModalViaOverlay(event: MouseEvent) {
    if (event.target !== event.currentTarget) {
      return;
    }

    this.closeModal();
  }

  handleTabbing(event: KeyboardEvent) {
    if (event.keyCode !== 9) {
      return;
    }

    const currentEl = this.interactiveElements.indexOf(
      event.target as HTMLElement
    );

    if (!event.shiftKey && !this.interactiveElements[currentEl + 1]) {
      event.preventDefault();
      this.interactiveElements[0].focus();
      return;
    }

    if (event.shiftKey && !this.interactiveElements[currentEl - 1]) {
      event.preventDefault();
      this.interactiveElements[this.interactiveElements.length - 1].focus();
      return;
    }
  }

  handleEscape(event: KeyboardEvent) {
    if (event.keyCode !== 27) {
      return;
    }

    event.preventDefault();
    this.closeModal();
  }
}

export default AnvilModal;
