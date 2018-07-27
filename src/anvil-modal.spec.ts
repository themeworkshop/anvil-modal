import Anvil from '@themeworkshop/anvil';
import AnvilModal from './anvil-modal';

const html = `
<body>
  <button id="modal-button" data-component="modal" aria-controls="modal-content">Open</button>
  <div id="modal-content" hidden data-modal="dialog" aria-labelledby="modal-title">
    <h1 id="modal-title">This is a modal window</h1>
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam
      ipsa ducimus a molestias cum, harum veritatis ea illum debitis
      aliquid obcaecati eligendi voluptates distinctio ratione delectus,
      iste voluptate, eos odit.</p>
      <button data-modal="close-button" data-controls="modal-content">Close</button>
  </div>
</body>
`;

describe('AnvilModal', () => {
  beforeEach(() => {
    document.write(html);
  });

  it('loads correctly', () => {
    const anvil = new Anvil();
    expect(anvil).toHaveProperty('components');
  });

  it('opens when the open button is clicked', () => {
    const anvil = new Anvil();
    anvil.register('modal', AnvilModal);

    const openButton: HTMLButtonElement = document.querySelector(
      '[data-component="modal"]'
    );
    openButton.click();

    const dialog: HTMLElement = document.querySelector('[data-modal="dialog"]');

    const overlay: HTMLElement = document.querySelector(
      '[data-modal="dialog"]'
    );

    expect(dialog.hidden).toBe(false);
    expect(overlay.hidden).toBe(false);
  });

  it('closes when the close button is clicked', () => {
    const anvil = new Anvil();
    anvil.register('modal', AnvilModal);

    const openButton: HTMLButtonElement = document.querySelector(
      '[data-component="modal"]'
    );
    openButton.click();

    const closeButton: HTMLButtonElement = document.querySelector(
      '[data-modal="close-button"]'
    );
    closeButton.click();

    const overlay: HTMLElement = document.querySelector(
      '[data-modal="overlay"]'
    );

    expect(overlay.hidden).toBe(true);
  });

  it('opens when it has been closed and is re-opened', () => {
    const anvil = new Anvil();
    anvil.register('modal', AnvilModal);

    const openButton: HTMLButtonElement = document.querySelector(
      '[data-component="modal"]'
    );
    openButton.click();

    const closeButton: HTMLButtonElement = document.querySelector(
      '[data-modal="close-button"]'
    );

    const overlay: HTMLElement = document.querySelector(
      '[data-modal="overlay"]'
    );

    closeButton.click();
    openButton.click();

    expect(overlay.hidden).toBe(false);
  });
});
