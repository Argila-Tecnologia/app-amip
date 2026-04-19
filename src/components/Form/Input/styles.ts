import { TextInput, TouchableOpacity } from 'react-native';

import { Feather } from '@expo/vector-icons';

import styled, { css } from 'styled-components/native';

import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

interface ContainerProps {
  isErrored: boolean;
}

export const Container = styled.View<ContainerProps>`
  width: 100%;
  height: ${verticalScale(50)}px;

  flex-direction: row;
  align-items: center;

  background: ${({ theme }) => theme.COLORS['gray-color-100']};

  border-width: ${moderateScale(1.5)}px;
  border-color: ${({ theme }) => theme.COLORS['blue-dark-color']};
  border-radius: ${moderateScale(10)}px;

  margin-bottom: ${verticalScale(8)}px;

  padding: 0 ${scale(8)}px;

  ${({ isErrored, theme }) =>
    isErrored &&
    css`
      border-color: ${theme.COLORS['red-color']};
    `}
`;

export const TextInputField = styled(TextInput)`
  flex: 1;

  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  font-size: ${moderateScale(16)}px;
  color: ${({ theme }) => theme.COLORS['black-color-100']};
`;

export const SecureButton = styled(TouchableOpacity).attrs({
  activeOpacity: 0.7,
})`
  margin-left: ${scale(16)}px;
`;

export const Icon = styled(Feather)`
  margin-right: ${scale(16)}px;
`;
