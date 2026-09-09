import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react';

import { StatusBar } from 'react-native';

import { ThemeProvider as StyledThemeProvider } from 'styled-components/native';

import { dark, light, ITheme } from '@theme/index';

import {
  themeNameAddStorage,
  themeNameGetStorage,
  IThemeName,
} from '@storage/theme-storage';

interface IThemeModeContextDataProps {
  themeName: IThemeName;
  theme: ITheme;
  setThemeName(themeName: IThemeName): Promise<void>;
  toggleTheme(): Promise<void>;
}

interface IThemeModeProviderProps {
  children: ReactNode;
}

const ThemeModeContext = createContext<IThemeModeContextDataProps>(
  {} as IThemeModeContextDataProps,
);

// Pedido do usuário: o app abre escuro por padrão pra quem nunca mexeu
// nessa configuração - só usa o tema claro depois de o usuário escolher
// isso manualmente na tela de Configurações (persistido a partir daí).
const DEFAULT_THEME_NAME: IThemeName = 'dark';

const ThemeModeProvider = ({ children }: IThemeModeProviderProps) => {
  const [themeName, setThemeNameState] = useState<IThemeName>(
    DEFAULT_THEME_NAME,
  );

  // FUNCTIONS
  const setThemeName = useCallback(async (newThemeName: IThemeName) => {
    setThemeNameState(newThemeName);

    await themeNameAddStorage(newThemeName);
  }, []);

  const toggleTheme = useCallback(async () => {
    await setThemeName(themeName === 'dark' ? 'light' : 'dark');
  }, [themeName, setThemeName]);

  const loadStoredThemeName = useCallback(async () => {
    const storedThemeName = await themeNameGetStorage();

    // Só sobrescreve o padrão (escuro) se o usuário já tiver escolhido
    // algo antes - ausência de valor salvo não é "claro", é "nunca decidiu".
    if (storedThemeName) {
      setThemeNameState(storedThemeName);
    }
  }, []);

  useEffect(() => {
    loadStoredThemeName();
  }, [loadStoredThemeName]);
  // END FUNCTIONS

  const theme = useMemo<ITheme>(
    () => (themeName === 'dark' ? dark : light),
    [themeName],
  );

  return (
    <ThemeModeContext.Provider
      value={{ themeName, theme, setThemeName, toggleTheme }}
    >
      {/*
        Fixo em 'light-content', NÃO acompanha o tema - achado ao verificar
        o tema claro de verdade no emulador: a área embaixo da status bar é
        sempre o header navy fixo ('blue-dark-color', igual nos dois temas -
        HeaderApp, Header e ProfileHeader, presentes no topo de toda tela do
        app), nunca o 'background'/'surface' que varia com o tema. Ícones
        escuros (a versão anterior, tema claro → 'dark-content') ficavam
        quase ilegíveis contra esse navy. Bug pré-existente da própria
        feature de tema (não introduzido pelo salto de SDK), só notado agora
        por testar o tema claro num dispositivo de verdade.
      */}
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>
    </ThemeModeContext.Provider>
  );
};

function useThemeMode(): IThemeModeContextDataProps {
  const context = useContext(ThemeModeContext);

  if (!context) {
    throw new Error('useThemeMode must be use whiting a ThemeModeProvider');
  }

  return context;
}

export { ThemeModeProvider, useThemeMode };
