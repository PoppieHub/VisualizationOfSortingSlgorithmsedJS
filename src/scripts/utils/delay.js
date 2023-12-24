// Функция задержки выполнения асинхронного кода на указанное количество миллисекунд
export default async (ms) => new Promise(res => setTimeout(res, ms));