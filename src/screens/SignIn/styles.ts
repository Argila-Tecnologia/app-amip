import styled from 'styled-components/native';

import { Platform } from 'react-native';

import { RFValue } from 'react-native-responsive-fontsize';

export const SignInContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;

  padding: ${RFValue(0)}px ${RFValue(30)}px
    ${Platform.OS === 'android' ? 150 : 40}px;
`;

export const LogoImage = styled.Image`
  width: ${RFValue(176)}px;
  height: ${RFValue(200)}px;

  margin-top: ${RFValue(50)}px;
`;

export const Title = styled.Text`
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
  font-size: ${RFValue(24)}px;
  color: ${({ theme }) => theme.COLORS['white-color']};

  padding: ${RFValue(20)}px ${RFValue(0)}px ${RFValue(14)}px;
`;

export const FormContainer = styled.View`
  margin-top: 10px;
`;

export const ForgotPasswordContent = styled.View`
  width: 100%;

  margin-top: ${RFValue(15)}px;

  justify-content: center;
  align-items: flex-end;
`;

export const ForgotPasswordButton = styled.TouchableOpacity.attrs({
  activeOpacity: 0.7,
})`
  /* margin-top: ${RFValue(24)}px; */
`;

export const ForgotPasswordText = styled.Text`
  color: ${({ theme }) => theme.colors['green-color']};
  font-size: ${RFValue(20)}px;
  font-family: ${({ theme }) => theme.fonts.regular};
`;

export const Footer = styled.View`
  margin-top: ${RFValue(30)}px;
`;

export const FooterCreateAccountButton = styled.TouchableOpacity`
  width: 100%;
  justify-content: center;
  align-items: center;
`;

export const FooterCreateAccountButtonText = styled.Text`
  color: ${({ theme }) => theme.colors['black-color-100']};
  font-size: ${RFValue(20)}px;
  font-family: ${({ theme }) => theme.fonts.regular};
`;
