import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const ForgotPasswordContainer = styled.View`
  flex: 1;
`;

export const ForgotPasswordContent = styled.View`
  align-items: center;
  justify-content: center;

  padding: ${RFValue(0)}px ${RFValue(30)}px;
`;

export const ForgotPasswordInfo = styled.View`
  width: 100%;

  margin-top: ${RFValue(30)}px;
  margin-bottom: ${RFValue(50)}px;
`;

export const ForgotPasswordInfoTitle = styled.Text`
  align-items: flex-start;

  font-size: ${RFValue(22)}px;
  font-family: ${({ theme }) => theme.fonts.medium};
  color: ${({ theme }) => theme.colors['black-color']};
  text-align: left;
`;

export const ForgotPasswordInfoText = styled.Text`
  font-size: ${RFValue(18)}px;
  color: ${({ theme }) => theme.colors['black-color']};

  margin-top: ${RFValue(10)}px;
`;

export const ForgotPasswordForm = styled.View`
  width: 100%;
`;

export const ForgotPasswordFooter = styled.View`
  flex: 1;

  padding: ${RFValue(10)}px ${RFValue(30)}px;
`;

export const ForgotPasswordFooterCreateAccountButton = styled.TouchableOpacity.attrs(
  {
    activeOpacity: 0.7,
  },
)`
  width: 100%;
  height: ${RFValue(60)}px;

  background: ${({ theme }) => theme.colors['blue-dark-color']};
  border-radius: ${RFValue(10)}px;
`;

export const ForgotPasswordFooterCreateAccountButtonText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.medium};
  font-size: ${RFValue(20)}px;
  color: ${({ theme }) => theme.colors['white-color']};

  text-transform: uppercase;
  text-align: center;

  padding: ${RFValue(15)}px ${RFValue(0)}px ${RFValue(14)}px;
`;
