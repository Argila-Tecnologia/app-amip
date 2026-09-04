import styled, { css } from 'styled-components/native';

import { RFValue } from '@utils/rf-value';

import { TouchableOpacity } from 'react-native';

export const SubscriptionContainer = styled.View`
  flex: 1;

  background-color: ${({ theme }) => theme.COLORS['gray-color-100']};
`;

export const SubscriptionContent = styled.View`
  flex: 1;

  padding: ${RFValue(16)}px;

  margin-top: ${RFValue(20)}px;
`;

export const SubscriptionButtonContainer = styled.View`
  flex: 1;

  flex-direction: row;
  justify-content: flex-end;

  margin-top: ${RFValue(10)}px;
  margin-bottom: ${RFValue(10)}px;
`;

export const SubscriptionForm = styled.View`
  flex: 1;
`;

export const SubscriptionActionButton = styled(TouchableOpacity).attrs({
  activeOpacity: 0.7,
})`
  width: ${RFValue(250)}px;
  height: ${RFValue(50)}px;

  align-items: center;
  justify-content: center;

  margin-left: ${RFValue(65)}px;

  background-color: ${({ theme }) => theme.COLORS['blue-dark-color']};
  border-radius: 6px;
`;

export const SubscriptionActionButtonText = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.BOLD};
    font-size: ${RFValue(theme.FONT_SIZE.LG)}px;
    color: ${theme.COLORS['white-color']};
  `};

  text-transform: uppercase;
`;

export const SubscriptionPlaceDateChampionshipContainer = styled.View`
  width: ${RFValue(100)}%;
  height: ${RFValue(30)}px;

  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  margin-bottom: ${RFValue(8)}px;
`;

export const SubscriptionIconContainer = styled.View``;

export const SubscriptionPlaceDateChampionshipContent = styled.View`
  flex: 1;

  margin: 0 ${RFValue(4)}px;
`;

export const SubscriptionPlaceDateChampionshipText = styled.Text`
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  font-size: ${({ theme }) => RFValue(theme.FONT_SIZE.MD)}px;
`;

export const SubscriptionCategoriesContainer = styled.View`
  flex: 1;

  margin-top: ${RFValue(30)}px;
  margin-bottom: ${RFValue(20)}px;
`;

export const SubscriptionCategoriesTitle = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.BOLD};
    font-size: ${RFValue(theme.FONT_SIZE.LG)}px;
    color: ${theme.COLORS['black-color']};
  `};

  text-transform: uppercase;
`;

export const SubscriptionCategoryContent = styled.View`
  flex: 1;

  /* flex-direction: row; */

  margin-top: ${RFValue(15)}px;
`;

export const SubscriptionCategoryActionButton = styled(TouchableOpacity)`
  height: ${RFValue(30)}px;

  flex-direction: row;
  align-items: center;
  gap: 10px;

  transition: 0.7s;

  margin-bottom: 10px;
`;

export const SubscriptionCategoryActionButtonText = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.BOLD};
    font-size: ${RFValue(theme.FONT_SIZE.LG)}px;
    color: ${theme.COLORS['black-color']};
  `};

  text-transform: uppercase;
`;
