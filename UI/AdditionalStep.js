import { html, render } from "../node_modules/lit-html/lit-html.js";

class AdditionalStep extends HTMLElement {
  connectedCallback() {
    const template = html`
      <form id="step5" class="step">
        <div class="additional-item">
          <h3 class="additionalStep steps">Шаг 5: Дополнительная информация</h3>
          <textarea
            name="Дополнительная информация"
            id="additional"
            placeholder="Курсы, сертификаты, языки и т.д."
          ></textarea>
          <button type="button" data-action="prevStep">Назад</button>
          <button type="button" data-action="generateResume">
            Сгенерировать резюме
          </button>
        </div>
      </form>
    `;

    render(template, this);
  }
}
customElements.define("additional-step", AdditionalStep);
