import { Feather } from '@expo/vector-icons';

import styled, { css } from 'styled-components/native';

import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

interface IContainerProps {
  loading: boolean;
}

export const ButtonContainer = styled.TouchableOpacity<IContainerProps>`
  width: 100%;
  height: ${verticalScale(50)}px;

  align-items: center;
  justify-content: center;

  background: ${({ theme }) => theme.COLORS['green-color']};

  border-radius: ${moderateScale(10)}px;

  margin-top: ${verticalScale(8)}px;

  ${({ loading }) =>
    loading &&
    css`
      opacity: 0.5;
    `}
`;

export const ButtonText = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.BOLD};
    font-size: ${moderateScale(theme.FONT_SIZE.LG)}px;
    color: ${theme.COLORS['white-color']};
  `};

  text-transform: uppercase;
`;

export const Icon = styled(Feather)`
  margin-right: ${scale(16)}px;
`;
