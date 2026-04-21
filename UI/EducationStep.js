import { html, render } from "../node_modules/lit-html/lit-html.js";

class EducationStep extends HTMLElement {
  connectedCallback() {
    const template = html`
      <form id="step3" class="step">
        <h3 class="educationStep steps">Шаг 3: Образование</h3>
        <div id="education">
          <div class="education-item">
            <h3>Учебное заведение</h3>
            <input
              name="Учебное заведение"
              type="text"
              placeholder="Учебное заведение"
              class="institution"
              required
            />
            <h3>Специальность</h3>
            <input
              name="Специальность"
              type="text"
              placeholder="Специальность"
              class="specialty"
              required
            />
            <h3>Годы обучения</h3>
            <input
              name="Годы обучения"
              type="text"
              placeholder="Укажите годы обучения"
              class="years"
              required
            />
          </div>
        </div>
        <button type="button" data-action="addEducation">
          Добавить образование
        </button>
        <button type="button" data-action="prevStep">Назад</button>
        <button type="button" data-action="nextStep">Далее</button>
      </form>
    `;

    render(template, this);
  }
}
customElements.define("education-step", EducationStep);
