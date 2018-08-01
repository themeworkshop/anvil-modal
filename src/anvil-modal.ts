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
    this.closeButton = this.dialog.querySelector('[data-modal="close-button"]');
    this.interactiveElements = [].slice.call(
      this.dialog.querySelectorAll(
        'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]'
      )
    );
    this.modalOpened = false;
    this.load();
  }

  load() {
    this.openButton.addEventListener('click', () => this.openModal());
    this.closeButton.addEventListener('click', () => this.closeModal());
    this.interactiveElements.forEach(el =>
      el.addEventListener('keypress', () =>
        this.handleTabbing(event as KeyboardEvent)
      )
    );
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

  handleTabbing(event: KeyboardEvent) {
    // Exit if it's not a tab
    if (event.keyCode !== 9) {
      return;
    }

    // Get the index of the element that triggered
    const targetIndex = this.interactiveElements.indexOf(
      event.target as HTMLElement
    );
    const nextTarget = this.interactiveElements[targetIndex + 1];
    const prevTarget = this.interactiveElements[targetIndex - 1];

    if (!event.shiftKey && nextTarget) {
      nextTarget.focus();
    }

    if (!event.shiftKey && nextTarget) {
      this.interactiveElements[0].focus();
    }

    if (event.shiftKey && prevTarget) {
      prevTarget.focus();
    }

    if (event.shiftKey && !prevTarget) {
      this.interactiveElements.reverse()[0].focus();
    }
  }
}

export default AnvilModal;
