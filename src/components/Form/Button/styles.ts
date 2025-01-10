import styled, { css } from 'styled-components/native';

import { Feather } from '@expo/vector-icons';

import { RFValue } from 'react-native-responsive-fontsize';

interface IContainerProps {
  loading: boolean;
}

export const Container = styled.TouchableOpacity<IContainerProps>`
  width: 100%;
  height: ${RFValue(60)}px;
  background: ${({ theme }) => theme.colors['blue-dark-color']};
  border-radius: ${RFValue(10)}px;
  margin-top: ${RFValue(8)}px;

  justify-content: center;
  align-items: center;

  ${({ loading }) =>
    loading &&
    css`
      opacity: 0.5;
    `}
`;

export const ButtonText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.medium};
  color: ${({ theme }) => theme.colors['white-color']};
  font-size: ${RFValue(18)}px;
  text-transform: uppercase;
`;

export const Icon = styled(Feather)`
  margin-right: ${RFValue(16)}px;
`;
