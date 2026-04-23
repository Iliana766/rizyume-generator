const configurations = {
  experience: {
    containerId: "work-experience",
    itemClass: "experience-item",
    fieldMappings: {
      company: {
        label: "Компания",
        selector: "company",
        type: "text",
        placeholder: "Компания",
      },
      position: {
        label: "Должность",
        selector: "position",
        type: "text",
        placeholder: "Должность",
      },
      period: {
        label: "Период работы",
        selector: "period",
        type: "text",
        placeholder: "Период работы",
      },
      responsibilities: {
        name: "Обязанности по работе",
        label: "Обязанности",
        selector: "responsibilities",
        type: "textarea",
        placeholder: "Обязанности по работе",
      },
    },
  },
  education: {
    containerId: "education",
    itemClass: "education-item",
    fieldMappings: {
      institution: {
        label: "Учебное заведение",
        selector: "institution",
        type: "text",
        placeholder: "Учебное заведение",
      },
      specialty: {
        label: "Специальность",
        selector: "specialty",
        type: "text",
        placeholder: "Специальность",
      },
      years: {
        label: "Годы обучения",
        selector: "years",
        type: "text",
        placeholder: "Укажите годы обучения",
      },
    },
  },
  skills: {
    containerId: "skills",
    itemClass: "skill-item",
    fieldMappings: {
      skill: {
        label: "Навык",
        selector: "skill",
        type: "text",
        placeholder: "Укажите свой навык",
      },
      level: {
        label: "Уровень",
        selector: "level",
        type: "select",
        options: [
          { value: "", label: "Выберите свой уровень", disabled: true },
          { value: "начальный", label: "Начальный" },
          { value: "средний", label: "Средний" },
          { value: "продвинутый", label: "Продвинутый" },
        ],
      },
    },
  },
};

/** Функция заполнения форм на странице данными из localStorage */
export function fillFormWithData(data) {
  // Основные данные
  document.getElementById("fullName").value = data.fullName || "";
  document.getElementById("email").value = data.email || "";
  document.getElementById("phone").value = data.phone || "";

  // Фото
  if (data.photo) {
    const previewContainer = document.getElementById("previewContainer");

    if (photoPreview) {
      photoPreview.src = data.photo;
      previewContainer.style.display = "block";
    }
  }

  // Заполняем все разделы
  fillDataGeneric(
    configurations.experience.containerId,
    configurations.experience.itemClass,
    data.experience || [],
    configurations.experience.fieldMappings,
  );

  fillDataGeneric(
    configurations.education.containerId,
    configurations.education.itemClass,
    data.education || [],
    configurations.education.fieldMappings,
  );

  fillDataGeneric(
    configurations.skills.containerId,
    configurations.skills.itemClass,
    data.skills || [],
    configurations.skills.fieldMappings,
  );

  // Дополнительная информация
  document.getElementById("additional").value = data.additional || "";
}

function fillDataGeneric(containerId, itemClass, dataArray, fieldMappings) {
  const container = document.getElementById(containerId);
  const existingItems = container.querySelectorAll(`.${itemClass}`);

  dataArray.forEach((dataItem, index) => {
    if (existingItems[index]) {
      // Заполняем существующий блок
      const item = existingItems[index];
      Object.entries(fieldMappings).forEach(([fieldKey, fieldConfig]) => {
        const element = item.querySelector(`.${fieldConfig.selector}`);
        if (element) {
          if (element.tagName === "SELECT") {
            element.value = dataItem[fieldKey] || "";
          } else {
            element.value = dataItem[fieldKey] || "";
          }
        }
      });
    } else {
      // Добавляем новый блок, если не хватает
      addGenericItem(
        container,
        containerId,
        itemClass,
        dataItem,
        fieldMappings,
      );
    }
  });
}

function addGenericItem(
  container,
  containerId,
  itemClass,
  dataItem,
  fieldMappings,
) {
  const item = document.createElement("div");
  item.className = itemClass;

  let htmlContent = "";

  Object.entries(fieldMappings).forEach(([fieldKey, fieldConfig]) => {
    const { label, selector, type, placeholder, options, name } = fieldConfig;

    if (type === "select") {
      htmlContent += `<h3>${label}</h3><select class="${selector}">`;
      options.forEach((option) => {
        const isSelected =
          dataItem[fieldKey] === option.value ? "selected" : "";
        const disabledAttr = option.disabled ? "disabled" : "";
        htmlContent += `<option value="${option.value}" ${isSelected} ${disabledAttr}>${option.label}</option>`;
      });
      htmlContent += "</select>";
    } else if (type === "textarea") {
      const value = dataItem[fieldKey] || "";
      htmlContent += `<h3>${label}</h3><textarea name="${name}" class="${selector}" placeholder="${placeholder}">${value}</textarea>`;
    } else {
      const value = dataItem[fieldKey] || "";
      htmlContent += `<h3>${label}</h3><input type="${type}" class="${selector}" placeholder="${placeholder}" value="${value}" />`;
    }
  });

  htmlContent += '<button type="button" class="remove-btn">Удалить</button>';
  item.innerHTML = htmlContent;
  container.appendChild(item);

  document
    .getElementById(`${containerId}`)
    .addEventListener("click", function (e) {
      if (e.target.classList.contains("remove-btn")) {
        const item = e.target.closest(`.${itemClass}`);
        item.remove();
      }
    });
}
