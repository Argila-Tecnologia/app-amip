import styled, { css } from 'styled-components/native';

import { RFValue } from '@utils/rf-value';

// Primeira tela a usar os tokens novos de tema (background/surface/text/
// text-secondary/border) direto, em vez das cores antigas ambíguas
// (gray-color-100/black-color/white-color) - ver src/themes/light.ts.
export const SettingsContainer = styled.View`
  flex: 1;

  background-color: ${({ theme }) => theme.COLORS.background};
`;

export const SettingsContent = styled.View`
  flex: 1;

  padding: ${RFValue(30)}px;
`;

export const SettingsSectionTitle = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.BOLD};
    font-size: ${RFValue(theme.FONT_SIZE.SM)}px;
    color: ${theme.COLORS['text-secondary']};
  `}

  text-transform: uppercase;
  letter-spacing: 1px;

  margin-bottom: ${RFValue(12)}px;
`;

export const SettingsCard = styled.View`
  background-color: ${({ theme }) => theme.COLORS.surface};

  border-width: 1px;
  border-color: ${({ theme }) => theme.COLORS.border};
  border-radius: 12px;

  padding: ${RFValue(20)}px;
`;

export const SettingsCardLabel = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.REGULAR};
    font-size: ${RFValue(theme.FONT_SIZE.MD)}px;
    color: ${theme.COLORS.text};
  `}

  margin-bottom: ${RFValue(16)}px;
`;

export const SettingsThemeOptions = styled.View`
  flex-direction: row;

  gap: ${RFValue(12)}px;
`;

interface ISettingsThemeOptionButtonProps {
  active: boolean;
}

export const SettingsThemeOptionButton = styled.TouchableOpacity.attrs({
  activeOpacity: 0.7,
})<ISettingsThemeOptionButtonProps>`
  flex: 1;

  align-items: center;

  padding: ${RFValue(14)}px;

  border-radius: 10px;

  border-width: 1px;
  border-color: ${({ theme, active }) =>
    active ? theme.COLORS['green-color'] : theme.COLORS.border};

  background-color: ${({ theme, active }) =>
    active ? theme.COLORS['green-color'] : 'transparent'};
`;

export const SettingsThemeOptionText = styled.Text<ISettingsThemeOptionButtonProps>`
  ${({ theme, active }) => css`
    font-family: ${theme.FONT_FAMILY.REGULAR};
    font-size: ${RFValue(theme.FONT_SIZE.MD)}px;
    color: ${active ? theme.COLORS['white-color'] : theme.COLORS.text};
  `}

  margin-top: ${RFValue(6)}px;
`;
