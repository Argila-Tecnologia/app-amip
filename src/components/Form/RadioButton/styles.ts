import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;

  flex-direction: row;
  padding-left: 5px;

  gap: 15;

  border: 1px solid red;
`;

export const RadioGroupButton = styled(TouchableOpacity)`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.COLORS['black-color']};
  padding: 2px;
`;

export const RadioFill = styled.View`
  width: '100%';
  height: '100%';
  border-radius: 10px;
  background-color: ${({ theme }) => theme.COLORS['green-color']};
`;

export const Title = styled.Text`
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  font-size: ${({ theme }) => theme.FONT_SIZE.MD}px;
  color: ${({ theme }) => theme.COLORS['black-color']};
`;
