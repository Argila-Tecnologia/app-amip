import styled, { css } from 'styled-components/native';

import { Image } from 'expo-image';

import { RFValue } from '@utils/rf-value';

export const HeaderAppContainer = styled.View`
  width: 100%;
  /* height: ${RFValue(90)}px; */

  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  background-color: ${({ theme }) => theme.COLORS['blue-dark-color']};

  padding: 0 ${RFValue(8)}px ${RFValue(15)}px;
`;

export const HeaderAppBox = styled.View`
  flex: 1;
`;

export const HeaderAppLogoImage = styled(Image)`
  width: 30%;
  height: ${RFValue(60)}px;

  margin-left: ${RFValue(10)}px;
  margin-right: ${RFValue(10)}px;
` as unknown as typeof Image;

export const HeaderAppTitle = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.BOLD};
    font-size: ${RFValue(theme.FONT_SIZE.LG)}px;
    color: ${({ theme }) => theme.COLORS['black-color']};
  `};

  font-weight: bold;
`;

// Antes agrupava o botão de tema e o de perfil do lado direito do header -
// o de perfil saiu (virou aba), sobrou só o de tema, mas o wrapper
// continua útil pra alinhar à direita (flex: 1 aqui, não no botão).
export const HeaderAppActions = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;

  margin-top: 10px;
`;

export const HeaderAppThemeButton = styled.TouchableOpacity.attrs({
  activeOpacity: 0.7,
})`
  padding: ${RFValue(8)}px;

  margin-right: ${RFValue(4)}px;
`;
