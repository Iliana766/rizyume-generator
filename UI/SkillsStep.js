import { html, render } from "../node_modules/lit-html/lit-html.js";

class SkillsStep extends HTMLElement {
  connectedCallback() {
    const template = html`
      <form id="step4" class="step">
        <h3 class="skillsStep steps">Шаг 4: Навыки</h3>
        <div id="skills"></div>
        <button type="button" data-action="addSkill">Добавить навык</button>
        <button type="button" data-action="prevStep">Назад</button>
        <button type="button" data-action="nextStep">Далее</button>
      </form>
    `;

    render(template, this);
  }
}
customElements.define("skills-step", SkillsStep);
