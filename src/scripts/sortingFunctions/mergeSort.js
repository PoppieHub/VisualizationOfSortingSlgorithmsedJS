import {
    delay,
    calculateDelayBySpeed
} from "../utils";

/**
 * Асинхронная функция для сортировки массива столбцов методом сортировки слиянием.
 * columns - Массив столбцов для сортировки.
 * sortingMeta - Метаданные сортировки.
 * savedVars - Сохраненные переменные для возможности продолжения сортировки после прерывания.
 * onSorted - Callback-функция, вызываемая после завершения сортировки.
 * rigColumns - Исходный массив столбцов, используется для сброса состояния при приостановке.
 * recursionLevel - Уровень рекурсии (по умолчанию 0).
 */
export default async function mergeSortAsync (
    columns,
    sortingMeta,
    savedVars,
    onSorted,
    origColumns,
    recursionLevel = 0) {
    // Сброс флага приостановки
    sortingMeta.inPause = false;

    // Если массив содержит 1 элемент или сортировка прервана, возвращаем массив без изменений
    if (columns.length <= 1 || !sortingMeta.inProgress) {
        return columns;
    }

    // Увеличение уровня рекурсии
    recursionLevel++;

    // Если origColumns не задан, устанавливаем его равным columns
    if (!origColumns) {
        origColumns = columns;
    }

    // Создание копии массива
    const arrCopy = columns.map(a => ({ ...a }));

    // Разделение массива на две части
    const middle = Math.floor(arrCopy.length / 2);
    const left = arrCopy.slice(0, middle);
    const right = arrCopy.slice(middle);

    // Рекурсивная сортировка левой и правой частей
    const sortedLeft = await mergeSortAsync(left, sortingMeta, savedVars, onSorted, origColumns, recursionLevel);
    const sortedRight = await mergeSortAsync(right, sortingMeta, savedVars, onSorted, origColumns, recursionLevel);

    // Слияние отсортированных частей
    const sorted = await merge(sortedLeft, sortedRight, origColumns, sortingMeta);

    // Если это первый уровень рекурсии и сортировка не приостановлена, вызываем onSorted и завершаем сортировку
    if (recursionLevel === 1 && !sortingMeta.inPause) {
        onSorted();
        sortingMeta.inProgress = false;
    }

    // Возвращаем отсортированный массив
    return sorted;
}

/**
 * Асинхронная функция для слияния двух отсортированных массивов в один.
 * left - Левый отсортированный массив.
 * right - Правый отсортированный массив.
 * arr - Исходный массив, из которого извлекаются элементы для сравнения.
 * sortingMeta - Данные сортировки.
 */
async function merge(left, right, arr, sortingMeta) {
    let result = [];
    let leftIndex = 0;
    let rightIndex = 0;

    // Вычисляем размер блока для слияния
    const blockSize = left.length + right.length;

    // Находим начальный индекс блока в исходном массиве arr
    const blockStart = arr.indexOf(arr.find(col => col.number === left[0]._number));

    // Выделяем блок в исходном массиве
    const block = arr.slice(blockStart, blockSize + blockStart);

    while (leftIndex < left.length && rightIndex < right.length) {
        // Находим элементы, которые будут сравниваться
        const arrLeftItem = arr.find(col => col.number === left[leftIndex]._number);
        const arrRightItem = arr.find(col => col.number === right[rightIndex]._number);

        // Подсветка сравниваемых элементов
        arrLeftItem.setStatus('current');
        arrRightItem.setStatus('current');

        // Ожидание асинхронной задержки в соответствии со скоростью сортировки
        await delay(calculateDelayBySpeed(sortingMeta.speed));

        // Сброс подсветки сравниваемых элементов
        arrLeftItem.resetStatus('current');
        arrRightItem.resetStatus('current');

        if (left[leftIndex]._number < right[rightIndex]._number) {
            // Если левый элемент меньше, добавляем его в результат
            result.push(left[leftIndex]);
            leftIndex++;
        } else {
            // Если правый элемент меньше, производим обмен значениями и добавляем правый элемент в результат
            const arrLeftItem = arr.find(col => col.number === left[leftIndex]._number);
            const arrRightItem = arr.find(col => col.number === right[rightIndex]._number);

            // Установка статусов для визуализации обмена
            arrRightItem.setStatus('less');
            arrLeftItem.setStatus('greater');

            // Ожидание асинхронной задержки в соответствии со скоростью сортировки
            await delay(calculateDelayBySpeed(sortingMeta.speed));

            // Сброс статусов для визуализации обмена
            arrRightItem.resetStatus();
            arrLeftItem.resetStatus();

            // Обмен значениями элементов
            const temp = arrRightItem.number;
            arrRightItem.number = left[leftIndex]._number;
            arrLeftItem.number = temp;

            // Добавление правого элемента в результат
            result.push(right[rightIndex]);
            rightIndex++;
        }

        // Проверка на прерывание сортировки пользователем
        if (!sortingMeta.inProgress) {
            // Приостановка сортировки и возврат объединенного результата
            sortingMeta.inPause = true;
            return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
        }
    }

    // Ожидание асинхронной задержки в соответствии со скоростью сортировки
    await delay(calculateDelayBySpeed(sortingMeta.speed));

    // Добавление оставшихся элементов одного из подмассивов left или right к отсортированному результату
    const res = result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));

    // Визуализация изменений в исходном массиве
    for (let i = 0; i < block.length; i++) {
        block[i].number = res[i]._number;

        // Установка статуса для визуализации изменений
        block[i].setStatus('greater');

        // Ожидание асинхронной задержки в соответствии со скоростью сортировки
        await delay(calculateDelayBySpeed(sortingMeta.speed));

        // Сброс статуса для визуализации изменений
        block[i].resetStatus();
    }

    // Возвращение отсортированного массива
    return res;
}