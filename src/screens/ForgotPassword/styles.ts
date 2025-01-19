import styled, { css } from 'styled-components/native';
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

  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.BOLD};
    font-size: ${RFValue(theme.FONT_SIZE.LG)}px;
    color: ${theme.COLORS['black-color']};
  `};

  text-align: left;
`;

export const ForgotPasswordInfoText = styled.Text`
  font-size: ${({ theme }) => RFValue(theme.FONT_SIZE.LG)}px;
  color: ${({ theme }) => theme.COLORS['black-color']};

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
  height: ${RFValue(50)}px;

  background: ${({ theme }) => theme.COLORS['blue-dark-color']};
  border-radius: ${RFValue(10)}px;
`;

export const ForgotPasswordFooterCreateAccountButtonText = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.BOLD};
    font-size: ${RFValue(theme.FONT_SIZE.LG)}px;
    color: ${theme.COLORS['white-color']};
  `};

  text-transform: uppercase;
  text-align: center;

  padding: ${RFValue(15)}px ${RFValue(0)}px ${RFValue(14)}px;
`;
