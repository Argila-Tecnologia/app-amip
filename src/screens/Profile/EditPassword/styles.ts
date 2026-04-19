import styled from 'styled-components/native';
import { scale, verticalScale } from 'react-native-size-matters';

export const EditPasswordContainer = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.COLORS['gray-color-100']};
`;

export const EditPasswordContent = styled.View`
  flex: 1;

  padding: ${verticalScale(30)}px ${scale(16)}px;
`;

export const EditPasswordFooterContainer = styled.View`
  padding: ${verticalScale(20)}px 0;
`;
