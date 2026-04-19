import styled, { css } from 'styled-components/native';

import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

export const HeaderContainer = styled.View`
  width: 100%;

  flex-direction: row;
  align-items: center;

  background-color: ${({ theme }) => theme.COLORS['blue-dark-color']};

  padding: ${verticalScale(0)}px ${scale(8)}px ${verticalScale(15)}px;
`;

export const HeaderBackButton = styled.TouchableOpacity.attrs({
  activeOpacity: 0.7,
})`
  flex-direction: row;
  align-items: center;

  margin-right: ${scale(10)}px;
`;

export const HeaderTitle = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.BOLD};
    font-size: ${moderateScale(theme.FONT_SIZE.LG)}px;
    color: ${theme.COLORS['white-color']};
  `};

  margin-left: ${scale(5)}px;
`;
