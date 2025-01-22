import styled, { css } from 'styled-components/native';

import { Feather } from '@expo/vector-icons';

import { RFValue } from 'react-native-responsive-fontsize';

interface IContainerProps {
  loading: boolean;
}

export const ButtonContainer = styled.TouchableOpacity<IContainerProps>`
  width: 100%;
  height: ${RFValue(50)}px;

  align-items: center;
  justify-content: center;

  background: ${({ theme }) => theme.COLORS['green-color']};

  border-radius: ${RFValue(10)}px;

  margin-top: ${RFValue(8)}px;

  ${({ loading }) =>
    loading &&
    css`
      opacity: 0.5;
    `}
`;

export const ButtonText = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.BOLD};
    font-size: ${RFValue(theme.FONT_SIZE.LG)}px;
    color: ${theme.COLORS['white-color']};
  `};

  text-transform: uppercase;
`;

export const Icon = styled(Feather)`
  margin-right: ${RFValue(16)}px;
`;
