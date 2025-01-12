import styled from 'styled-components/native';

import { RFValue } from 'react-native-responsive-fontsize';

export const Container = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;

  height: ${RFValue(50)}px;
  background-color: ${({ theme }) => theme.COLORS['background-color']};

  padding: 14px;
`;

export const Title = styled.Text`
  color: ${({ theme }) => theme.COLORS['black-color']};
`;
