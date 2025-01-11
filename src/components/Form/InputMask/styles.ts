import styled, { css } from 'styled-components/native';

import { View } from 'react-native';

import { MaskedTextInput } from 'react-native-mask-text';

import { RFValue } from 'react-native-responsive-fontsize';

import { Feather } from '@expo/vector-icons';

interface IContentProps {
  isError: boolean;
}

export const InputContainer = styled.View`
  width: 100%;
`;

export const InputLabel = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.REGULAR};
    font-size: ${RFValue(theme.FONT_SIZE.MD)}px;
    color: ${theme.COLORS['black-color']};
  `};
`;

export const InputContent = styled(View)<IContentProps>`
  width: 100%;
  height: ${RFValue(50)}px;

  flex-direction: row;
  align-items: center;

  padding: 0 ${RFValue(16)}px;

  background: ${({ theme }) => theme.COLORS['white-color']};

  border-radius: ${RFValue(10)}px;
  border-width: ${RFValue(2)}px;
  border-color: ${({ theme }) => theme.COLORS['gray-color-200']};

  margin-bottom: ${RFValue(8)}px;

  ${({ isError, theme }) =>
    isError &&
    css`
      border-color: ${theme.COLORS['red-color']};
    `}
`;

export const Icon = styled(Feather)``;

export const TextInputField = styled(MaskedTextInput)`
  height: ${RFValue(50)}px;

  flex: 1;

  font-size: ${RFValue(16)}px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
`;
