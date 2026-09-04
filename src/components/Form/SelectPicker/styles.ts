import styled from 'styled-components/native';

import { RFValue } from '@utils/rf-value';

// Envolve o RNPickerSelect + ErrorText - o picker sozinho não pode ter um
// irmão, já que quem usa o SelectPicker só espera um elemento de volta.
export const Wrapper = styled.View`
  width: 100%;
`;

// Antes só a borda ficava vermelha em erro, sem nenhum texto explicando o
// motivo - o usuário não tinha como saber por que o formulário não enviava.
export const ErrorText = styled.Text`
  color: ${({ theme }) => theme.COLORS['red-color']};
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  font-size: ${RFValue(12)}px;
  margin-top: ${RFValue(4)}px;
`;
