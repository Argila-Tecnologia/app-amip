import styled, { css } from 'styled-components/native';

import { Image } from 'expo-image';

import { RFValue } from 'react-native-responsive-fontsize';

export const DetailMuseumContainer = styled.View`
  flex: 1;
`;

export const DetailMuseumContent = styled.View`
  flex: 1;

  padding: ${RFValue(16)}px;
`;

export const DetailMuseumTitle = styled.Text`
  width: 100%;

  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.BOLD};
    font-size: ${RFValue(theme.FONT_SIZE.LG)}px;
    color: ${theme.COLORS['black-color']};
  `};

  font-weight: bold;
`;

export const DetailMuseumItemMuseum = styled.View`
  width: 110%;

  flex-direction: column;
  align-items: center;

  margin: ${RFValue(10)}px ${RFValue(0)}px ${RFValue(20)}px ${RFValue(0)}px;
`;

export const DetailMuseumImage = styled(Image)`
  width: 100%;
  height: ${RFValue(400)}px;

  margin-top: ${RFValue(5)}px;
  margin-bottom: ${RFValue(20)}px;
` as unknown as typeof Image;

export const DetailMuseumMuseumDescription = styled.Text`
  width: 100%;

  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  text-align: justify;
  margin-top: ${RFValue(10)}px;
  margin-bottom: ${RFValue(15)}px;
`;

export const DetailMuseumGalleryImages = styled.View`
  width: ${RFValue(100)}%;
`;
