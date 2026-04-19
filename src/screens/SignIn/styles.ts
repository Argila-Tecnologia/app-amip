import styled, { css } from 'styled-components/native';

import { Platform } from 'react-native';

import { Image } from 'expo-image';

import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

export const SignInContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;

  /* background-color: ${({ theme }) => theme.COLORS['blue-dark-color']}; */

  padding: ${verticalScale(0)}px ${scale(30)}px
    ${Platform.OS === 'android' ? verticalScale(10) : verticalScale(40)}px;
`;

export const LogoImage = styled(Image)`
  width: 70%;
  height: ${verticalScale(331)}px;

  margin-top: ${verticalScale(50)}px;
  margin-bottom: ${verticalScale(20)}px;
` as unknown as typeof Image;

export const Title = styled.Text`
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
  font-size: ${moderateScale(24)}px;
  color: ${({ theme }) => theme.COLORS['white-color']};

  padding: ${verticalScale(20)}px ${scale(0)}px ${verticalScale(14)}px;
`;

export const FormContainer = styled.View`
  width: 100%;

  margin-top: 10px;
`;

export const ForgotPasswordContent = styled.View`
  width: 100%;

  margin-top: ${verticalScale(5)}px;

  justify-content: center;
  align-items: flex-end;
`;

export const ForgotPasswordButton = styled.TouchableOpacity.attrs({
  activeOpacity: 0.7,
})``;

export const ForgotPasswordText = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.REGULAR};
    font-size: ${verticalScale(theme.FONT_SIZE.SM)}px;
    color: ${theme.COLORS['white-color']};
  `};
`;

export const Footer = styled.View`
  margin-top: ${verticalScale(20)}px;
`;

export const FooterCreateAccountButton = styled.TouchableOpacity`
  width: 100%;
  justify-content: center;
  align-items: center;
`;

export const FooterCreateAccountButtonText = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.REGULAR};
    font-size: ${moderateScale(theme.FONT_SIZE.LG)}px;
    color: ${theme.COLORS['white-color']};
  `};
`;
