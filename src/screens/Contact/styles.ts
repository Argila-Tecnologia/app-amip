import styled, { css } from 'styled-components/native';

import { RFValue } from '@utils/rf-value';

export const ContactContainer = styled.View`
  flex: 1;

  background-color: ${({ theme }) => theme.COLORS.background};
`;

export const ContactContent = styled.View`
  flex: 1;

  padding: ${RFValue(50)}px ${RFValue(30)}px;
`;

interface IContactButtonProps {
  color: 'blue' | 'green';
}

export const ContactButton = styled.TouchableOpacity.attrs<IContactButtonProps>(
  {
    activeOpacity: 0.7,
  },
)`
  /* height: 60px; */

  flex-direction: row;
  align-items: center;

  background-color: ${({ theme, color }) =>
    color === 'blue'
      ? theme.COLORS['blue-dark-color']
      : theme.COLORS['green-dark-color']};

  border-radius: 10px;

  margin-bottom: ${RFValue(30)}px;

  padding: ${RFValue(15)}px;
`;

export const ContactIcon = styled.View`
  margin-right: ${RFValue(20)}px;
`;

export const ContactText = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.REGULAR};
    font-size: ${RFValue(theme.FONT_SIZE.MD)}px;
    color: ${theme.COLORS['white-color']};
  `}
`;
