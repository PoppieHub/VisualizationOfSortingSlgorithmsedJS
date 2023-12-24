import {
    delay,
    calculateDelayBySpeed
} from "../utils/index.js";

/**
 * Асинхронная функция для сортировки массива методом быстрой сортировки.
 * columns - Массив столбцов для сортировки.
 * sortingMeta - Данные сортировки.
 * savedVars - Сохраненные переменные для отслеживания состояния сортировки.
 * onSorted - Callback-функция, вызываемая после завершения сортировки.
 */
export default async (columns, sortingMeta, savedVars, onSorted) => {
    let left = 0;
    let right = columns.length - 1;
    savedVars.left = left;
    savedVars.right = right;

    // Вызов рекурсивной функции для выполнения быстрой сортировки
    await quickSortRecursive(columns, left, right, sortingMeta, savedVars, onSorted);

    // Если сортировка завершена, вызываем callback
    if (sortingMeta.inProgress) {
        onSorted();
    }

    sortingMeta.inProgress = false;
}

/**
 * Асинхронная рекурсивная функция для выполнения быстрой сортировки.
 * columns - Массив столбцов для сортировки.
 * left - Левая граница подмассива.
 * right - Правая граница подмассива.
 * sortingMeta - Данные сортировки.
 * savedVars - Сохраненные переменные для отслеживания состояния сортировки.
 * onSorted - Callback-функция, вызываемая после завершения сортировки.
 */
async function quickSortRecursive(columns, left, right, sortingMeta, savedVars, onSorted) {
    // Если левая граница >= правой, выходим из рекурсии
    if (left >= right || !sortingMeta.inProgress) {
        return;
    }

    // Получаем индекс опорного элемента после разделения
    const pivotIndex = await partition(columns, left, right, sortingMeta, savedVars);

    // Рекурсивно сортируем левую и правую части массива
    await quickSortRecursive(columns, left, pivotIndex - 1, sortingMeta, savedVars, onSorted);
    await quickSortRecursive(columns, pivotIndex + 1, right, sortingMeta, savedVars, onSorted);
}

/**
 * Асинхронная функция для разделения массива и получения индекса опорного элемента.
 * columns - Массив столбцов для сортировки.
 * left - Левая граница подмассива.
 * right - Правая граница подмассива.
 * sortingMeta - Данные сортировки.
 * savedVars - Сохраненные переменные для отслеживания состояния сортировки.
 */
async function partition(columns, left, right, sortingMeta, savedVars) {
    // Определяем опорный элемент как последний элемент массива
    const pivot = columns[right].number;
    // Индекс последнего элемента, который меньше опорного
    let i = left - 1;

    // Итерируем по элементам подмассива
    for (let j = left; j <= right - 1; j++) {
        columns[j].setStatus('current');
        await delay(calculateDelayBySpeed(sortingMeta.speed));

        // Если текущий элемент меньше опорного, переносим этот элемент в начало массива
        if (columns[j].number < pivot) {
            i++;
            // Меняем местами элементы
            const temp = columns[i].number;
            columns[i].number = columns[j].number;
            columns[j].number = temp;

            await delay(calculateDelayBySpeed(sortingMeta.speed));

            columns[j].resetStatus();
        }

        columns[j].resetStatus();
    }

    // Меняем местами опорный элемент и элемент на позиции i + 1
    const temp = columns[i + 1].number;
    columns[i + 1].number = columns[right].number;
    columns[right].number = temp;

    columns[i + 1].setStatus('greater');
    columns[right].setStatus('greater');

    await delay(calculateDelayBySpeed(sortingMeta.speed));

    columns[i + 1].resetStatus();
    columns[right].resetStatus();

    // Возвращаем индекс опорного элемента
    return i + 1;
}