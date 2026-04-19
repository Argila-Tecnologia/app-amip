import styled, { css } from 'styled-components/native';
import { Image } from 'expo-image';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

export const DetailsNewsContainer = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.COLORS['gray-color-100']};
`;

export const DetailsNewsContent = styled.View`
  flex: 1;
  padding: ${scale(16)}px;
`;

export const DetailsNewsTitle = styled.Text`
  width: 100%;

  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.BOLD};
    font-size: ${moderateScale(theme.FONT_SIZE.LG)}px;
    color: ${theme.COLORS['black-color']};
  `};
`;

export const BoxNews = styled.View`
  width: 100%;

  flex-direction: column;
  align-items: center;

  margin: ${verticalScale(15)}px 0;
`;

export const DetailNewsImageContainer = styled.View`
  width: 100%;
  height: ${verticalScale(200)}px;

  border-radius: ${moderateScale(10)}px;

  overflow: hidden;

  margin-bottom: ${verticalScale(10)}px;
`;

export const DetailNewsImage = styled(Image)`
  width: 100%;
  height: 100%;
` as unknown as typeof Image;

export const DetailNewsDescription = styled.Text`
  width: 100%;

  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  font-size: ${({ theme }) => moderateScale(theme.FONT_SIZE.LG)}px;

  text-align: justify;

  margin-top: ${verticalScale(10)}px;
`;

export const DetailNewsLinkVideoButton = styled.TouchableOpacity.attrs({
  activeOpacity: 0.7,
})`
  margin-top: ${verticalScale(10)}px;
`;

export const DetailNewsLinkVideoButtonText = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.REGULAR};
    font-size: ${moderateScale(theme.FONT_SIZE.SM)}px;
    color: ${theme.COLORS['black-color']};
  `};

  text-align: justify;
`;

export const DetailNewsLinkVideoButtonTextLink = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.BOLD};
    font-size: ${moderateScale(theme.FONT_SIZE.SM)}px;
    color: ${theme.COLORS['green-color']};
  `};

  text-align: justify;
`;
