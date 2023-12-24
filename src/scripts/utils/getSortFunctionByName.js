// Получить функцию сортировки по её имени
export default (name, selectList) => {
    return selectList.find(option => option.value === name)?.function;
}