import AsyncStorage from '@react-native-async-storage/async-storage';

import { THEME_STORAGE } from './storage-config';

export type IThemeName = 'dark' | 'light';

export async function themeNameAddStorage(
  themeName: IThemeName,
): Promise<void> {
  await AsyncStorage.setItem(THEME_STORAGE, themeName);
}

// Retorna null quando o usuário nunca trocou de tema (nenhuma chave salva
// ainda) - nesse caso quem decide o padrão (escuro) é o ThemeModeProvider,
// não este arquivo.
export async function themeNameGetStorage(): Promise<IThemeName | null> {
  const storage = await AsyncStorage.getItem(THEME_STORAGE);

  return storage === 'dark' || storage === 'light' ? storage : null;
}
