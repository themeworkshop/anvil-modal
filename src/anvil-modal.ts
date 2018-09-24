export interface ComponentConfig {
  index: number;
  element: Element;
  options?: {
    buttonMode: string;
  };
}

class AnvilModal {
  id: number;
  closeButton: HTMLButtonElement;
  controlButton: HTMLButtonElement;
  dialog: HTMLElement;
  dialogTitle: HTMLElement;
  modalCreated: boolean;
  modalOpen: boolean;
  overlay: HTMLElement;
  interactiveElements: HTMLElement[];
  buttonMode: string;

  constructor(config: ComponentConfig) {
    console.log(config);
    this.id = config.index;
    if (config.options) {
      this.buttonMode = config.options.buttonMode || 'open';
    }
    this.controlButton = config.element as HTMLButtonElement;
    const dialogId = this.controlButton.getAttribute('aria-controls');
    this.dialog = document.getElementById(dialogId);
    this.dialogTitle = this.dialog.querySelector('[data-modal="title"]');
    this.interactiveElements = [].slice.call(
      this.dialog.querySelectorAll(
        'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]'
      )
    );
    this.closeButton = this.dialog.querySelector('[data-modal="close-button"]');
    this.modalCreated = false;
    this.bindEvents();
  }

  bindEvents() {
    if (this.buttonMode === 'toggle') {
      console.log('TOGGLE MODE: AFFIRMATIVE 🤖');
      this.controlButton.addEventListener('click', () => this.toggleModal());
    } else {
      console.log('TOGGLE MODE: NEGATIVE 🤖');
      this.controlButton.addEventListener('click', () => this.openModal());
      this.closeButton.addEventListener('click', () => this.closeModal());
    }

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
    this.modalCreated = true;
  }

  toggleModal() {
    if (this.modalOpen) {
      this.closeModal();
    } else {
      this.openModal();
    }
  }

  openModal() {
    if (!this.modalCreated) {
      this.createModal();
    } else {
      this.overlay.hidden = false;
    }
    this.dialogTitle.tabIndex = 0;
    this.dialogTitle.focus();
    this.dialogTitle.tabIndex = -1;
    document.body.classList.add('modal-open');
    this.modalOpen = true;
  }

  closeModal() {
    this.overlay.hidden = true;
    this.controlButton.focus();
    document.body.classList.remove('modal-open');
    this.modalOpen = false;
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
