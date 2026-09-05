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
        Ícones da status bar precisam inverter junto com o tema: claros
        (light-content) sobre fundo escuro, escuros (dark-content) sobre
        fundo claro - do contrário ficam ilegíveis contra o fundo quando o
        usuário troca de tema.
      */}
      <StatusBar
        barStyle={themeName === 'dark' ? 'light-content' : 'dark-content'}
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
