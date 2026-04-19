import { View } from 'react-native';

import { Feather } from '@expo/vector-icons';

import styled, { css } from 'styled-components/native';

import { MaskedTextInput } from 'react-native-mask-text';

import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

interface IContentProps {
  isError: boolean;
}

export const InputContainer = styled.View`
  width: 100%;
`;

export const InputLabel = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.REGULAR};
    font-size: ${moderateScale(theme.FONT_SIZE.MD)}px;
    color: ${theme.COLORS['black-color']};
  `};
`;

export const InputContent = styled(View)<IContentProps>`
  width: 100%;
  height: ${verticalScale(50)}px;

  flex-direction: row;
  align-items: center;

  padding: 0 ${scale(16)}px;

  background: ${({ theme }) => theme.COLORS['gray-color-100']};

  border-radius: ${moderateScale(10)}px;
  border-width: ${moderateScale(1.5)}px;
  border-color: ${({ theme }) => theme.COLORS['blue-dark-color']};

  margin-bottom: ${verticalScale(8)}px;

  ${({ isError, theme }) =>
    isError &&
    css`
      border-color: ${theme.COLORS['red-color']};
    `}
`;

export const Icon = styled(Feather)`
  margin-right: ${scale(10)}px;
`;

export const TextInputField = styled(MaskedTextInput)`
  flex: 1;

  font-size: ${moderateScale(16)}px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
`;
