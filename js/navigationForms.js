import { fillFormWithData } from "./fillFormWithData.js";
import { getStyleRecommendations, analyzeFormFill } from "./main.js";

let currentStep = 1;

export function collectResumeData() {
  const photoSrc = document.getElementById("photoPreview")?.src;
  const isPhotoEmpty = !photoSrc || photoSrc === "http://127.0.0.1:5500/";

  return {
    fullName: document.getElementById("fullName").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    photo: isPhotoEmpty ? null : photoSrc,
    experience: Array.from(document.querySelectorAll(".experience-item")).map(
      (item) => ({
        company: item.querySelector(".company").value,
        position: item.querySelector(".position").value,
        period: item.querySelector(".period").value,
        responsibilities: item.querySelector(".responsibilities").value,
      }),
    ),
    education: Array.from(document.querySelectorAll(".education-item")).map(
      (item) => ({
        institution: item.querySelector(".institution").value,
        specialty: item.querySelector(".specialty").value,
        years: item.querySelector(".years").value,
      }),
    ),
    skills: Array.from(document.querySelectorAll(".skill-item")).map(
      (item) => ({
        skill: item.querySelector(".skill").value,
        level: item.querySelector(".level").value,
      }),
    ),
    additional: document.getElementById("additional").value,
  };
}

export function nextStep() {
  const form = document.getElementById(`step${currentStep}`); // или конкретный ID формы

  // reportValidity() покажет стандартные подсказки браузера
  if (!form.reportValidity()) {
    // Если есть ошибки валидации, останавливаем выполнение
    return false;
  }
  document.getElementById(`step${currentStep}`).classList.remove("active");
  currentStep++;
  document.getElementById(`step${currentStep}`).classList.add("active");
}

export function prevStep() {
  document.getElementById(`step${currentStep}`).classList.remove("active");
  currentStep--;
  document.getElementById(`step${currentStep}`).classList.add("active");
}

export function addExperience() {
  const container = document.getElementById("work-experience");
  const newItem = document.createElement("div");
  newItem.className = "experience-item";
  newItem.innerHTML = `
        <h3>Компания</h3>
        <input name="company" type="text" placeholder="Название компании" class="company" required>
        <h3>Должность</h3>
        <input name="position" type="text" placeholder="Название должности" class="position" required>
        <h3>Период работы</h3>
        <input name="period" type="text" placeholder="Период работы" class="period" required>
        <h3>Обязанности</h3>
        <textarea name="responsibilities" placeholder="Обязанности по работе" class="responsibilities"></textarea>
    <button type="button" class="remove-btn">Удалить</button>
    `;
  container.appendChild(newItem);

  document
    .getElementById("work-experience")
    .addEventListener("click", function (e) {
      if (e.target.classList.contains("remove-btn")) {
        const item = e.target.closest(".experience-item");
        item.remove();
      }
    });
  // Добавляем обработчик, который будет удалять пустой блок при удалении всех значений
  newItem.addEventListener("change", () => {
    const isEmpty =
      !newItem.querySelector(".company").value &&
      !newItem.querySelector(".position").value &&
      !newItem.querySelector(".period").value &&
      !newItem.querySelector(".responsibilities").value;
    if (isEmpty) {
      newItem.remove();
    }
  });
}

export function addEducation() {
  const container = document.getElementById("education");
  const newItem = document.createElement("div");
  newItem.className = "education-item";
  newItem.innerHTML = `
        <h3>Учебное заведение</h3>
        <input type="text" placeholder="Учебное заведение" class="institution" required>
        <h3>Специальность</h3>
        <input type="text" placeholder="Специальность" class="specialty" required>
        <h3>Годы обучения</h3>
        <input type="text" placeholder="Укажите годы обучения" class="years" required>
    <button type="button" class="remove-btn">Удалить</button>
    `;
  container.appendChild(newItem);

  document.getElementById("education").addEventListener("click", function (e) {
    if (e.target.classList.contains("remove-btn")) {
      const item = e.target.closest(".education-item");
      item.remove();
    }
  });
}

export function addSkill() {
  const container = document.getElementById("skills");
  const newItem = document.createElement("div");
  newItem.className = "skill-item";
  newItem.innerHTML = `
        <h3>Навык</h3>
        <input type="text" placeholder="Укажите свой навык работы" class="skill">
        <select class="level">
            <option disabled selected>Выберите свой уровень</option>
            <option value="начальный">Начальный</option>
            <option value="средний">Средний</option>
            <option value="продвинутый">Продвинутый</option>
        </select>
    <button type="button" class="remove-btn">Удалить</button>
    `;
  container.appendChild(newItem);

  document.getElementById("skills").addEventListener("click", function (e) {
    if (e.target.classList.contains("remove-btn")) {
      const item = e.target.closest(".skill-item");
      item.remove();
    }
  });
}

