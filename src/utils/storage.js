import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'userPrefs';

export async function saveUserPrefs(name, color) {
  try {
    const payLoad = JSON.stringify({name, color});
    await AsyncStorage.setItem(KEY, payLoad);
  } catch (e) {
    console.warn('Failaed to save prefs', e);
  }
}

export async function loadUserPrefs() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.warn('Failaed to fetch prefs', e);
    return null;
  }
}

export async function removeUserPrefs() {
  try {
    await AsyncStorage.removeItem(KEY);
  } catch (e) {
    console.warn('Failerd to clear prefs', e);
  }
}