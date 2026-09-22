import styled, { css } from 'styled-components/native';

import { Platform } from 'react-native';

import { Image } from 'expo-image';

import { RFValue } from '@utils/rf-value';

export const SignInContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;

  /* background-color: ${({ theme }) => theme.COLORS['blue-dark-color']}; */

  padding: ${RFValue(0)}px ${RFValue(30)}px
    ${Platform.OS === 'android' ? 10 : 40}px;
`;

// Só a seta, sem barra de título completa (como o <Header> padrão usa nas
// outras telas) - o <Title> desta tela já estava comentado antes de eu
// mexer, indicando que a logo grande e centralizada era a intenção visual;
// uma barra de título competiria com ela. "position: absolute" tira do
// fluxo do SignInContainer (que centraliza o conteúdo), então o botão fica
// fixo no canto superior esquerdo independente do resto.
export const SignInBackButton = styled.TouchableOpacity.attrs({
  activeOpacity: 0.7,
})`
  position: absolute;
  left: ${RFValue(16)}px;
  z-index: 10;
`;

export const LogoImage = styled(Image)`
  width: 70%;
  height: ${RFValue(230)}px;

  margin-top: ${RFValue(30)}px;
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

export const DividerContainer = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;

  margin-top: ${RFValue(20)}px;
`;

export const DividerLine = styled.View`
  flex: 1;
  height: 1px;

  background-color: ${({ theme }) => theme.COLORS['white-color']}33;
`;

export const DividerText = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.REGULAR};
    font-size: ${RFValue(theme.FONT_SIZE.SM)}px;
    color: ${theme.COLORS['white-color']};
  `};

  margin: 0 ${RFValue(10)}px;
`;

export const GoogleSignInContainer = styled.View`
  width: 100%;
  align-items: center;

  margin-top: ${RFValue(16)}px;
`;

export const ForgotPasswordContent = styled.View`
  width: 100%;

  margin-top: ${RFValue(20)}px;

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
