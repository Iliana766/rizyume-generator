const totalSteps = 5;

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
});

// Анализ заполненоти полей
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

// Рекомендации по заполнению
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
