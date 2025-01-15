import styled, { css } from 'styled-components/native';

import { Image } from 'expo-image';

import { RFValue } from 'react-native-responsive-fontsize';

export const HeaderAppContainer = styled.View`
  width: 100%;
  height: ${RFValue(90)}px;

  flex-direction: row;
  align-items: center;

  background-color: ${({ theme }) => theme.COLORS['gray-color-300']};

  padding: ${RFValue(8)}px;
`;

export const HeaderAppBox = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
`;

export const HeaderAppLogoImage = styled(Image)`
  width: ${RFValue(55)}px;
  height: ${RFValue(70)}px;

  margin-left: ${RFValue(5)}px;
  margin-right: ${RFValue(10)}px;
`;

export const HeaderAppTitle = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.BOLD};
    font-size: ${RFValue(theme.FONT_SIZE.LG)}px;
    color: ${({ theme }) => theme.COLORS['black-color']};
  `};

  font-weight: bold;
`;

export const HeaderAppProfileButton = styled.TouchableOpacity.attrs({
  activeOpacity: 0.7,
})``;

export const HeaderAppBoxProfile = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;

  margin-right: ${RFValue(5)}px;
`;

export const HeaderAppPersonText = styled.Text`
  width: ${RFValue(120)}px;

  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.REGULAR};
    font-size: ${RFValue(theme.FONT_SIZE.MD)}px;
    color: ${({ theme }) => theme.COLORS['black-color']};
  `};
`;

export const HeaderAppPersonPhotoImage = styled(Image)`
  width: ${RFValue(50)}px;
  height: ${RFValue(50)}px;

  border-radius: ${RFValue(25)}px;

  margin-left: ${RFValue(0)}px;
  margin-right: ${RFValue(5)}px;
` as unknown as typeof Image;

export const HeaderAppPersonPhotoIcon = styled.View`
  width: ${RFValue(50)}px;
  height: ${RFValue(50)}px;

  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.COLORS['white-color']};

  border-radius: ${RFValue(25)}px;

  margin-left: ${RFValue(0)}px;
  margin-right: ${RFValue(5)}px;
`;
