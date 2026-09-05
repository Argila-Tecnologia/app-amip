import styled, { css } from 'styled-components/native';

import { Image } from 'expo-image';

import { RFValue } from '@utils/rf-value';

import { FallbackImage } from '@components/FallbackImage';

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

// Agrupa o botão de configurações (novo) e o de perfil (já existia) do lado
// direito do header - antes só HeaderAppProfileButton tinha "flex: 1" pra se
// alinhar à direita; agora quem faz isso é este wrapper, senão os dois
// botões lado a lado dividiriam o espaço 50/50 com o logo (flex: 1 cada um).
export const HeaderAppActions = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;

  margin-top: 10px;
`;

export const HeaderAppSettingsButton = styled.TouchableOpacity.attrs({
  activeOpacity: 0.7,
})`
  padding: ${RFValue(8)}px;

  margin-right: ${RFValue(4)}px;
`;

export const HeaderAppProfileButton = styled.TouchableOpacity.attrs({
  activeOpacity: 0.7,
})`
  flex-direction: row;
  align-items: center;
`;

export const HeaderAppBoxProfile = styled.View`
  margin-right: ${RFValue(10)}px;
`;

export const HeaderAppPersonText = styled.Text`
  width: ${RFValue(120)}px;

  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.REGULAR};
    font-size: ${RFValue(theme.FONT_SIZE.MD)}px;
    color: ${({ theme }) => theme.COLORS['black-color']};
  `};
`;

export const HeaderAppPersonPhotoImage = styled(FallbackImage)`
  width: ${RFValue(50)}px;
  height: ${RFValue(50)}px;

  border-radius: ${RFValue(25)}px;
` as unknown as typeof FallbackImage;

export const HeaderAppPersonPhotoIcon = styled.View`
  width: ${RFValue(50)}px;
  height: ${RFValue(50)}px;

  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.COLORS['white-color']};

  border-radius: ${RFValue(25)}px;

  /* margin-left: ${RFValue(0)}px;
  margin-right: ${RFValue(5)}px; */
`;
