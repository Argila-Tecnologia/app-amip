import styled, { css } from 'styled-components/native';

import { RFValue } from 'react-native-responsive-fontsize';

export const ContactContainer = styled.View`
  flex: 1;
`;

export const ContactContent = styled.View`
  flex: 1;

  padding: ${RFValue(50)}px ${RFValue(30)}px;
`;

export const ContactButton = styled.TouchableOpacity.attrs({
  activeOpacity: 0.7,
})`
  flex-direction: row;
  align-items: center;

  margin-bottom: ${RFValue(10)}px;

  padding: ${RFValue(10)}px;
`;

export const ContactIcon = styled.View`
  width: ${RFValue(35)}px;
  height: ${RFValue(35)}px;

  margin-right: ${RFValue(10)}px;
`;

export const ContactText = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.REGULAR};
    font-size: ${RFValue(theme.FONT_SIZE.MD)}px;
    color: ${theme.COLORS['black-color']};
  `}
`;
