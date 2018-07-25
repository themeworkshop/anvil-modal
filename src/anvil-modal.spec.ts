import Anvil from '@themeworkshop/anvil';
import AnvilModal from './anvil-modal';

const html = `
<body>
  <div data-component="modal">
    <button id="modal-button" data-modal="button" aria-controls="modal-content">Open</button>
    <section id="modal-content" hidden data-modal="content" aria-labelledby="modal-title">
      <h1 id="modal-title">This is a modal window</h1>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam
        ipsa ducimus a molestias cum, harum veritatis ea illum debitis
        aliquid obcaecati eligendi voluptates distinctio ratione delectus,
        iste voluptate, eos odit.</p>
    </section>
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

  it('opens when the button is clicked', () => {
    const anvil = new Anvil();
    anvil.register('modal', AnvilModal);

    const button: HTMLButtonElement = document.querySelector(
      '[data-modal="button"]'
    );
    button.click();
    expect(button.classList.contains('open-test')).toBe(true);
  });
});
