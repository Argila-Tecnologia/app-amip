import styled, { css } from 'styled-components/native';

import { Image } from 'expo-image';

import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

export const DetailChampionshipContainer = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.COLORS['gray-color-100']};
`;

export const DetailChampionshipContent = styled.View`
  flex: 1;
  padding: ${scale(16)}px;
`;

export const DetailChampionshipTitle = styled.Text`
  width: 100%;

  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.BOLD};
    font-size: ${moderateScale(theme.FONT_SIZE.LG)}px;
    color: ${theme.COLORS['black-color']};
  `};

  margin-top: ${verticalScale(10)}px;
`;

export const DetailChampionshipInfoContainer = styled.View`
  width: 100%;

  flex-direction: column;
  align-items: center;

  margin-top: ${verticalScale(10)}px;
  margin-bottom: ${verticalScale(20)}px;
`;

export const DetailChampionshipImageContainer = styled.View`
  width: 100%;
  height: ${verticalScale(320)}px;

  overflow: hidden;

  border-radius: ${moderateScale(10)}px;

  margin-top: ${verticalScale(5)}px;
  margin-bottom: ${verticalScale(20)}px;
`;

export const DetailChampionshipImage = styled(Image)`
  width: 100%;
  height: 100%;
` as unknown as typeof Image;

export const DetailChampionshipInfoDescription = styled.Text`
  width: 100%;

  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  font-size: ${({ theme }) => moderateScale(theme.FONT_SIZE.MD)}px;

  text-align: justify;

  margin-top: ${verticalScale(10)}px;
  margin-bottom: ${verticalScale(10)}px;
`;

export const DetailChampionshipPlaceDateContainer = styled.View`
  height: ${verticalScale(30)}px;

  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  margin-top: ${verticalScale(20)}px;
  margin-bottom: ${verticalScale(8)}px;
`;

export const DetailChampionshipIconContainer = styled.View``;

export const DetailChampionshipPlaceDateContent = styled.View`
  flex: 1;

  margin: 0 ${scale(4)}px;
`;

export const DetailChampionshipPlaceDateText = styled.Text`
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  font-size: ${({ theme }) => moderateScale(theme.FONT_SIZE.SM)}px;
`;

export const DetailChampionshipLinkVideoButton = styled.TouchableOpacity.attrs({
  activeOpacity: 0.7,
})`
  margin-top: ${verticalScale(10)}px;
  margin-bottom: ${verticalScale(20)}px;
`;

export const DetailChampionshipLinkVideoButtonText = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.REGULAR};
    font-size: ${moderateScale(theme.FONT_SIZE.MD)}px;
    color: ${theme.COLORS['blue-light-color']};
  `};

  text-align: justify;
`;

export const DetailChampionshipSubscriptionButton = styled.TouchableOpacity.attrs(
  {
    activeOpacity: 0.7,
  },
)`
  margin-top: ${verticalScale(10)}px;
`;

export const DetailChampionshipSubscriptionButtonText = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.REGULAR};
    font-size: ${moderateScale(theme.FONT_SIZE.MD)}px;
    color: ${theme.COLORS['blue-light-color']};
  `};

  font-weight: bold;

  text-transform: uppercase;
  text-align: justify;
`;
