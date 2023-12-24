export default class Column {
    // Свойства для номера столбца и таймера мигания
    _number = 0;
    _timerBlink = null;

    // Константа для времени мигания
    static BLINK_TIME = 500;

    constructor(container, number, maxNumber) {
        // Установка максимального значения для нормализации высоты столбца
        this._maxNumber = maxNumber;

        // Создание элементов для столбца, линии и значений
        this.column = document.createElement('div');
        this.line = document.createElement('div');
        this.lineValue = document.createElement('div');

        // Установка номера столбца
        this.number = number;

        // Добавление классов стиля к элементам
        this.column.classList.add('chart-item');
        this.line.classList.add('chart-line');
        this.lineValue.classList.add('chart-value');

        // Вложение элементов друг в друга и добавление в контейнер
        this.line.append(this.lineValue);
        this.column.append(this.line);
        container.append(this.column);
    };

    // Метод для установки статуса столбца - больше, меньше, текущий
    setStatus(status) {
        this.resetStatus();
        this.lineValue.classList.add(status);
        if (status === 'greater') this.blink();
    };

    // Метод для сброса статуса столбца
    resetStatus(status) {
        if (status === undefined) {
            this.lineValue.classList.remove('greater', 'less', 'current');
        } else {
            this.lineValue.classList.remove(status);
        }
    };

    // Метод для мигания столбца
    blink() {
        this.lineValue.classList.remove('blink');
        clearTimeout(this._timerBlink);
        this.lineValue.classList.add('blink');
        this._timerBlink = setTimeout(() => {
            this.lineValue.classList.remove('blink');
        }, Column.BLINK_TIME);
    };

    // Установка значения номера столбца и обновление высоты столбца
    set number(value) {
        this._number = value;
        this.lineValue.style.height = (value * 100) / this._maxNumber + '%';
    };

    // Получение значения номера столбца
    get number() {
        return this._number;
    };
}
