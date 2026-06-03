import RNAsyncStorage from '@react-native-async-storage/async-storage';

export async function getItem(key: string): Promise<string | null> {
  return RNAsyncStorage.getItem(key);
}

export async function setItem(key: string, value: string): Promise<void> {
  await RNAsyncStorage.setItem(key, value);
}

export async function removeItem(key: string): Promise<void> {
  await RNAsyncStorage.removeItem(key);
}

export async function getJsonItem<T>(key: string): Promise<T | null> {
  const raw = await RNAsyncStorage.getItem(key);
  if (raw == null) return null;
  return JSON.parse(raw) as T;
}

export async function setJsonItem<T>(key: string, value: T): Promise<void> {
  await RNAsyncStorage.setItem(key, JSON.stringify(value));
}
