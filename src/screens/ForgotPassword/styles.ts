import styled, { css } from 'styled-components/native';
import { RFValue } from '@utils/rf-value';

export const ForgotPasswordContainer = styled.View`
  flex: 1;

  /*
    Não tinha "background-color" nenhum antes - a cor cinza-claro que
    sempre apareceu era só o fundo padrão da janela nativa por trás
    (nunca controlado pelo app), então nunca ia acompanhar troca de tema.
    Adicionado explicitamente, igual às outras telas já migradas.
  */
  background-color: ${({ theme }) => theme.COLORS.background};
`;

export const ForgotPasswordContent = styled.View`
  align-items: center;
  justify-content: center;

  padding: ${RFValue(0)}px ${RFValue(30)}px;
`;

export const ForgotPasswordInfo = styled.View`
  width: 100%;

  margin-top: ${RFValue(30)}px;
  margin-bottom: ${RFValue(50)}px;
`;

export const ForgotPasswordInfoTitle = styled.Text`
  align-items: flex-start;

  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.BOLD};
    font-size: ${RFValue(theme.FONT_SIZE.LG)}px;
    color: ${theme.COLORS.text};
  `};

  text-align: left;
`;

export const ForgotPasswordInfoText = styled.Text`
  font-size: ${({ theme }) => RFValue(theme.FONT_SIZE.LG)}px;
  color: ${({ theme }) => theme.COLORS.text};

  margin-top: ${RFValue(10)}px;
`;

export const ForgotPasswordForm = styled.View`
  width: 100%;
`;

export const ForgotPasswordFooter = styled.View`
  flex: 1;

  padding: ${RFValue(10)}px ${RFValue(30)}px;
`;

export const ForgotPasswordFooterCreateAccountButton = styled.TouchableOpacity.attrs(
  {
    activeOpacity: 0.7,
  },
)`
  width: 100%;
  height: ${RFValue(50)}px;

  background: ${({ theme }) => theme.COLORS['blue-dark-color']};
  border-radius: ${RFValue(10)}px;
`;

export const ForgotPasswordFooterCreateAccountButtonText = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.BOLD};
    font-size: ${RFValue(theme.FONT_SIZE.LG)}px;
    color: ${theme.COLORS['white-color']};
  `};

  text-transform: uppercase;
  text-align: center;

  padding: ${RFValue(15)}px ${RFValue(0)}px ${RFValue(14)}px;
`;
