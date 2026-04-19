import styled, { css } from 'styled-components/native';

import { TouchableOpacity, Platform } from 'react-native';

import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

export const SignUpContainer = styled.View`
  flex: 1;

  background-color: ${({ theme }) => theme.COLORS['gray-color-100']};

  padding: ${verticalScale(0)}px ${scale(0)}px
    ${Platform.OS === 'android' ? verticalScale(20) : verticalScale(40)}px;
`;

export const SignUpContent = styled.View`
  flex: 1;

  margin-top: ${verticalScale(20)}px;

  padding: ${scale(16)}px;
`;

export const SignUpSelectPickerContainer = styled.View`
  margin-bottom: ${verticalScale(10)}px;
`;

export const FormContainer = styled.View`
  width: 100%;
  flex: 1;
`;

export const FooterContainer = styled.View`
  flex: 1;

  flex-direction: row;
  justify-content: flex-end;

  margin-top: ${verticalScale(20)}px;
  margin-bottom: ${verticalScale(10)}px;
`;

export const BoxActionButton = styled(TouchableOpacity).attrs({
  activeOpacity: 0.7,
})`
  width: ${scale(150)}px;
  height: ${verticalScale(50)}px;

  align-items: center;
  justify-content: center;

  margin-left: ${scale(65)}px;

  background-color: ${({ theme }) => theme.COLORS['blue-dark-color']};

  border-radius: ${moderateScale(6)}px;
`;

export const BoxActionButtonText = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.BOLD};
    font-size: ${moderateScale(theme.FONT_SIZE.LG)}px;
    color: ${theme.COLORS['white-color']};
  `};

  text-transform: uppercase;
`;

export const MemberActionButton = styled(TouchableOpacity)`
  height: ${verticalScale(30)}px;

  flex-direction: row;
  align-items: center;
  gap: ${scale(10)}px;

  margin-top: ${verticalScale(10)}px;
`;

export const SubscriptionCategoryActionButtonText = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.REGULAR};
    font-size: ${moderateScale(theme.FONT_SIZE.MD)}px;
    color: ${theme.COLORS['black-color']};
  `};
`;