// Форматирование резюме для предпросмотра
function formatResume(data) {
  let html = `<h3>${data.fullName}</h3>
               <p>Email: ${data.email}</p>
               <p>Телефон: ${data.phone}</p>`;

  // Опыт работы — выводим только если есть заполненные пункты
  if (data.experience.length > 0) {
    html += "<h4>Опыт работы</h4>";
    data.experience.forEach((exp) => {
      if (exp.company || exp.position || exp.period || exp.responsibilities) {
        // проверяем, есть ли данные
        html += `<p><strong>${exp.position}</strong> в ${exp.company} (${exp.period})</p>
                         <p>${exp.responsibilities}</p>`;
      }
    });
  } else {
    // Если нет ни одного заполненного опыта работы — не выводим раздел
    // (или можно вывести подсказку: "Опыт работы не указан")
    html += "<h4>Опыт работы</h4><p>Опыт работы не указан</p>";
  }

  // Образование — выводим только если есть заполненные пункты
  if (data.education.length > 0) {
    html += "<h4>Образование</h4>";
    data.education.forEach((edu) => {
      if (edu.institution || edu.specialty || edu.years) {
        // проверяем, есть ли данные
        html += `<p>${edu.institution || "—"}, ${edu.specialty || "—"} (${edu.years || "—"})</p>`;
      }
    });
  } else {
    html += "<h4>Образование</h4><p>Образование не указано</p>";
  }

  // Навыки — выводим только если есть заполненные пункты
  if (data.skills.length > 0) {
    html += "<h4>Навыки</h4><ul>";
    data.skills.forEach((skill) => {
      if (skill.skill) {
        // проверяем, заполнен ли навык
        html += `<li>${skill.skill} (уровень: ${skill.level})</li>`;
      }
    });
    html += "</ul>";
  } else {
    html += "<h4>Навыки</h4><p>Навыки не указаны</p>";
  }

  // Дополнительная информация
  if (data.additional.trim()) {
    html += `<h4>Дополнительная информация</h4><p>${data.additional}</p>`;
  }

  return html;
}

export function generateResume() {
  const resumeData = collectResumeData();
  const previewContent = formatResume(resumeData);

  getStyleRecommendations(resumeData);
  document.getElementById("preview-content").innerHTML = previewContent;
  document.getElementById("resume-form").style.display = "none";
  document.getElementById("resume-preview").style.display = "block";
}

export function prevResumeForm() {
  document.getElementById("resume-form").style.display = "block";
  document.getElementById("resume-preview").style.display = "none";
}

export function saveLocalStorage() {
  const resumeData = collectResumeData();

  if (resumeData) {
    localStorage.setItem("draft", JSON.stringify(resumeData));
    alert("Черновик успешно сохранён!");
  }
}

// Функция загрузки данных из localStorage и заполнения формы
export async function loadFromLocalStorage() {
  // Грузит из mock_data
  const response = await fetch("../mock_data/draft.json");
  if (!response.ok) {
    throw new Error(`Ошибка HTTP: ${response.status}`);
  }
  const data = await response.json();
  fillFormWithData(data);
  analyzeFormFill();
  document.getElementById("template-selection").style.display = "none";
  document.getElementById("resume-form").style.display = "block";

  return data;

  // Грузит из localStorage
  const draft = localStorage.getItem("draft");

  if (draft) {
    const data = JSON.parse(draft);
    fillFormWithData(data);

    document.getElementById("template-selection").style.display = "none";
    document.getElementById("resume-form").style.display = "block";

    return data;
  }
  return null;
}

export function delFromLocalStorage() {
  localStorage.removeItem("draft");
  document.getElementById("restore").style.display = "none";
  alert("Данные удалены");
}

// Сброс формы
export function resetForm() {
  const forms = document.querySelectorAll("form");
  forms.forEach((form) => form.reset());
  document.getElementById("resume-form").style.display = "block";
  document.getElementById("resume-preview").style.display = "none";
  currentStep = 1;
  document
    .querySelectorAll(".step")
    .forEach((step) => step.classList.remove("active"));
  document.getElementById("step1").classList.add("active");
  document.getElementById("previewContainer").style.display = "none";
  document.getElementById("photoPreview").src = "";
}
