import {
    delay,
    calculateDelayBySpeed
} from "../utils";

/**
 * Асинхронная функция для сортировки массива столбцов методом сортировки выбором с задержкой.
 * columns - Массив столбцов для сортировки.
 * sortingMeta - Метаданные сортировки.
 * savedVars - Сохраненные переменные для возможности продолжения сортировки после прерывания.
 * onSorted - Callback-функция, вызываемая после завершения сортировки.
 */
export default async (columns, sortingMeta, savedVars, onSorted) => {
    // Внешний цикл для проходов по массиву
    for (let i = savedVars.i; i < columns.length; i++) {
        // Подсветка текущего элемента, который сравнивается со всеми остальными
        columns[i].setStatus('current');

        // Инициализация минимального элемента
        let minElement = i === savedVars.i ? (columns.find(col => col === savedVars.k) || columns[i]) : columns[i];

        // Внутренний цикл для поиска минимального элемента среди оставшихся
        for (let j = i === savedVars.i ? savedVars.j : i + 1; j < columns.length; j++) {
            // Подсветка текущего элемента, с которым сравнивается минимальный
            columns[j].setStatus('current');

            // Ожидание асинхронной задержки в соответствии со скоростью сортировки
            await delay(calculateDelayBySpeed(sortingMeta.speed));

            // Проверка на прерывание сортировки пользователем
            if (!sortingMeta.inProgress) {
                savedVars.i = i;
                savedVars.j = j;
                savedVars.k = minElement;
                return;
            }

            // Сравнение текущего элемента с минимальным
            if (columns[j].number < minElement.number) {
                // Сброс подсветки у предыдущего минимального элемента и подсветка текущего
                minElement.resetStatus('less');
                columns[j].setStatus('less');

                // Обновление минимального элемента
                minElement = columns[j];
            }

            // Сброс подсветки текущего элемента
            columns[j].resetStatus('current');
            // Подсветка текущего элемента внешнего цикла для визуализации
            columns[i].setStatus('current');
        }

        // Сброс подсветки минимального элемента после внутреннего цикла
        minElement.resetStatus();

        // Обмен значениями между текущим элементом и минимальным элементом
        const temp = minElement.number;
        minElement.number = columns[i].number;
        columns[i].number = temp;

        // Подсветка для визуализации обмена
        columns[i].setStatus('greater');
        minElement.setStatus('greater');

        // Ожидание асинхронной задержки в соответствии со скоростью сортировки
        await delay(calculateDelayBySpeed(sortingMeta.speed));

        // Сброс подсветки текущего элемента и минимального элемента
        columns[i].resetStatus();
        minElement.resetStatus();
    }

    // Вызов callback для сообщения об окончании сортировки
    onSorted();
    // Установка флага, что сортировка завершена
    sortingMeta.inProgress = false;
}