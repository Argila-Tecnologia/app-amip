import styled, { css } from 'styled-components/native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

export const ContactContainer = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.COLORS['gray-color-100']};
`;

export const ContactContent = styled.View`
  flex: 1;

  padding: ${verticalScale(50)}px ${scale(30)}px;
`;

interface IContactButtonProps {
  color: 'blue' | 'green';
}

export const ContactButton = styled.TouchableOpacity.attrs<IContactButtonProps>(
  {
    activeOpacity: 0.7,
  },
)`
  flex-direction: row;
  align-items: center;

  background-color: ${({ theme, color }) =>
    color === 'blue'
      ? theme.COLORS['blue-dark-color']
      : theme.COLORS['green-dark-color']};

  border-radius: ${moderateScale(10)}px;

  margin-bottom: ${verticalScale(30)}px;

  padding: ${verticalScale(15)}px ${scale(15)}px;
`;

export const ContactIcon = styled.View`
  margin-right: ${scale(20)}px;
`;

export const ContactText = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.REGULAR};
    font-size: ${moderateScale(theme.FONT_SIZE.MD)}px;
    color: ${theme.COLORS['white-color']};
  `}
`;
