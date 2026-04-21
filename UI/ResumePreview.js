import { html, render } from "../node_modules/lit-html/lit-html.js";

class ResumePreview extends HTMLElement {
  connectedCallback() {
    const template = html`
      <div id="resume-preview" style="display: none">
        <h2>Ваше резюме</h2>
        <div id="preview-content"></div>
        <button type="button" data-action="prevResumeForm">Назад</button>
        <button data-action="downloadResume">Скачать PDF</button>
        <button data-action="resetForm">Создать новое резюме</button>
        <button data-action="saveLocalStorage">Сохранить черновик</button>
        <div id="recomedations">Рекомендации по заполнению</div>
      </div>
    `;

    render(template, this);
  }
}
customElements.define("resume-preview", ResumePreview);
