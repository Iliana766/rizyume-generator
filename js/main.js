let currentStep = 1;
const totalSteps = 5;
let selectedTemplate = "";

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

      // Устанавливаем Data URL в src img
      photoPreview.src = e.target.result;
      previewContainer.style.display = "block";
    };
    img.src = e.target.result;
  };

  reader.readAsDataURL(file);
});

function calculateImageSize(
  originalWidth,
  originalHeight,
  maxWidth,
  maxHeight,
) {
  const aspectRatio = originalWidth / originalHeight;

  let newWidth = maxWidth;
  let newHeight = maxWidth / aspectRatio;

  // Если высота превышает максимум, корректируем
  if (newHeight > maxHeight) {
    newHeight = maxHeight;
    newWidth = maxHeight * aspectRatio;
  }

  return { width: newWidth, height: newHeight };
}

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("template-select")
    .addEventListener("change", function () {
      selectedTemplate = this.value;
      document.getElementById("template-selection").style.display = "none";
      document.getElementById("resume-form").style.display = "block";
    });
});

function nextStep() {
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

function prevStep() {
  document.getElementById(`step${currentStep}`).classList.remove("active");
  currentStep--;
  document.getElementById(`step${currentStep}`).classList.add("active");
}

function addExperience() {
  const container = document.getElementById("work-experience");
  const newItem = document.createElement("div");
  newItem.className = "experience-item";
  newItem.innerHTML = `
        <input name="company" type="text" placeholder="Компания" class="company" required>
        <input name="position" type="text" placeholder="Должность" class="position" required>
        <input name="period" type="text" placeholder="Период работы" class="period" required>
        <textarea name="responsibilities" placeholder="Обязанности" class="responsibilities"></textarea>
    `;
  container.appendChild(newItem);

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

// document.querySelectorAll("input, textarea").forEach((el) => {
//   el.addEventListener("change", generateResume);
// });

function addEducation() {
  const container = document.getElementById("education");
  const newItem = document.createElement("div");
  newItem.className = "education-item";
  newItem.innerHTML = `
        <input type="text" placeholder="Учебное заведение" class="institution">
        <input type="text" placeholder="Специальность" class="specialty">
        <input type="text" placeholder="Годы обучения" class="years">
    `;
  container.appendChild(newItem);
}

function addSkill() {
  const container = document.getElementById("skills");
  const newItem = document.createElement("div");
  newItem.className = "skill-item";
  newItem.innerHTML = `
        <input type="text" placeholder="Навык" class="skill">
        <select class="level">
            <option value="начальный">Начальный</option>
            <option value="средний">Средний</option>
            <option value="продвинутый">Продвинутый</option>
        </select>
    `;
  container.appendChild(newItem);
}

function generateResume() {
  const resumeData = collectResumeData();
  const previewContent = formatResume(resumeData);
  document.getElementById("preview-content").innerHTML = previewContent;
  document.getElementById("resume-form").style.display = "none";
  document.getElementById("resume-preview").style.display = "block";
}

function collectResumeData() {
  return {
    fullName: document.getElementById("fullName").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    // photo: document.getElementById("photo").files[0]
    //   ? document.getElementById("photo").files[0].name
    //   : "Не загружено",
    photo: document.getElementById("photoPreview")?.src || null,
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

// Сброс формы
function resetForm() {
  document.getElementById("resume-form").style.display = "block";
  document.getElementById("resume-preview").style.display = "none";
  currentStep = 1;
  document
    .querySelectorAll(".step")
    .forEach((step) => step.classList.remove("active"));
  document.getElementById("step1").classList.add("active");
}

function analyzeCompleteness(data) {
  const requiredFields = [
    "fullName",
    "email",
    "phone",
    "experience",
    "education",
    "skills",
  ];
  let filledCount = 0;

  requiredFields.forEach((field) => {
    if (
      data[field] &&
      ((Array.isArray(data[field]) && data[field].length > 0) ||
        (typeof data[field] === "string" && data[field].trim() !== ""))
    ) {
      filledCount++;
    }
  });

  const completeness = (filledCount / requiredFields.length) * 100;
  return {
    completeness: completeness,
    filledFields: filledCount,
    totalFields: requiredFields.length,
  };
}

function getStyleRecommendations(data) {
  const recommendations = [];

  // Проверка длины описания обязанностей
  data.experience.forEach((exp, index) => {
    const responsibilities = exp.responsibilities || "";
    if (responsibilities.length < 50) {
      recommendations.push(
        `В опыте работы №${index + 1} описание обязанностей слишком короткое. Добавьте больше деталей о достижениях.`,
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
        `В опыте работы №${index + 1} используйте глаголы действия (разработал, оптимизировал и т.д.) для описания достижений.`,
      );
    }
  });

  // Проверка навыков
  if (data.skills.length < 5) {
    recommendations.push(
      "Добавьте больше профессиональных навыков (рекомендуется 5–10).",
    );
  }

  return recommendations;
}

// Сохранение текущего состояния формы
function saveDraft() {
  const draftData = collectResumeData();
  localStorage.setItem("resumeDraft", JSON.stringify(draftData));
  alert("Черновик сохранён!");
}

// Загрузка черновика при загрузке страницы
function loadDraft() {
  const savedDraft = localStorage.getItem("resumeDraft");
  if (savedDraft) {
    const draftData = JSON.parse(savedDraft);
    populateForm(draftData);
    alert("Загружен сохранённый черновик!");
  }
}

// Заполнение формы данными из черновика
function populateForm(data) {
  document.getElementById("fullName").value = data.fullName || "";
  document.getElementById("email").value = data.email || "";
  document.getElementById("phone").value = data.phone || "";

  // Восстановление динамических блоков
  if (data.experience) {
    document.getElementById("work-experience").innerHTML = "";
    data.experience.forEach((exp) => addExperienceWithData(exp));
  }
  if (data.education) {
    document.getElementById("education").innerHTML = "";
    data.education.forEach((edu) => addEducationWithData(edu));
  }
  if (data.skills) {
    document.getElementById("skills").innerHTML = "";
    data.skills.forEach((skill) => addSkillWithData(skill));
  }
  document.getElementById("additional").value = data.additional || "";
}

// Вспомогательные функции для восстановления данных
function addExperienceWithData(data) {
  addExperience();
  const items = document.querySelectorAll(".experience-item");
  const newItem = items[items.length - 1];
  newItem.querySelector(".company").value = data.company || "";
  newItem.querySelector(".position").value = data.position || "";
  newItem.querySelector(".period").value = data.period || "";
  newItem.querySelector(".responsibilities").value =
    data.responsibilities || "";
}

function addEducationWithData(data) {
  addEducation();
  const items = document.querySelectorAll(".education-item");
  const newItem = items[items.length - 1];
  newItem.querySelector(".institution").value = data.institution || "";
  newItem.querySelector(".specialty").value = data.specialty || "";
  newItem.querySelector(".years").value = data.years || "";
}

function addSkillWithData(data) {
  addSkill();
  const items = document.querySelectorAll(".skill-item");
  const newItem = items[items.length - 1];
  newItem.querySelector(".skill").value = data.skill || "";
  newItem.querySelector(".level").value = data.level || "начальный";
}

function downloadResume() {
  if (typeof window.jspdf === "undefined") {
    console.error("Библиотека jsPDF не загружена!");
    alert("Функция создания PDF недоступна: библиотека не загружена.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Добавляем кастомный шрифт (замените на ваш)
  doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
  doc.setFont("Roboto");

  const resumeData = collectResumeData();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const gapBetweenBlocks = 15;
  const gapBetweenLines = 10;
  let currentY = 30;

  // Заголовок
  doc.setFontSize(20);
  doc.text("Резюме", pageWidth / 2, currentY, { align: "center" });
  currentY += 20;

  doc.setFontSize(14);

  // Обработка фото
  if (resumeData.photo && window.photoWidth && window.photoHeight) {
    try {
      if (resumeData.photo.startsWith("data:image/")) {
        // Рассчитываем новые размеры (макс. ширина 60 мм, макс. высота 80 мм)
        const { width: imgWidth, height: imgHeight } = calculateImageSize(
          window.photoWidth,
          window.photoHeight,
          60, // максимальная ширина в мм
          80, // максимальная высота в мм
        );

        const imageType = resumeData.photo
          .split(",")[0]
          .split(";")[0]
          .split("/")[1];
        doc.addImage(
          resumeData.photo,
          imageType.toUpperCase(),
          margin,
          currentY,
          imgWidth,
          imgHeight,
        );
        currentY += imgHeight + 10; // Учитываем высоту изображения + отступ
      } else {
        console.warn("Недопустимый формат Data URL:", resumeData.photo);
        doc.text("Фото: формат не поддерживается", margin, currentY);
        currentY += 15;
      }
    } catch (error) {
      console.error("Ошибка при добавлении фото в PDF:", error);
      doc.text("Фото: загружено (ошибка отображения)", margin, currentY);
      currentY += 15;
    }
  } else {
    doc.text("Фото: не загружено", margin, currentY);
    currentY += 15;
  }

  // ФИО
  if (resumeData.fullName) {
    doc.text("ФИО:", margin, currentY);
    doc.setFontSize(12);
    doc.text(resumeData.fullName, margin + 30, currentY);
    currentY += gapBetweenLines;
  }

  // Email
  if (resumeData.email) {
    doc.text("Email:", margin, currentY);
    doc.setFontSize(12);
    doc.text(resumeData.email, margin + 30, currentY);
    currentY += gapBetweenLines;
  }

  // Телефон
  if (resumeData.phone) {
    doc.text("Телефон:", margin, currentY);
    doc.setFontSize(12);
    doc.text(resumeData.phone, margin + 30, currentY);
    currentY += 20;
  }

  // Обработка опыта работы
  if (resumeData.experience && resumeData.experience.length > 0) {
    doc.setFontSize(14);
    doc.setTextColor(50, 50, 50);
    doc.text("Опыт работы:", margin, currentY);
    currentY += 10;

    resumeData.experience.forEach((exp, index) => {
      // Отступ между блоками опыта
      if (index > 0) {
        currentY += gapBetweenBlocks;
      }

      // Компания
      if (exp.company) {
        doc.text("Компания:", margin, currentY);
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(exp.company, margin + 30, currentY);
        currentY += gapBetweenLines;
      }

      // Должность
      if (exp.position) {
        doc.setFontSize(14);
        doc.setTextColor(50, 50, 50);
        doc.text("Должность:", margin, currentY);
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(exp.position, margin + 30, currentY);
        currentY += gapBetweenLines;
      }

      // Период работы
      if (exp.period) {
        doc.setFontSize(14);
        doc.setTextColor(50, 50, 50);
        doc.text("Период:", margin, currentY);
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(exp.period, margin + 30, currentY);
        currentY += gapBetweenLines;
      }

      // Обязанности
      if (exp.responsibilities) {
        doc.setFontSize(14);
        doc.setTextColor(50, 50, 50);
        doc.text("Обязанности:", margin, currentY);
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);

        // Разбиваем длинный текст на строки, если он не помещается в ширину страницы
        const maxWidth = pageWidth - margin * 2;
        doc.text(exp.responsibilities, margin + 30, currentY, {
          maxWidth: maxWidth,
        });

        // Оцениваем высоту блока с обязанностями (примерно 1 строка = 10 мм)
        const lineCount = Math.ceil(exp.responsibilities.length / 80); // 80 — примерное число символов в строке
        currentY += lineCount * 10 + 5; // +5 — отступ после блока
      }
    });
  } else {
    // Если опыта работы нет
    doc.text("Опыт работы: не указан", margin, currentY);
    currentY += 15;
  }

  doc.save("резюме.pdf");
}
