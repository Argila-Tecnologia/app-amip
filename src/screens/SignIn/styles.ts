import styled, { css } from 'styled-components/native';

import { Platform } from 'react-native';

import { Image } from 'expo-image';

import { RFValue } from 'react-native-responsive-fontsize';

export const SignInContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;

  padding: ${RFValue(0)}px ${RFValue(30)}px
    ${Platform.OS === 'android' ? 10 : 40}px;
`;

export const LogoImage = styled(Image)`
  width: 70%;
  height: ${RFValue(331)}px;

  margin-top: ${RFValue(50)}px;
  margin-bottom: ${RFValue(20)}px;
` as unknown as typeof Image;

export const Title = styled.Text`
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
  font-size: ${RFValue(24)}px;
  color: ${({ theme }) => theme.COLORS['white-color']};

  padding: ${RFValue(20)}px ${RFValue(0)}px ${RFValue(14)}px;
`;

export const FormContainer = styled.View`
  width: 100%;

  margin-top: 10px;
`;

export const ForgotPasswordContent = styled.View`
  width: 100%;

  margin-top: ${RFValue(5)}px;

  justify-content: center;
  align-items: flex-end;
`;

export const ForgotPasswordButton = styled.TouchableOpacity.attrs({
  activeOpacity: 0.7,
})`
  /* margin-top: ${RFValue(24)}px; */
`;

export const ForgotPasswordText = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.REGULAR};
    font-size: ${RFValue(theme.FONT_SIZE.SM)}px;
    color: ${theme.COLORS['white-color']};
  `};
`;

export const Footer = styled.View`
  margin-top: ${RFValue(20)}px;
`;

export const FooterCreateAccountButton = styled.TouchableOpacity`
  width: 100%;
  justify-content: center;
  align-items: center;
`;

export const FooterCreateAccountButtonText = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.REGULAR};
    font-size: ${RFValue(theme.FONT_SIZE.LG)}px;
    color: ${theme.COLORS['white-color']};
  `};
`;
