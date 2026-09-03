import styled, { css } from 'styled-components/native';

import { TextInput, TouchableOpacity } from 'react-native';

import { Feather } from '@expo/vector-icons';

import { RFValue } from 'react-native-responsive-fontsize';

interface ContainerProps {
  isErrored: boolean;
}

// Envolve Container + ErrorText - Container sozinho não pode ter um irmão,
// já que quem usa o Input só espera um elemento de volta.
export const Wrapper = styled.View`
  width: 100%;
`;

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

// Antes só a borda ficava vermelha em erro, sem nenhum texto explicando o
// motivo - o usuário não tinha como saber por que o formulário não enviava.
export const ErrorText = styled.Text`
  color: ${({ theme }) => theme.COLORS['red-color']};
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  font-size: ${RFValue(12)}px;
  margin-top: ${RFValue(-4)}px;
  margin-bottom: ${RFValue(8)}px;
`;
