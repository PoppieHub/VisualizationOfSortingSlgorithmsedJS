import {
    playButton,
    numbersCountInput,
    algorithmSelect,
    resetButton
} from "../variables.js";

/**
 * Блокирует инпуты.
 * Добавляет класс pause кнопке воспроизведения,
 * а также выключает кнопку сброса графика.
 */
export default () => {
    playButton.classList.add('pause');
    numbersCountInput.disabled = true;
    algorithmSelect.disabled = true;
    resetButton.disabled = true;
}