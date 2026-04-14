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

document.addEventListener("DOMContentLoaded", function () {
  const draft = localStorage.getItem("draft");

  if (draft) {
    document.getElementById("restore").style.display = "block";
  }

  document
    .getElementById("template-select")
    .addEventListener("change", function () {
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

// Анализ заполнености полей
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

    if (field.type === "checkbox") {
      isFilled = field.checked;
    } else if (field.type === "radio") {
      const name = field.name;
      isFilled =
        document.querySelector(`input[name="${name}"]:checked`) !== null;
    } else if (field.tagName === "SELECT") {
      isFilled = field.selectedIndex > 0;
    } else if (field.type === "file") {
      isFilled = (field.files && field.files.length > 0) || !isPhotoEmpty;
    } else {
      isFilled = field.value.trim() !== "";
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

// Рекомендации по заполнению
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
