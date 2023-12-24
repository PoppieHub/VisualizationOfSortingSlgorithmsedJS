import {
    delay,
    calculateDelayBySpeed
} from "../utils";

/**
 * Асинхронная функция для сортировки массива столбцов методом сортировки вставками с задержкой.
 * columns - Массив столбцов для сортировки.
 * sortingMeta - Метаданные сортировки.
 * savedVars - Сохраненные переменные для возможности продолжения сортировки после прерывания.
 * onSorted - Callback-функция, вызываемая после завершения сортировки.
 */
export default async (columns, sortingMeta, savedVars, onSorted) => {
    for (let i = savedVars.i === 0 ? 1 : savedVars.i; i < columns.length; i++) {
        const currentElement = columns[i];
        let j = i === savedVars.i ? savedVars.j : i - 1;

        // Запоминаем значение текущего элемента для вставки на правильное место
        const currentNumber = i === savedVars.i ? savedVars.k : currentElement.number;

        // Подсветка текущего элемента
        currentElement.setStatus('current');
        await delay(calculateDelayBySpeed(sortingMeta.speed));

        // Сдвигаем элементы, чтобы вставить текущий элемент на правильное место
        while (j >= 0 && columns[j].number > currentNumber) {
            // Сдвигаем элемент вправо
            columns[j + 1].number = columns[j].number;
            j--;

            // Подсветка элементов для визуализации сдвига
            columns[j + 1].setStatus('current');
            columns[j + 2].setStatus('greater');
            await delay(calculateDelayBySpeed(sortingMeta.speed));

            // Проверка на прерывание сортировки пользователем
            if (!sortingMeta.inProgress) {
                savedVars.i = i;
                savedVars.j = j;
                savedVars.k = currentNumber;
                return;
            }

            // Сброс подсветки
            columns[j + 1].resetStatus();
            columns[j + 2].resetStatus();
        }

        // Вставляем текущий элемент на правильное место
        columns[j + 1].number = currentNumber;

        // Подсветка для визуализации вставки
        columns[j + 1].setStatus('greater');
        await delay(calculateDelayBySpeed(sortingMeta.speed));

        // Проверка на прерывание сортировки пользователем
        if (!sortingMeta.inProgress) {
            savedVars.i = i;
            savedVars.j = j;
            savedVars.k = currentNumber;
            return;
        }

        // Сброс подсветки
        currentElement.resetStatus();
        columns[j + 1].resetStatus();
    }

    // Вызов callback для сообщения об окончании сортировки
    onSorted();
    // Установка флага, что сортировка завершена
    sortingMeta.inProgress = false;
}