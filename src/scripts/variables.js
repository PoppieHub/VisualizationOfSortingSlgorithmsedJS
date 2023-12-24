import Chart from "./classes/Chart.js";
import {
    bubbleSort,
    insertionSort,
    selectionSort,
    mergeSort,
    quickSort
} from "./sortingFunctions/index.js";

export const
    wrapper = document.querySelector('.sort-chart'),
    playButton = document.getElementById('play-button'),
    resetButton = document.getElementById('shuffle-button'),
    numbersCountInput = document.getElementById('numbers-count'),
    algorithmSelect = document.getElementById('algorithm'),
    speedInput = document.getElementById('speed');

// Количество чисел в графике, устанавливаемое из поля ввода
export const NUMBERS_COUNT = numbersCountInput.value;

// Опции для выбора алгоритма сортировки
export const selectOptions = [
    {
        name: 'Быстрая сортировка',
        value: 'quick',
        function: quickSort,
    },
    {
        name: 'Сортировка пузырьком',
        value: 'bubble',
        function: bubbleSort,
    },
    {
        name: 'Сортировка выбором',
        value: 'selection',
        function: selectionSort,
    },
    {
        name: 'Сортировка вставками',
        value: 'insertion',
        function: insertionSort,
    },
    {
        name: 'Сортировка слиянием',
        value: 'merge',
        function: mergeSort,
    }
];

// График сортировки
export const chart = new Chart(wrapper, NUMBERS_COUNT, selectOptions);