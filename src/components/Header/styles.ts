import styled, { css } from 'styled-components/native';

import { RFValue } from '@utils/rf-value';

export const HeaderContainer = styled.View`
  width: 100%;
  /* height: ${RFValue(70)}px; */

  flex-direction: row;
  align-items: center;

  background-color: ${({ theme }) => theme.COLORS['blue-dark-color']};

  padding: ${RFValue(0)}px ${RFValue(8)}px ${RFValue(15)}px;
`;

export const HeaderBackButton = styled.TouchableOpacity.attrs({
  activeOpacity: 0.7,
})`
  flex-direction: row;
  align-items: center;

  margin-right: ${RFValue(10)}px;
`;

export const HeaderTitle = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.BOLD};
    font-size: ${RFValue(theme.FONT_SIZE.LG)}px;
    color: ${theme.COLORS['white-color']};
  `};

  margin-left: ${RFValue(5)}px;
`;
