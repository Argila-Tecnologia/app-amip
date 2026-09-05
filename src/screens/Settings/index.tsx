import { useCallback } from 'react';

import { Feather } from '@expo/vector-icons';

import { useTheme } from 'styled-components/native';

import { useThemeMode } from '@hooks/theme';

import { Header } from '@components/Header';

import {
  SettingsContainer,
  SettingsContent,
  SettingsSectionTitle,
  SettingsCard,
  SettingsCardLabel,
  SettingsThemeOptions,
  SettingsThemeOptionButton,
  SettingsThemeOptionText,
} from './styles';

// Tela pública (sem exigir login) - fica acessível pra qualquer visitante,
// não só quem tem conta, já que Notícias/Campeonatos/Museu também são
// públicas e o tema deve poder ser trocado em qualquer uma delas. Ver
// src/components/HeaderApp/index.tsx pra como se chega aqui.
export function SettingsScreen() {
  const theme = useTheme();
  const { themeName, setThemeName } = useThemeMode();

  // FUNCTION
  const handleSelectThemeName = useCallback(
    (newThemeName: 'dark' | 'light') => {
      setThemeName(newThemeName);
    },
    [setThemeName],
  );
  // END FUNCTION

  return (
    <SettingsContainer>
      <Header title="Configurações" />

      <SettingsContent>
        <SettingsSectionTitle>Aparência</SettingsSectionTitle>

        <SettingsCard>
          <SettingsCardLabel>Tema do aplicativo</SettingsCardLabel>

          <SettingsThemeOptions>
            <SettingsThemeOptionButton
              active={themeName === 'dark'}
              onPress={() => handleSelectThemeName('dark')}
            >
              <Feather
                name="moon"
                size={22}
                color={
                  themeName === 'dark'
                    ? theme.COLORS['white-color']
                    : theme.COLORS.text
                }
              />

              <SettingsThemeOptionText active={themeName === 'dark'}>
                Escuro
              </SettingsThemeOptionText>
            </SettingsThemeOptionButton>

            <SettingsThemeOptionButton
              active={themeName === 'light'}
              onPress={() => handleSelectThemeName('light')}
            >
              <Feather
                name="sun"
                size={22}
                color={
                  themeName === 'light'
                    ? theme.COLORS['white-color']
                    : theme.COLORS.text
                }
              />

              <SettingsThemeOptionText active={themeName === 'light'}>
                Claro
              </SettingsThemeOptionText>
            </SettingsThemeOptionButton>
          </SettingsThemeOptions>
        </SettingsCard>
      </SettingsContent>
    </SettingsContainer>
  );
}
