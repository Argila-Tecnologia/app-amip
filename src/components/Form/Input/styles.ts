import styled, { css } from 'styled-components/native';

import { TextInput, TouchableOpacity } from 'react-native';

import { Feather } from '@expo/vector-icons';

import { RFValue } from 'react-native-responsive-fontsize';

interface ContainerProps {
  isErrored: boolean;
}

export const Container = styled.View<ContainerProps>`
  width: 100%;
  height: ${RFValue(50)}px;

  flex-direction: row;
  align-items: center;

  background: ${({ theme }) => theme.COLORS['gray-color-100']};

  border-width: ${RFValue(2)}px;
  border-color: ${({ theme }) => theme.COLORS['blue-dark-color']};
  border-radius: ${RFValue(10)}px;

  margin-bottom: ${RFValue(8)}px;

  padding: ${RFValue(0)}px ${RFValue(8)}px;

  ${(props) =>
    props.isErrored &&
    css`
      border-color: ${({ theme }) => theme.COLORS['red-color']};
    `}
`;

export const TextInputField = styled(TextInput)`
  flex: 1;

  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  font-size: ${RFValue(16)}px;
  color: ${({ theme }) => theme.COLORS['black-color-100']};
`;

export const SecureButton = styled(TouchableOpacity).attrs({
  activeOpacity: 0.7,
})`
  margin-left: ${RFValue(16)}px;
`;

export const Icon = styled(Feather)`
  margin-right: ${RFValue(16)}px;
`;
