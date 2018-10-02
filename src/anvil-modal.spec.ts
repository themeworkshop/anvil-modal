import Anvil from '@themeworkshop/anvil';
import AnvilModal from './anvil-modal';

// NOTE: the modal-container-0 div should be inserted by the script.
const standardHTML = `
<body>
  <button id="open-button" data-component="modal" aria-controls="modal-content">Open</button>
  <div id="modal-content" data-modal="dialog" aria-labelledby="modal-title">
    <h1 id="modal-title" data-modal="title">This is a modal window</h1>
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam
      ipsa ducimus a molestias cum, harum veritatis ea illum debitis
      aliquid obcaecati eligendi voluptates distinctio ratione delectus,
      iste voluptate, eos odit.</p>
      <input id="text-field" type="text" name="name" />
      <input id="email-field" type="email" name="email" />
      <button id="close-button" data-modal="close-button" data-controls="modal-content">Close</button>
  </div>
</body>
`;

const toggleHTML = `
<body>
  <button id="toggle-button" data-component="modal" aria-controls="modal-content">Open</button>
  <div role="dialog" id="modal-content" data-modal="dialog" aria-labelledby="modal-title">
    <h1 id="modal-title" data-modal="title">This is a modal window</h1>
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam
      ipsa ducimus a molestias cum, harum veritatis ea illum debitis
      aliquid obcaecati eligendi voluptates distinctio ratione delectus,
      iste voluptate, eos odit.</p>
      <input id="text-field" type="text" name="name" />
      <input id="email-field" type="email" name="email" />
      <button id="close-button" data-modal="close-button" data-controls="modal-content">Close</button>
  </div>
</body>
`;

describe('AnvilModal', () => {
  it('loads correctly', () => {
    const anvil = new Anvil();
    expect(anvil).toHaveProperty('components');
  });

  describe('When the button mode is default', () => {
    beforeEach(() => {
      document.write(standardHTML);
    });

    it('opens when the open button is clicked', () => {
      const anvil = new Anvil();
      anvil.register({
        selector: 'modal',
        constructor: AnvilModal
      });

      const openButton = document.getElementById('open-button');
      const dialog: HTMLElement = document.querySelector(
        '[data-modal="dialog"]'
      );

      openButton.click();

      expect(dialog.hidden).toBe(false);
    });

    it('closes when the close button is clicked', () => {
      const anvil = new Anvil();
      anvil.register({
        selector: 'modal',
        constructor: AnvilModal
      });

      const openButton = document.getElementById('open-button');
      const closeButton = document.getElementById('close-button');
      openButton.click();
      closeButton.click();

      const overlay: HTMLElement = document.querySelector(
        '[data-modal="overlay"]'
      );

      expect(overlay.hidden).toBe(true);
    });

    it('opens when it has been closed and is re-opened', () => {
      const anvil = new Anvil();
      anvil.register({
        selector: 'modal',
        constructor: AnvilModal
      });

      const openButton = document.getElementById('open-button');
      const closeButton = document.getElementById('close-button');

      openButton.click();
      closeButton.click();
      openButton.click();

      const overlay: HTMLElement = document.querySelector(
        '[data-modal="overlay"]'
      );

      expect(overlay.hidden).toBe(false);
    });

    it('puts the title in focus when opened', () => {
      const anvil = new Anvil();
      anvil.register({
        selector: 'modal',
        constructor: AnvilModal
      });

      const title = document.querySelector('[data-modal="title"]');
      const openButton = document.getElementById('open-button');
      openButton.click();
      expect(document.activeElement).toBe(title);
    });

    it('puts the open button back in focus when the modal closes', () => {
      const anvil = new Anvil();
      anvil.register({
        selector: 'modal',
        constructor: AnvilModal
      });

      const openButton = document.getElementById('open-button');
      openButton.click();
      document.getElementById('close-button').click();
      expect(document.activeElement).toBe(openButton);
    });

    it('handles tab key events', () => {
      const anvil = new Anvil();
      const modal = new AnvilModal({
        index: 0,
        element: document.querySelector('[data-component="modal"]')
      });
      anvil.register({ selector: 'modal', constructor: AnvilModal });

      const tabHandler = jest.spyOn(modal, 'handleTabbing');
      const openButton = document.getElementById('open-button');
      const closeButton = document.getElementById('close-button');

      // open the modal
      openButton.click();
      closeButton.focus();

      // keyboard event
      const kbEvent = new KeyboardEvent('keydown', { code: '9' });
      closeButton.dispatchEvent(kbEvent);
      expect(tabHandler).toBeCalled();
    });

    it('handles esc key events', () => {
      const anvil = new Anvil();
      const modal = new AnvilModal({
        index: 0,
        element: document.querySelector('[data-component="modal"]')
      });
      anvil.register({ selector: 'modal', constructor: AnvilModal });

      const escHandler = jest.spyOn(modal, 'handleEscape');
      const openButton = document.getElementById('open-button');
      const dialog: HTMLElement = document.querySelector(
        '[data-modal="dialog"]'
      );

      // open the modal
      openButton.click();
      dialog.focus();

      // keyboard event
      const kbEvent = new KeyboardEvent('keydown', { code: '27' });
      dialog.dispatchEvent(kbEvent);
      expect(escHandler).toBeCalled();
    });
    // TODO: Add more tests to cover events that are difficult to simulate
  });

  describe('When the button mode is toggle', () => {
    beforeEach(() => {
      document.write(toggleHTML);
    });

    it('the toggle button will open the modal', () => {
      const anvil = new Anvil();
      anvil.register({
        selector: 'modal',
        constructor: AnvilModal,
        options: {
          buttonMode: 'toggle'
        }
      });

      const toggleButton = document.getElementById('toggle-button');
      const dialog: HTMLElement = document.querySelector(
        '[data-modal="dialog"]'
      );

      toggleButton.click();

      expect(dialog.hidden).toBe(false);
    });

    it('the toggle button will open and close the modal', () => {
      const anvil = new Anvil();
      anvil.register({
        selector: 'modal',
        constructor: AnvilModal,
        options: {
          buttonMode: 'toggle'
        }
      });

      const toggleButton = document.getElementById('toggle-button');
      toggleButton.click();

      const overlay: HTMLElement = document.querySelector(
        '[data-modal="overlay"]'
      );
      toggleButton.click();
      expect(overlay.hidden).toBe(true);
    });
  });
});
