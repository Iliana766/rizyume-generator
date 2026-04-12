import {
  nextStep,
  prevStep,
  addExperience,
  addEducation,
  addSkill,
  generateResume,
  loadFromLocalStorage,
  resetForm,
} from "./navigationForms.js";
import { downloadResume } from "./downloadResume.js";

document.addEventListener("DOMContentLoaded", () => {
  document
    .querySelector('[data-action="loadFromLocalStorage"]')
    .addEventListener("click", loadFromLocalStorage);

  document.querySelectorAll('[data-action="nextStep"]').forEach((button) => {
    button.addEventListener("click", nextStep);
  });

  document.querySelectorAll('[data-action="prevStep"]').forEach((button) => {
    button.addEventListener("click", prevStep);
  });

  document
    .querySelector('[data-action="addExperience"]')
    .addEventListener("click", addExperience);

  document
    .querySelector('[data-action="addEducation"]')
    .addEventListener("click", addEducation);
  
  document
    .querySelector('[data-action="addSkill"]')
    .addEventListener("click", addSkill);

  document
    .querySelector('[data-action="generateResume"]')
    .addEventListener("click", generateResume);

  document
    .querySelector('[data-action="downloadResume"]')
    .addEventListener("click", downloadResume);

  document
    .querySelector('[data-action="resetForm"]')
    .addEventListener("click", resetForm);
});
