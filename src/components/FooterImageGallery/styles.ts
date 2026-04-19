import styled from 'styled-components/native';

import { verticalScale } from 'react-native-size-matters';

export const Container = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;

  height: ${verticalScale(50)}px;
  background-color: ${({ theme }) => theme.COLORS['background-color']};

  padding: 14px;
`;

export const Title = styled.Text`
  color: ${({ theme }) => theme.COLORS['black-color']};
`;
