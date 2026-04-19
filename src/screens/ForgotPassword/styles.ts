import styled, { css } from 'styled-components/native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

export const ForgotPasswordContainer = styled.View`
  flex: 1;
`;

export const ForgotPasswordContent = styled.View`
  align-items: center;
  justify-content: center;

  padding: 0 ${scale(30)}px;
`;

export const ForgotPasswordInfo = styled.View`
  width: 100%;

  margin-top: ${verticalScale(30)}px;
  margin-bottom: ${verticalScale(50)}px;
`;

export const ForgotPasswordInfoTitle = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.BOLD};
    font-size: ${moderateScale(theme.FONT_SIZE.LG)}px;
    color: ${theme.COLORS['black-color']};
  `};

  text-align: left;
`;

export const ForgotPasswordInfoText = styled.Text`
  font-size: ${({ theme }) => moderateScale(theme.FONT_SIZE.LG)}px;
  color: ${({ theme }) => theme.COLORS['black-color']};

  margin-top: ${verticalScale(10)}px;
`;

export const ForgotPasswordForm = styled.View`
  width: 100%;
`;

export const ForgotPasswordFooter = styled.View`
  flex: 1;

  padding: ${verticalScale(10)}px ${scale(30)}px;
`;

export const ForgotPasswordFooterCreateAccountButton = styled.TouchableOpacity.attrs(
  {
    activeOpacity: 0.7,
  },
)`
  width: 100%;
  height: ${verticalScale(50)}px;

  align-items: center;
  justify-content: center;

  background: ${({ theme }) => theme.COLORS['blue-dark-color']};
  border-radius: ${moderateScale(10)}px;
`;

export const ForgotPasswordFooterCreateAccountButtonText = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.BOLD};
    font-size: ${moderateScale(theme.FONT_SIZE.LG)}px;
    color: ${theme.COLORS['white-color']};
  `};

  text-transform: uppercase;
`;
