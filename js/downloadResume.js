import { collectResumeData } from "./navigationForms.js";

export function downloadResume() {
  if (typeof window.jspdf === "undefined") {
    console.error("Библиотека jsPDF не загружена!");
    alert("Функция создания PDF недоступна: библиотека не загружена.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Добавляем кастомный шрифт (замените на ваш)
  doc.addFont("./fonts/Roboto-Regular.ttf", "Roboto", "normal");
  doc.addFont("./fonts/Roboto-Bold.ttf", "Roboto", "bold");
  doc.setFont("Roboto");

  const resumeData = collectResumeData();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const gapBetweenBlocks = 15;
  const gapBetweenLines = 10;
  const sideIndentation = 50;
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
    doc.text(resumeData.fullName, margin + sideIndentation, currentY);
    currentY += gapBetweenLines;
  }

  // Email
  if (resumeData.email) {
    doc.text("Email:", margin, currentY);
    doc.setFontSize(12);
    doc.text(resumeData.email, margin + sideIndentation, currentY);
    currentY += gapBetweenLines;
  }

  // Телефон
  if (resumeData.phone) {
    doc.text("Телефон:", margin, currentY);
    doc.setFontSize(12);
    doc.text(resumeData.phone, margin + sideIndentation, currentY);
    currentY += 20;
  }

  // Обработка опыта работы
  if (resumeData.experience && resumeData.experience.length > 0) {
    doc.setFontSize(14);
    doc.setTextColor(50, 50, 50);
    doc.setFont("Roboto", "bold");
    doc.text("Опыт работы:", margin, currentY);
    doc.setFont("Roboto", "normal");
    currentY += 10;

    resumeData.experience.forEach((exp, index) => {
      // Отступ между блоками опыта
      if (index > 0) {
        currentY += gapBetweenBlocks;
      }

      currentY = checkPageBreak(doc, currentY, margin);
      // Компания
      if (exp.company) {
        doc.text("Компания:", margin, currentY);
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(exp.company, margin + sideIndentation, currentY);
        currentY += gapBetweenLines;
        currentY = checkPageBreak(doc, currentY, margin);
      }

      // Должность
      if (exp.position) {
        doc.setFontSize(14);
        doc.setTextColor(50, 50, 50);
        doc.text("Должность:", margin, currentY);
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(exp.position, margin + sideIndentation, currentY);
        currentY += gapBetweenLines;
        currentY = checkPageBreak(doc, currentY, margin);
      }

      // Период работы
      if (exp.period) {
        doc.setFontSize(14);
        doc.setTextColor(50, 50, 50);
        doc.text("Период:", margin, currentY);
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(exp.period, margin + sideIndentation, currentY);
        currentY += gapBetweenLines;
        currentY = checkPageBreak(doc, currentY, margin);
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
        doc.text(exp.responsibilities, margin + sideIndentation, currentY, {
          maxWidth: maxWidth,
        });

        // Оцениваем высоту блока с обязанностями (примерно 1 строка = 10 мм)
        const lineCount = Math.ceil(exp.responsibilities.length / 80); // 80 — примерное число символов в строке
        currentY += lineCount * 10 + 5; // +5 — отступ после блока
      }
    });

    currentY += 10;
    currentY = checkPageBreak(doc, currentY, margin);
  } else {
    // Если опыта работы нет
    doc.setFont("Roboto", "bold");
    doc.text("Опыт работы: не указан", margin, currentY);
    doc.setFont("Roboto", "normal");
    currentY += 15;
  }

  if (resumeData.education && resumeData.education.length > 0) {
    doc.setFontSize(14);
    doc.setTextColor(50, 50, 50);
    doc.setFont("Roboto", "bold");
    doc.text("Образование:", margin, currentY);
    doc.setFont("Roboto", "normal");
    currentY += 10;
    currentY = checkPageBreak(doc, currentY, margin);

    resumeData.education.forEach((edu, index) => {
      // Отступ между блоками образования
      if (index > 0) {
        currentY += gapBetweenBlocks;
        currentY = checkPageBreak(doc, currentY, margin);
      }

      // Учебное заведение
      if (edu.institution) {
        doc.text("Учебное заведение:", margin, currentY);
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(edu.institution, margin + sideIndentation, currentY);
        currentY += gapBetweenLines;
        currentY = checkPageBreak(doc, currentY, margin);
      }

      // Специальность
      if (edu.specialty) {
        doc.setFontSize(14);
        doc.setTextColor(50, 50, 50);
        doc.text("Специальность:", margin, currentY);
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(edu.specialty, margin + sideIndentation, currentY);
        currentY += gapBetweenLines;
        currentY = checkPageBreak(doc, currentY, margin);
      }

      // Годы обучения
      if (edu.years) {
        doc.setFontSize(14);
        doc.setTextColor(50, 50, 50);
        doc.text("Годы обучения:", margin, currentY);
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(edu.years, margin + sideIndentation, currentY);
        currentY += gapBetweenLines;
        currentY = checkPageBreak(doc, currentY, margin);
      }
    });

    currentY += 10;
  } else {
    // Если данных об образовании нет
    doc.setFont("Roboto", "bold");
    doc.text("Образование: не указано", margin, currentY);
    doc.setFont("Roboto", "normal");
    currentY += 15;
    currentY = checkPageBreak(doc, currentY, margin);
  }

  // Обработка навыков
  if (resumeData.skills && resumeData.skills.length > 0) {
    doc.setFontSize(14);
    doc.setTextColor(50, 50, 50);
    doc.setFont("Roboto", "bold");
    doc.text("Навыки:", margin, currentY);
    doc.setFont("Roboto", "normal");
    currentY += 10;
    currentY = checkPageBreak(doc, currentY, margin);

    resumeData.skills.forEach((skillItem, index) => {
      // Отступ между блоками навыков
      if (index > 0) {
        currentY += gapBetweenBlocks;
        currentY = checkPageBreak(doc, currentY, margin);
      }

      // Навык
      if (skillItem.skill) {
        doc.text("Навык:", margin, currentY);
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(skillItem.skill, margin + sideIndentation, currentY);
        currentY += gapBetweenLines;
        currentY = checkPageBreak(doc, currentY, margin);
      }

      // Уровень владения
      if (skillItem.level) {
        doc.setFontSize(14);
        doc.setTextColor(50, 50, 50);
        doc.text("Уровень:", margin, currentY);
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(skillItem.level, margin + sideIndentation, currentY);
        currentY += gapBetweenLines;
        currentY = checkPageBreak(doc, currentY, margin);
      }
    });

    currentY += 10;
  } else {
    // Если данных о навыках нет
    doc.setFont("Roboto", "bold");
    doc.text("Навыки: не указаны", margin, currentY);
    doc.setFont("Roboto", "normal");
    currentY += 15;
    currentY = checkPageBreak(doc, currentY, margin);
  }

  // Обработка дополнительных сведений
  if (resumeData.additional && resumeData.additional.trim() !== "") {
    doc.setFontSize(14);
    doc.setTextColor(50, 50, 50);
    doc.setFont("Roboto", "bold");
    doc.text("Дополнительные сведения:", margin, currentY);
    doc.setFont("Roboto", "normal");
    currentY += 10;
    currentY = checkPageBreak(doc, currentY, margin);

    // Устанавливаем стиль для основного текста
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);

    // Разбиваем длинный текст на строки, если он не помещается в ширину страницы
    const maxWidth = 80; // Ширина текста (с учётом отступов)
    doc.text(resumeData.additional, margin, currentY, {
      maxWidth: maxWidth,
    });

    // Оцениваем высоту блока с текстом (1 строка = gapBetweenLines мм)
    // 80 — примерное число символов в строке, можно настроить под свои нужды
    const lineCount = Math.ceil(resumeData.additional.length / 80);
    currentY += lineCount + sideIndentation; // + отступ после раздела
    currentY = checkPageBreak(doc, currentY, margin);
  } else {
    // Если дополнительных сведений нет
    doc.setFont("Roboto", "bold");
    doc.text("Дополнительные сведения: не указаны", margin, currentY);
    doc.setFont("Roboto", "normal");
    currentY += gapBetweenLines;
    currentY = checkPageBreak(doc, currentY, margin);
  }

  doc.save("резюме.pdf");
}

function checkPageBreak(doc, currentY, margin, pageHeight = 297) {
  const bottomMargin = 20; // Нижний отступ
  const maxY = pageHeight - bottomMargin;

  if (currentY >= maxY) {
    doc.addPage(); // Создаём новую страницу
    return margin; // Возвращаем начальную Y-позицию с учётом верхнего отступа
  }
  return currentY; // Если страница не закончилась, возвращаем текущую позицию
}

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
