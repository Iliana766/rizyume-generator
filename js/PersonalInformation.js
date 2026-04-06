import { html, render } from "../node_modules/lit-html/lit-html.js";

class PersonalInformation extends HTMLElement {
  connectedCallback() {
    const template = html`
      <form id="step1" class="step active">
        <input
          type="text"
          id="fullName"
          name="fullName"
          placeholder="ФИО"
          required
        />
        <div id="fullNameError" class="error-message"></div>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Email"
          required
        />
        <div id="emailError" class="error-message"></div>
        <input
          type="tel"
          id="phone"
          name="phone"
          placeholder="+7 (999) 999-99-99"
          required
        />
        <div id="phoneError" class="error-message"></div>
        <input
          type="file"
          id="photo"
          name="photo"
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
        <button type="button" onclick="nextStep()">Далее</button>
      </form>
    `;

    render(template, this);
  }
}
customElements.define("personal-information", PersonalInformation);
