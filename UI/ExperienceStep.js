import { html, render } from "../node_modules/lit-html/lit-html.js";

class ExperienceStep extends HTMLElement {
  connectedCallback() {
    const template = html`
      <form id="step2" class="step">
        <h3 class="experienceStep steps">Шаг 2: Опыт работы</h3>
        <div id="work-experience">
          <div class="experience-item">
            <h3>Компания</h3>
            <input
              name="Название компании"
              type="text"
              placeholder="Название компании"
              class="company"
              required
            />
            <h3>Должность</h3>
            <input
              name="Должность"
              type="text"
              placeholder="Должности"
              class="position"
              required
            />
            <h3>Период работы</h3>
            <input
              name="Период работы"
              type="text"
              placeholder="Период работы"
              class="period"
              required
            />
            <h3>Обязанности</h3>
            <textarea
              name="Обязанности по работе"
              placeholder="Обязанности по работе"
              class="responsibilities"
            ></textarea>
          </div>
        </div>
        <button type="button" data-action="addExperience">
          Добавить место работы
        </button>
        <button type="button" data-action="prevStep">Назад</button>
        <button type="button" data-action="nextStep">Далее</button>
      </form>
    `;

    render(template, this);
  }
}
customElements.define("experience-step", ExperienceStep);
