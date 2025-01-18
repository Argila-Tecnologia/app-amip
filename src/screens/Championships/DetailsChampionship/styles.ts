import styled, { css } from 'styled-components/native';

import { Image } from 'expo-image';

import { RFValue } from 'react-native-responsive-fontsize';

export const DetailChampionshipContainer = styled.View`
  flex: 1;

  background-color: ${({ theme }) => theme.COLORS['gray-color-100']};
`;

export const DetailChampionshipContent = styled.View`
  flex: 1;

  padding: ${RFValue(16)}px;
`;

export const DetailChampionshipTitle = styled.Text`
  width: ${RFValue(100)}%;

  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.BOLD};
    font-size: ${RFValue(theme.FONT_SIZE.LG)}px;
    color: ${theme.COLORS['black-color']};
  `};

  font-weight: bold;

  margin-top: 10px;
`;

export const DetailChampionshipInfoContainer = styled.View`
  width: 100%;

  flex-direction: column;
  align-items: center;

  margin-top: ${RFValue(10)}px;
  margin-bottom: ${RFValue(20)}px;
`;

export const DetailChampionshipImageContainer = styled.View`
  width: 100%;
  height: ${RFValue(320)}px;

  overflow: hidden;

  border-radius: 10px;

  margin-top: ${RFValue(5)}px;
  margin-bottom: ${RFValue(20)}px;
`;

export const DetailChampionshipImage = styled(Image)`
  width: 100%;
  height: 100%;
` as unknown as typeof Image;

export const DetailChampionshipInfoDescription = styled.Text`
  width: 100%;

  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  font-size: ${({ theme }) => theme.FONT_SIZE.MD}px;
  text-align: justify;

  margin-top: ${RFValue(10)}px;
  margin-bottom: ${RFValue(10)}px;
`;

export const DetailChampionshipPlaceDateContainer = styled.View`
  height: ${RFValue(30)}px;

  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  margin-top: ${RFValue(20)}px;
  margin-bottom: ${RFValue(8)}px;
`;

export const DetailChampionshipIconContainer = styled.View``;

export const DetailChampionshipPlaceDateContent = styled.View`
  flex: 1;

  margin: 0 ${RFValue(4)}px;
`;

export const DetailChampionshipPlaceDateText = styled.Text`
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  font-size: ${({ theme }) => RFValue(theme.FONT_SIZE.SM)}px;
`;

export const DetailChampionshipLinkVideoButton = styled.TouchableOpacity.attrs({
  activeOpacity: 0.7,
})`
  margin-top: ${RFValue(10)}px;
  margin-bottom: ${RFValue(20)}px;
`;

export const DetailChampionshipLinkVideoButtonText = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.REGULAR};
    font-size: ${RFValue(theme.FONT_SIZE.MD)}px;
    color: ${theme.COLORS['blue-light-color']};
  `};

  text-align: justify;
`;

export const DetailChampionshipSubscriptionButton = styled.TouchableOpacity.attrs(
  {
    activeOpacity: 0.7,
  },
)`
  margin-top: ${RFValue(10)}px;
`;

export const DetailChampionshipSubscriptionButtonText = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.REGULAR};
    font-size: ${RFValue(theme.FONT_SIZE.MD)}px;
    color: ${theme.COLORS['blue-light-color']};
  `};

  font-weight: bold;

  text-align: justify;
  text-transform: uppercase;
`;
