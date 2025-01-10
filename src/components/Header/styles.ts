import styled from 'styled-components/native';

import { RFValue } from 'react-native-responsive-fontsize';

export const Container = styled.View`
  width: 100%;
  height: ${RFValue(70)}px;

  flex-direction: row;
  align-items: center;

  background-color: ${({ theme }) => theme.colors['blue-dark-color']};

  padding: ${RFValue(0)}px ${RFValue(8)}px;
`;

export const BackButton = styled.TouchableOpacity.attrs({
  activeOpacity: 0.7,
})`
  margin-right: ${RFValue(10)}px;
`;

export const Title = styled.Text`
  font-family: ${({ theme }) => theme.fonts.medium};
  font-size: ${RFValue(22)}px;
  color: ${({ theme }) => theme.colors['white-color']};
`;
