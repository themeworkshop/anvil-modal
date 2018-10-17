interface WidthQuery {
  min: number | null | undefined;
  max: number | null | undefined;
}
interface ComponentConfig {
  index: number;
  element: Element;
  options?: {
    buttonMode?: string;
    activeWidths?: WidthQuery[];
  };
}

class AnvilModal {
  id: number;
  closeButton: HTMLButtonElement;
  controlButton: HTMLButtonElement;
  dialog: HTMLElement;
  dialogTitle: HTMLElement;
  dialogContainer: HTMLElement;
  modalCreated: boolean;
  modalOpen: boolean;
  defaultHidden: boolean;
  overlay: HTMLElement;
  interactiveElements: HTMLElement[];
  buttonMode: string;
  activeWidths: WidthQuery[];

  constructor(config: ComponentConfig) {
    this.id = config.index;
    if (config.options) {
      this.buttonMode = config.options.buttonMode || 'open';
      this.activeWidths = config.options.activeWidths;
    }
    this.controlButton = config.element as HTMLButtonElement;
    const dialogId = this.controlButton.getAttribute('aria-controls');
    this.dialog = document.getElementById(dialogId);
    this.defaultHidden = this.dialog.hidden;
    this.dialogTitle = this.dialog.querySelector('[data-modal="title"]');
    this.closeButton = this.dialog.querySelector('[data-modal="close-button"]');
    this.modalCreated = false;
    // Wrap dialog in a container
    // NOTE: (insertAdjacentElement doesn't work with jsdom yet)
    const containerId = `modal-container-${this.id}`;
    this.dialog.insertAdjacentHTML(
      'afterend',
      `<div id="${containerId}"></div>`
    );
    this.dialogContainer = document.getElementById(containerId);
    this.dialogContainer.appendChild(this.dialog);
    // Bind the various events
    this.bindEvents();
  }

  tabListener = (event: KeyboardEvent) => this.handleTabbing(event);

  bindEvents() {
    if (this.buttonMode === 'toggle') {
      this.controlButton.addEventListener('click', () => this.toggleModal());
    } else {
      this.controlButton.addEventListener('click', () => this.openModal());
      this.closeButton.addEventListener('click', () => this.closeModal());
    }

    this.dialog.addEventListener('keydown', event =>
      this.handleEscape(event as KeyboardEvent)
    );

    // If active width ranges are provided then set up the resize event handler
    if (this.activeWidths) {
      window.addEventListener('resize', () => {
        this.handleResize();
      });
    }
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
    // Get all interactive elements
    this.interactiveElements = [].slice.call(
      this.dialog.querySelectorAll(
        'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]'
      )
    );
    // Add the toggle button (toggle mode)
    if (this.buttonMode === 'toggle') {
      this.interactiveElements.unshift(this.controlButton);
    }
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
    // Set keyboard trap listeners
    const thisClass = this;
    this.interactiveElements.forEach(el =>
      el.addEventListener('keydown', this.tabListener)
    );
    this.dialog.setAttribute('role', 'dialog');
    this.dialogTitle.tabIndex = 0;
    this.dialogTitle.focus();
    this.dialogTitle.tabIndex = -1;
    document.body.classList.add('modal-open');
    this.modalOpen = true;
  }

  closeModal() {
    if (this.overlay) {
      this.overlay.hidden = true;
    }
    // Remove keyboard trap
    this.interactiveElements.forEach(el =>
      el.removeEventListener('keydown', this.tabListener)
    );
    this.controlButton.focus();
    this.dialog.removeAttribute('role');
    document.body.classList.remove('modal-open');
    this.modalOpen = false;
  }

  resetModal() {
    this.closeModal();
    if (this.overlay && this.overlay.parentElement) {
      this.overlay.parentElement.removeChild(this.overlay);
    }
    this.dialogContainer.appendChild(this.dialog);
    this.dialog.hidden = this.defaultHidden;
    this.modalCreated = false;
  }

  closeModalViaOverlay(event: MouseEvent) {
    if (event.target !== event.currentTarget) {
      return;
    }

    this.closeModal();
  }

  handleResize() {
    // Get the current window width
    const width = window.innerWidth;

    // Does the width match any configured ranges?
    let rangeMatch = false;
    this.activeWidths.forEach(range => {
      if (
        (!range.min || width > range.min) &&
        (!range.max || width < range.max)
      ) {
        rangeMatch = true;
      }
    });

    // If it does not match then reset the modal
    if (!rangeMatch) {
      this.resetModal();
    }
  }

  handleTabbing(event: KeyboardEvent) {
    // return if not TAB
    if (event.keyCode !== 9) {
      return;
    }

    const currentEl = this.interactiveElements.indexOf(
      event.target as HTMLElement
    );

    if (!event.shiftKey) {
      event.preventDefault();
      if (this.interactiveElements[currentEl + 1]) {
        this.interactiveElements[currentEl + 1].focus();
      } else {
        this.interactiveElements[0].focus();
      }
      return;
    }

    if (event.shiftKey) {
      event.preventDefault();
      if (this.interactiveElements[currentEl - 1]) {
        this.interactiveElements[currentEl - 1].focus();
      } else {
        this.interactiveElements[this.interactiveElements.length - 1].focus();
      }
      return;
    }
  }

  handleEscape(event: KeyboardEvent) {
    // return if not ESC
    if (event.keyCode !== 27) {
      return;
    }

    event.preventDefault();
    this.closeModal();
  }
}

export default AnvilModal;
