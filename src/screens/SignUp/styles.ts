import styled, { css } from 'styled-components/native';

import { TouchableOpacity, Platform } from 'react-native';

import { RFValue } from '@utils/rf-value';

export const SignUpContainer = styled.View`
  flex: 1;

  background-color: ${({ theme }) => theme.COLORS.background};

  padding: ${RFValue(0)}px ${RFValue(0)}px
    ${Platform.OS === 'android' ? 20 : 40}px;
`;

export const SignUpContent = styled.View`
  flex: 1;

  margin-top: ${RFValue(20)}px;

  padding: ${RFValue(16)}px;
`;

export const SignUpSelectPickerContainer = styled.View`
  margin-bottom: 10px;
`;

export const FormContainer = styled.View`
  width: 100%;

  flex: 1;

  /*
    Cada campo (Input/InputMask) já traz sua própria margin-bottom pequena
    (8dp, ver Form/Input/styles.ts) - suficiente pra telas curtas, mas essa
    tela ficou bem mais longa depois dos campos de pai/mãe/responsável, e
    o espaçamento apertado ficou muito mais perceptível/cansativo de rolar.
    Esse "gap" soma com a margin de cada campo (não substitui), dando mais
    respiro entre eles sem mexer no componente compartilhado (que afetaria
    todas as outras telas do app).
  */
  gap: ${RFValue(10)}px;
`;

export const FooterContainer = styled.View`
  flex: 1;

  flex-direction: row;
  justify-content: flex-end;

  margin-top: ${RFValue(20)}px;
  margin-bottom: ${RFValue(10)}px;
`;

export const BoxActionButton = styled(TouchableOpacity).attrs({
  activeOpacity: 0.7,
})`
  width: ${RFValue(150)}px;
  height: ${RFValue(50)}px;

  align-items: center;
  justify-content: center;

  margin-left: ${RFValue(65)}px;

  background-color: ${({ theme }) => theme.COLORS['blue-dark-color']};

  border-radius: 6px;
`;

export const BoxActionButtonText = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.BOLD};
    font-size: ${RFValue(theme.FONT_SIZE.LG)}px;
    color: ${theme.COLORS['white-color']};
  `};

  text-transform: uppercase;
`;

export const MemberActionButton = styled(TouchableOpacity)`
  height: ${RFValue(30)}px;

  flex-direction: row;
  align-items: center;
  gap: 10px;

  transition: 0.7s;

  margin-top: 10px;
`;

export const SubscriptionCategoryActionButtonText = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.REGULAR};
    font-size: ${RFValue(theme.FONT_SIZE.MD)}px;
    color: ${theme.COLORS.text};
  `};
`;

// Linha do toggle "Menor de idade?" - diferente de MemberActionButton, não
// é um TouchableOpacity: o valor é só exibido aqui, quem decide é o
// useEffect/handler que calcula a idade a partir da data de nascimento (ver
// handleSelectedBirthday em index.tsx), nunca um toque direto do atleta.
export const MinorToggleRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 10px;

  margin-top: 10px;
`;

// flex: 1 é essencial aqui (diferente de SubscriptionCategoryActionButtonText,
// que só rotula textos curtos de uma linha) - o label deste toggle é longo
// o bastante pra quebrar em duas linhas, e sem flex:1 o texto reivindica sua
// largura "natural" (a linha inteira sem quebra), empurrando o Switch pra
// fora da tela em vez de dividir o espaço da linha com ele.
export const MinorToggleLabel = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.REGULAR};
    font-size: ${RFValue(theme.FONT_SIZE.MD)}px;
    color: ${theme.COLORS.text};
  `};

  flex: 1;
`;
