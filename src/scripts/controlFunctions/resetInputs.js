import {
    playButton,
    numbersCountInput,
    algorithmSelect,
    resetButton
} from "../variables.js";

/**
 * Сбрасывает значения инпутов.
 * Удаляет класс pause у кнопки воспроизведения, включает поля ввода чисел и выбора алгоритма,
 * а также включает кнопку сброса графика.
 */
export default () => {
    playButton.classList.remove('pause');
    numbersCountInput.disabled = false;
    algorithmSelect.disabled = false;
    resetButton.disabled = false;
};