import { html, render } from "../node_modules/lit-html/lit-html.js";

class TemplateSelection extends HTMLElement {
  connectedCallback() {
    const template = html`
      <div id="template-selection">
        <h2>Выберите шаблон</h2>
        <!-- Использование черновика -->
        <div id="restore" style="display: none">
          <h3>Имеется сохранённый черновик</h3>
          <p>Хотите восстановить ранее введённые данные?</p>
          <button class="btn btn-primary" data-action="loadFromLocalStorage">
            Восстановить черновик
          </button>
          <button class="btn remove-btn" data-action="delFromLocalStorage">
            Удалить черновик
          </button>
        </div>
        <!-- Выбор шаблона -->
        <select id="template-select">
          <option disabled selected>Выберите профессию</option>
          <option value="it">IT-специалист</option>
          <option value="marketing">Маркетолог</option>
          <option value="accountant">Бухгалтер</option>
          <option value="engineer">Инженер</option>
          <option value="manager">Менеджер</option>
        </select>
      </div>
    `;

    render(template, this);
  }
}
customElements.define("template-selection", TemplateSelection);
