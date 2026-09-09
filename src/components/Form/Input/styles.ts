import styled, { css } from 'styled-components/native';

import { TextInput, TouchableOpacity } from 'react-native';

import { Feather } from '@expo/vector-icons';

import { RFValue } from '@utils/rf-value';

interface ContainerProps {
  isErrored: boolean;
  isFocused: boolean;
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

  /*
    surface (não background) de propósito: se o fundo do input fosse igual
    ao fundo da própria tela, ele ficaria "invisível" quando as duas telas
    (tela e input) usassem o mesmo token - surface cria uma camada visual
    diferente da tela por trás, sem depender só da borda pra separar os
    dois. No tema claro o valor é quase idêntico ao antigo (#FFFFFF vs
    #F5F5F5), diferença imperceptível.
  */
  background: ${({ theme }) => theme.COLORS.surface};

  border-width: ${RFValue(2)}px;
  /*
    Antes da migração pro tema, a borda ficava transparente (mesma cor do
    fundo) e só virava azul quando o campo estava com foco de verdade
    (isFocused) - esse rastreamento de foco se perdeu na migração pra
    'surface', deixando a borda azul ligada o tempo todo, sem diferenciar
    campo focado de não-focado. Restaurado abaixo: 'border' é o token
    neutro (mesmo usado no SelectPicker) pro estado parado.
  */
  border-color: ${({ theme }) => theme.COLORS.border};
  border-radius: ${RFValue(10)}px;

  margin-bottom: ${RFValue(8)}px;

  padding: ${RFValue(0)}px ${RFValue(8)}px;

  ${(props) =>
    props.isFocused &&
    css`
      /*
        Era 'blue-dark-color' (#0c0c5b) - contra o fundo 'surface' escuro
        (#1B1E28) isso dá razão de contraste ~1:1 (WCAG pede 3:1 mínimo pra
        elementos de UI), praticamente invisível no tema dark. 'primary-color'
        (dourado) dá ~7.7:1 no escuro e ~2.2:1 no claro - bem mais visível
        nos dois, e alinha com o InputMask, que já usava essa cor pro foco.
      */
      border-color: ${({ theme }) => theme.COLORS['primary-color']};
    `}

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
  color: ${({ theme }) => theme.COLORS.text};
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
