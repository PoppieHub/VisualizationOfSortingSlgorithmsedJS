import {
    delay,
    calculateDelayBySpeed
} from "../utils/index.js";

/**
 * Асинхронная функция для сортировки массива столбцов методом пузырька с задержкой.
 * columns - Массив столбцов для сортировки.
 * sortingMeta - Метаданные сортировки.
 * savedVars - Сохраненные переменные для возможности продолжения сортировки после прерывания.
 * onSorted - Callback-функция, вызываемая после завершения сортировки.
 */
export default async (columns, sortingMeta, savedVars, onSorted) => {
    // Внешний цикл для проходов по массиву
    for (let i = savedVars.i; i < columns.length; i++) {
        // Флаг, отражающий, были ли произведены обмены во внутреннем цикле
        let swapped = false;

        // Внутренний цикл для сравнения и обмена элементов
        for (let j = i === savedVars.i ? savedVars.j : 0; j < columns.length - i - 1; j++) {
            // Текущий и следующий элементы для сравнения
            const current = columns[j];
            const next = columns[j + 1];

            // Установка статуса 'текущий' для подсветки
            current.setStatus('current');
            next.setStatus('current');

            // Ожидание асинхронной задержки в соответствии со скоростью сортировки
            await delay(calculateDelayBySpeed(sortingMeta.speed));

            // Проверка на прерывание сортировки пользователем
            if (!sortingMeta.inProgress) {
                savedVars.i = i;
                savedVars.j = j;
                return;
            }

            // Сравнение текущего и следующего элементов
            if (current.number > next.number) {
                // Меняем местами значения элементов
                [current.number, next.number] = [next.number, current.number];

                // Установка статусов для анимации обмена
                current.setStatus('less');
                next.setStatus('greater');

                // Установка флага, что произошел обмен
                swapped = true;

                // Ожидание асинхронной задержки в соответствии со скоростью сортировки
                await delay(calculateDelayBySpeed(sortingMeta.speed));
            }

            // Сброс статусов для очистки подсветки
            [current, next].forEach(column => column.resetStatus());

            // Ожидание асинхронной задержки в соответствии со скоростью сортировки
            await delay(calculateDelayBySpeed(sortingMeta.speed));
        }

        // Если обмены не произошли во внутреннем цикле и сортировка не прервана
        if (!swapped && sortingMeta.inProgress) {
            break;
        }
    }

    // Вызов callback для сообщения об окончании сортировки
    onSorted();
    // Установка флага, что сортировка завершена
    sortingMeta.inProgress = false;
}