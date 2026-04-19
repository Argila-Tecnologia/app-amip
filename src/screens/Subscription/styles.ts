import styled, { css } from 'styled-components/native';
import { TouchableOpacity } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

export const SubscriptionContainer = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.COLORS['gray-color-100']};
`;

export const SubscriptionContent = styled.View`
  flex: 1;

  padding: ${scale(16)}px;
  margin-top: ${verticalScale(20)}px;
`;

export const SubscriptionButtonContainer = styled.View`
  flex-direction: row;
  justify-content: flex-end;

  margin-top: ${verticalScale(10)}px;
  margin-bottom: ${verticalScale(10)}px;
`;

export const SubscriptionForm = styled.View`
  flex: 1;
`;

export const SubscriptionActionButton = styled(TouchableOpacity).attrs({
  activeOpacity: 0.7,
})`
  min-width: ${scale(180)}px;
  height: ${verticalScale(50)}px;

  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.COLORS['blue-dark-color']};
  border-radius: ${moderateScale(6)}px;
`;

export const SubscriptionActionButtonText = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.BOLD};
    font-size: ${moderateScale(theme.FONT_SIZE.LG)}px;
    color: ${theme.COLORS['white-color']};
  `};

  text-transform: uppercase;
`;

export const SubscriptionPlaceDateChampionshipContainer = styled.View`
  width: 100%;
  height: ${verticalScale(30)}px;

  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  margin-bottom: ${verticalScale(8)}px;
`;

export const SubscriptionIconContainer = styled.View``;

export const SubscriptionPlaceDateChampionshipContent = styled.View`
  flex: 1;

  margin: 0 ${scale(4)}px;
`;

export const SubscriptionPlaceDateChampionshipText = styled.Text`
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  font-size: ${({ theme }) => moderateScale(theme.FONT_SIZE.MD)}px;
`;

export const SubscriptionCategoriesContainer = styled.View`
  flex: 1;

  margin-top: ${verticalScale(30)}px;
  margin-bottom: ${verticalScale(20)}px;
`;

export const SubscriptionCategoriesTitle = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.BOLD};
    font-size: ${moderateScale(theme.FONT_SIZE.LG)}px;
    color: ${theme.COLORS['black-color']};
  `};

  text-transform: uppercase;
`;

export const SubscriptionCategoryContent = styled.View`
  flex: 1;
  margin-top: ${verticalScale(15)}px;
`;

export const SubscriptionCategoryActionButton = styled(TouchableOpacity).attrs({
  activeOpacity: 0.7,
})`
  height: ${verticalScale(30)}px;

  flex-direction: row;
  align-items: center;

  margin-bottom: ${verticalScale(10)}px;
`;

export const SubscriptionCategoryActionButtonText = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.BOLD};
    font-size: ${moderateScale(theme.FONT_SIZE.LG)}px;
    color: ${theme.COLORS['black-color']};
  `};

  text-transform: uppercase;
`;
