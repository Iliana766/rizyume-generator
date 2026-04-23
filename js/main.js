import { addSkill } from "./navigationForms.js";

// Проверка всего
document.addEventListener("DOMContentLoaded", function () {
  const draft = localStorage.getItem("draft");
  const photoInput = document.getElementById("photo");
  const photoPreview = document.getElementById("photoPreview");
  const previewContainer = document.getElementById("previewContainer");

  // Обработчик выбора файла
  photoInput.addEventListener("change", function (event) {
    const file = event.target.files[0];

    if (!file) {
      previewContainer.style.display = "none";
      return;
    }
    // Проверка типа файла
    if (!file.type.match("image.*")) {
      alert("Пожалуйста, выберите файл изображения");
      photoInput.value = "";
      previewContainer.style.display = "none";
      return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {
      const img = new Image();
      img.onload = function () {
        // Сохраняем исходные размеры
        window.photoWidth = img.width;
        window.photoHeight = img.height;

        // Устанавливаем Data URL изображения в атрибут src img
        photoPreview.src = e.target.result;
        previewContainer.style.display = "block";
      };
      img.src = e.target.result;
    };

    reader.readAsDataURL(file);
  });

  if (draft) {
    document.getElementById("restore").style.display = "block";
  }

  document
    .getElementById("template-select")
    .addEventListener("change", function () {
      usingTemplates();
      analyzeFormFill();
      document.getElementById("template-selection").style.display = "none";
      document.getElementById("resume-form").style.display = "block";
    });

  const forms = document.querySelectorAll("form");

  forms.forEach((form) => {
    form.addEventListener("input", analyzeFormFill);
  });
  // Первоначальный вызов для отображения начального состояния
  analyzeFormFill();
});

/**
 * Анализ заполнености полей и вывод пользователю
 */
export function analyzeFormFill() {
  const forms = document.querySelectorAll("form");
  const photoSrc = document.getElementById("photoPreview")?.src;
  const isPhotoEmpty = !photoSrc || photoSrc === "http://127.0.0.1:5500/";

  // Создаём массив для всех полей из всех форм
  let allFields = [];

  // Для каждой формы получаем её поля и добавляем в общий массив
  forms.forEach((form) => {
    const formFields = form.querySelectorAll("input, textarea, select");
    allFields = allFields.concat(Array.from(formFields));
  });

  let filledCount = 0;
  let emptyFields = [];

  allFields.forEach((field) => {
    let isFilled = false;
    console.log("type:", field.type, ", tagName:", field.tagName, field);

    switch (field.type) {
      case "checkbox":
        isFilled = field.checked;
        break;

      case "radio":
        const name = field.name;
        isFilled =
          document.querySelector(`input[name="${name}"]:checked`) !== null;
        break;

      case "file":
        isFilled = (field.files && field.files.length > 0) || !isPhotoEmpty;
        break;

      case "email":
      case "tel":
      case "text":
      case "textarea":
        isFilled = field.value.trim() !== "";
        break;

      case "select-one":
      case "select-multiple":
        isFilled = field.selectedIndex > -1;
        break;

      default:
        // Универсальная проверка для всех остальных типов полей
        isFilled = !!field.value && field.value.trim() !== "";
        break;
    }

    if (isFilled) {
      filledCount++;
    } else {
      emptyFields.push(field.name || field.id || "Без имени");
    }
  });

  const totalFields = allFields.length;
  const filledPercent =
    totalFields > 0 ? Math.round((filledCount / totalFields) * 100) : 0;

  // Вывод результата на страницу (с проверкой существования элемента)
  const resultElement = document.getElementById("result");

  if (resultElement) {
    resultElement.innerHTML = `
      <p><strong>Заполнено:</strong> ${filledCount} из ${totalFields} полей</p>
      <p><strong>Процент заполненности:</strong> ${filledPercent}%</p>
      ${
        emptyFields.length > 0
          ? `<p><strong>Пустые поля:</strong> ${emptyFields.join(", ")}</p>`
          : ""
      }
    `;
  }
}

/**
 * Рекомендации по заполнению
 * @param {Object} data
 * @returns
 */
export function getStyleRecommendations(data) {
  const recommendations = [];

  // Проверка длины описания обязанностей
  data.experience.forEach((exp, index) => {
    const responsibilities = exp.responsibilities || "";
    if (responsibilities.length < 50) {
      recommendations.push(
        `В опыте работы №${index + 1} описание обязанностей слишком короткое. Добавьте больше деталей о достижениях.<br>`,
      );
    }

    // Проверка на использование глаголов действия
    const actionVerbs = [
      "разработал",
      "оптимизировал",
      "внедрил",
      "улучшил",
      "создал",
    ];
    if (
      !actionVerbs.some((verb) => responsibilities.toLowerCase().includes(verb))
    ) {
      recommendations.push(
        `В опыте работы №${index + 1} используйте глаголы действия (разработал, оптимизировал и т.д.) для описания достижений.<br>`,
      );
    }
  });

  // Проверка навыков
  if (data.skills.length < 5) {
    recommendations.push(
      "Добавьте больше профессиональных навыков (рекомендуется 5–10).<br>",
    );
  }

  const recomedationsElement = document.getElementById("recomedations");

  if (recomedationsElement) {
    recomedationsElement.innerHTML = `
      <p><strong>Рекомендации по заполнению:<br></strong> ${recommendations.join("<br>")}</p>
    `;
  }
  return recommendations;
}

/**
 * Использование шаблонов для заполнения навыков
 */
export function usingTemplates() {
  const selectElement = document.getElementById("template-select");
  const selectedValueKey = selectElement.value;
  const templates = {
    it: [
      "Владение языками программирования (Python, Java, JavaScript)",
      "Знание алгоритмов и структур данных",
      "Опыт работы с базами данных (SQL, NoSQL)",
      "Понимание принципов ООП",
      "Навыки работы с Git и системами контроля версий",
      "Опыт разработки веб‑приложений (React, Angular, Vue.js)",
      "Знание основ кибербезопасности",
      "Умение писать чистый и документированный код",
      "Опыт работы с облачными платформами (AWS, Azure, GCP)",
      "Навыки тестирования и отладки ПО",
    ],
    marketing: [
      "Анализ целевой аудитории и рыночных трендов",
      "Разработка маркетинговых стратегий",
      "Навыки контент‑маркетинга и копирайтинга",
      "Опыт работы с инструментами SEO и SEM",
      "Управление рекламными кампаниями в Google Ads и Яндекс.Директ",
      "Работа с социальными сетями и SMM",
      "Аналитика и отчётность (Google Analytics, Яндекс.Метрика)",
      "Навыки email‑маркетинга",
      "Понимание основ бренд‑менеджмента",
      "Опыт A/B‑тестирования и оптимизации конверсии",
    ],
    accountant: [
      "Знание бухгалтерского и налогового учёта",
      "Работа с программами 1С:Бухгалтерия, SAP, QuickBooks",
      "Составление и сдача отчётности (баланс, отчёт о прибылях и убытках)",
      "Налоговое планирование и оптимизация",
      "Аудит и внутренний контроль",
      "Расчёт заработной платы и кадровый учёт",
      "Финансовый анализ и бюджетирование",
      "Знание МСФО (Международные стандарты финансовой отчётности)",
      "Контроль дебиторской и кредиторской задолженности",
      "Взаимодействие с налоговыми органами и аудиторами",
    ],
    engineer: [
      "Чтение и создание технических чертежей (AutoCAD, SolidWorks)",
      "Знание материаловедения и технологий производства",
      "Расчёты прочности и моделирование нагрузок",
      "Основы механики и термодинамики",
      "Проектирование и оптимизация инженерных систем",
      "Работа с CAD/CAM‑системами",
      "Испытания и валидация прототипов",
      "Знание стандартов и нормативов (ГОСТ, ISO)",
      "Автоматизация производственных процессов",
      "Техническое обслуживание и ремонт оборудования",
    ],
    manager: [
      "Стратегическое планирование и постановка целей",
      "Управление командой и мотивация сотрудников",
      "Навыки делегирования задач",
      "Эффективная коммуникация и ведение переговоров",
      "Принятие управленческих решений",
      "Бюджетирование и контроль расходов",
      "Управление проектами (Agile, Scrum, Waterfall)",
      "Оценка эффективности работы персонала",
      "Конфликтология и разрешение спорных ситуаций",
      "Развитие корпоративной культуры и тимбилдинг",
    ],
  };

  const skills = templates[selectedValueKey];
  if (skills) {
    skills.forEach((skill) => {
      addSkill(skill);
    });
  }
}
