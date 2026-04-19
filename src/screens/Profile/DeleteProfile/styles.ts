import styled, { css } from 'styled-components/native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

export const DeleteProfileContainer = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.COLORS['gray-color-100']};
`;

export const DeleteProfileContent = styled.View`
  flex: 1;

  padding: ${scale(16)}px;

  margin-top: ${verticalScale(20)}px;
`;

export const EditProfileForm = styled.View``;

export const Label = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.REGULAR};
    font-size: ${moderateScale(theme.FONT_SIZE.MD)}px;
    color: ${theme.COLORS['gray-color-400']};
  `};
`;

export const DeleteProfileButtonContainer = styled.View`
  flex-direction: row;
  justify-content: flex-end;

  margin-top: ${verticalScale(10)}px;
  margin-bottom: ${verticalScale(10)}px;
`;
