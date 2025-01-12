import styled from 'styled-components/native';

import { RFValue } from 'react-native-responsive-fontsize';

export const HeaderImageGalleryContainer = styled.View`
  flex: 1;
`;

export const HeaderImageGalleryContent = styled.View`
  height: ${RFValue(50)}px;

  flex-direction: row;
  align-items: center;
  justify-content: flex-end;

  background-color: ${({ theme }) => theme.COLORS['black-color']};

  margin-top: 10px;

  padding-left: 5px;
  padding-right: 5px;
`;

export const Title = styled.Text`
  color: ${({ theme }) => theme.COLORS['black-color']};
`;

export const CloseButton = styled.TouchableOpacity.attrs({
  activeOpacity: 0.7,
})`
  padding: ${RFValue(10)}px;
`;
