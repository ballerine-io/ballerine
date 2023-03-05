export const uniqueArray = <TItem>(array: Array<TItem>) => Array.from(new Set(array));

export const sleep = async (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
