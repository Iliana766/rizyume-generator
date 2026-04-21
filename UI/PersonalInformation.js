import { html, render } from "../node_modules/lit-html/lit-html.js";

class PersonalInformation extends HTMLElement {
  connectedCallback() {
    const template = html`
      <form id="step1" class="step active">
        <h3 class="personalStep steps">Шаг 1: Личные данные</h3>
        <div class="personal-item">
          <h3>ФИО</h3>
          <input
            type="text"
            id="fullName"
            name="ФИО"
            placeholder="Иванов Иван Иванович"
            required
          />
          <div id="fullNameError" class="error-message"></div>
          <h3>Email</h3>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="example@mail.ru"
            required
          />
          <div id="emailError" class="error-message"></div>
          <h3>Номер телефона</h3>
          <input
            type="tel"
            id="phone"
            name="телефон"
            placeholder="+7 (999) 999-99-99"
            required
          />
          <div id="phoneError" class="error-message"></div>
          <h3>Загрузите фото</h3>
          <input
            type="file"
            id="photo"
            name="фото"
            accept="image/*"
            aria-label="Загрузите фото"
          />
          <div id="photoError" class="error-message"></div>
          <div
            id="previewContainer"
            class="preview-container"
            style="display: none"
          >
            <img
              id="photoPreview"
              class="photo-preview"
              src=""
              alt="Предпросмотр фото"
            />
          </div>
          <button type="button" data-action="nextStep">Далее</button>
        </div>
      </form>
    `;

    render(template, this);
  }
}
customElements.define("personal-information", PersonalInformation);
