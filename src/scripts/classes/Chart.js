import Column from "./Column.js";

// Класс для отображения данных в виде графика
export default class Chart {
    // Свойства для хранения количества чисел, данных сортировки,
    // функции сортировки и сохраненных переменных сортировки
    _numbersCount = 0;
    _sortingMeta = { inProgress: false, inPause: false, speed: 50 };
    _sortingFunction = null;
    _savedSortVars = {
        i: 0,
        j: 0,
        k: 0
    };

    // Принимает контейнер, количество чисел, варианты сортировки, defaultOption,
    // который задает начальное значение сортировки
    constructor(container, numbersCount, options, defaultOption = options[0]) {
        // Начальные значений
        this._numbersCount = numbersCount;
        this.container = container;
        this._sortingFunction = defaultOption.function;

        // Генерация значений и создание столбцов
        this.columnsValues = this.generateColumnsValues(numbersCount);
        this.columns = this.generateColumns(this.container, this.columnsValues);

        // Создание опций для выбора алгоритма сортировки
        this._createSelectOptions('algorithm', options);
    };

    // Для создания опций в элементе select по его id
    _createSelectOptions(selectElementId, options) {
        const selectElement = document.querySelector(`#${selectElementId}`);
        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value;
            optionElement.textContent = option.name;

            selectElement.append(optionElement);
        });
    };

    // Метод для генерации массива значений для столбцов
    generateColumnsValues(maxNumber) {
        const values = [];

        for (let i = 1; i <= maxNumber; i++) {
            values.push(i);
        }

        // Перемешивание значений
        return this.shuffleValues(values);
    };

    // Метод для генерации массива объектов Column
    generateColumns(container, values) {
        return values.map(value =>
            new Column(container, value, this._numbersCount)
        );
    };

    // Метод для начала сортировки с передачей callback onSortingDone
    startSort(onSortingDone) {
        if (!this._sortingMeta.inProgress) {
            this._sortingMeta.inProgress = true;
            this.sort(onSortingDone);
        }
    };

    // Метод для завершения сортировки с вызовом метода finalBlink и callback onSortingDone
    finishSort(onSortingDone) {
        this.finalBlink();
        onSortingDone();
    };

    // Метод для приостановки сортировки
    pauseSort() {
        this._sortingMeta.inProgress = false;
    };

    // Метод для запуска сортировки с использованием заданной функции сортировки
    // и передачей callback onSortingDone
    sort(onSortingDone) {
        this._sortingFunction(
            this.columns,
            this._sortingMeta,
            this._savedSortVars,
            this.finishSort.bind(this, onSortingDone)
        );
    };

    // Метод для перемешивания значений в массиве
    shuffleValues(values) {
        return values.slice().sort(() => Math.random() - 0.5);
    };

    // Метод для сброса столбцов
    resetColumns() {
        this._updateColumns(this._numbersCount);
    };

    // Метод для вызова метода blink у каждого столбца
    finalBlink() {
        this.columns.forEach(column => column.blink());
    };

    // Метод для обновления столбцов с использованием нового значения value
    _updateColumns(value) {
        this.container.innerHTML = '';
        this.columnsValues = this.generateColumnsValues(value);
        this.columns = this.generateColumns(
            this.container,
            this.columnsValues
        );
    };

    // Сеттер для установки функции сортировки и сброса сохраненных переменных сортировки
    set sortingFunction(value) {
        this._sortingFunction = value;
        this._savedSortVars = {
            i: 0,
            j: 0,
            someVar: 0
        };
    };

    // Сеттер для установки количества чисел и обновления столбцов
    set numbersCount(value) {
        this._numbersCount = value;
        this._updateColumns(value);
    };

    // Сеттер для установки скорости сортировки
    set sortingSpeed(value) {
        this._sortingMeta.speed = value;
    };

    // Геттер для проверки, выполняется ли в данный момент сортировка
    get isSorting() {
        return this._sortingMeta.inProgress;
    };

    // Геттер для получения количества чисел
    get numbersCount() {
        return this._numbersCount;
    };
}