import {
    algorithmSelect,
    chart,
    NUMBERS_COUNT,
    numbersCountInput,
    playButton,
    resetButton,
    selectOptions,
    speedInput,
    wrapper
} from "./variables.js";

import {getSortFunctionByName} from "./utils/index.js";
import {disableInputs, resetInputs} from "./controlFunctions/index.js";

/**
 * Устанавливает стиль сетки для контейнера с графикой,
 * где количество столбцов в сетке соответствует числу NUMBERS_COUNT.
 */
wrapper.setAttribute(
    'style',
    `grid-template-columns: repeat(${NUMBERS_COUNT}, 1fr)`
);

/**
 * Обработчик для кнопки воспроизведения.
 * Если сортировка не выполняется, запускает сортировку и блокирует инпуты,
 * либо приостанавливает сортировку и сбрасывает значения инпутов.
 */
playButton.addEventListener('click', () => {
    if (!chart.isSorting) {
        chart.startSort(resetInputs);
        disableInputs();
    } else {
        chart.pauseSort();
        resetInputs();
    }
});

// Обработчик для кнопки сброса графика. Сбрасывает график к начальному состоянию.
resetButton.addEventListener('click', () => {
    chart.resetColumns();
});

// Обработчик инпута размера массива. Обновляет количество элементов в графике, устанавливает функцию сортировки
numbersCountInput.addEventListener('change', (event) => {
    const newValue = event.target.value;
    chart.numbersCount = newValue;
    chart.sortingFunction = getSortFunctionByName(
        algorithmSelect.value,
        selectOptions
    );
    wrapper.setAttribute(
        'style',
        `grid-template-columns: repeat(${chart.numbersCount}, 1fr)`
    );

    if (newValue >= 200) {
        wrapper.style.gap = '0';
    } else {
        wrapper.style.gap = '';
    }
});

// Обработчик поля выбора алгоритма сортировки. Устанавливает функцию сортировки, выбранному алгоритму.
algorithmSelect.addEventListener('change', (event) => {
    chart.sortingFunction = getSortFunctionByName(
        event.target.value,
        selectOptions
    );
});

// Обработчик поля ввода скорости сортировки. Устанавливает новую скорость сортировки для графика.
speedInput.addEventListener('change', (event) => {
    chart.sortingSpeed = event.target.value;
});