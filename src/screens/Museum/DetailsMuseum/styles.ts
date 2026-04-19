import styled, { css } from 'styled-components/native';
import { Image } from 'expo-image';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

export const DetailMuseumContainer = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.COLORS['gray-color-100']};
`;

export const DetailMuseumContent = styled.View`
  flex: 1;
  padding: ${scale(16)}px;
`;

export const DetailMuseumTitle = styled.Text`
  width: 100%;

  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.BOLD};
    font-size: ${moderateScale(theme.FONT_SIZE.LG)}px;
    color: ${theme.COLORS['black-color']};
  `};
`;

export const DetailMuseumItemMuseum = styled.View`
  width: 100%;

  flex-direction: column;
  align-items: center;
`;

export const DetailMuseumImageContainer = styled.View`
  width: 100%;
  height: ${verticalScale(400)}px;

  border-radius: ${moderateScale(10)}px;

  overflow: hidden;

  margin: ${verticalScale(20)}px 0;
`;

export const DetailMuseumImage = styled(Image)`
  width: 100%;
  height: 100%;
` as unknown as typeof Image;

export const DetailMuseumMuseumDescription = styled.Text`
  width: 100%;

  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  font-size: ${({ theme }) => moderateScale(theme.FONT_SIZE.LG)}px;

  text-align: justify;

  margin-top: ${verticalScale(10)}px;
  margin-bottom: ${verticalScale(30)}px;
`;

export const DetailMuseumGalleryImages = styled.View`
  width: 100%;
`;
