import styled, { css } from 'styled-components/native';

import { RFValue } from '@utils/rf-value';

export const DeleteProfileContainer = styled.View`
  flex: 1;

  background-color: ${({ theme }) => theme.COLORS['gray-color-100']};
`;

export const DeleteProfileContent = styled.View`
  flex: 1;

  padding: ${RFValue(16)}px;

  margin-top: ${RFValue(20)}px;
`;

export const EditProfileForm = styled.View``;

export const Label = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.REGULAR};
    font-size: ${RFValue(theme.FONT_SIZE.MD)}px;
    color: ${theme.COLORS['gray-color-400']};
  `};
`;

export const DeleteProfileButtonContainer = styled.View`
  flex: 1;

  flex-direction: row;
  justify-content: flex-end;

  margin-top: ${RFValue(10)}px;
  margin-bottom: ${RFValue(10)}px;
`;
