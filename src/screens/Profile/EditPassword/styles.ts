import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const EditPasswordContainer = styled.View`
  flex: 1;

  background-color: ${({ theme }) => theme.COLORS['gray-color-100']};
`;

export const EditPasswordContent = styled.View`
  flex: 1;

  padding: ${RFValue(30)}px ${RFValue(16)}px;
`;

export const EditPasswordFooterContainer = styled.View`
  padding: ${RFValue(20)}px 0;
`;
