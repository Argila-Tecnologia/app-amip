import styled, { css } from 'styled-components/native';

import { Image } from 'expo-image';

import { RFValue } from 'react-native-responsive-fontsize';

export const DetailsNewsContainer = styled.View`
  flex: 1;
`;

export const DetailsNewsContent = styled.View`
  flex: 1;

  padding: ${RFValue(16)}px;
`;

export const DetailsNewsTitle = styled.Text`
  width: 100%;

  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.BOLD};
    font-size: ${RFValue(theme.FONT_SIZE.LG)}px;
    color: ${theme.COLORS['black-color']};
  `};

  font-weight: bold;
`;

export const BoxNews = styled.View`
  width: ${RFValue(100)}%;

  flex-direction: column;
  align-items: center;

  margin: ${RFValue(10)}px ${RFValue(15)}px ${RFValue(20)}px ${RFValue(15)}px;
`;

export const ImageNews = styled(Image)`
  width: 100%;
  height: ${RFValue(400)}px;

  margin-top: ${RFValue(5)}px;
  margin-bottom: ${RFValue(20)}px;
` as unknown as typeof Image;

export const BoxNewsContent = styled.Text`
  width: ${RFValue(100)}%;

  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  text-align: justify;

  margin-top: ${RFValue(10)}px;
`;

export const DetailNewsLinkVideoButton = styled.TouchableOpacity.attrs({
  activeOpacity: 0.7,
})`
  margin-top: ${RFValue(10)}px;
`;

export const DetailNewsLinkVideoButtonText = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.REGULAR};
    font-size: ${RFValue(theme.FONT_SIZE.MD)}px;
    color: ${theme.COLORS['blue-light-color']};
  `};

  text-align: justify;
`;
