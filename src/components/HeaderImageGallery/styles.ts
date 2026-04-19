import styled from 'styled-components/native';

import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

export const HeaderImageGalleryContainer = styled.View`
  flex: 1;
`;

export const HeaderImageGalleryContent = styled.View`
  height: ${verticalScale(50)}px;

  flex-direction: row;
  align-items: center;
  justify-content: flex-end;

  background-color: ${({ theme }) => theme.COLORS['black-color']};

  margin-top: ${verticalScale(10)}px;

  padding-left: ${scale(5)}px;
  padding-right: ${scale(5)}px;
`;

export const Title = styled.Text`
  color: ${({ theme }) => theme.COLORS['white-color']};
  font-size: ${moderateScale(14)}px;
`;

export const CloseButton = styled.TouchableOpacity.attrs({
  activeOpacity: 0.7,
})`
  padding: ${scale(10)}px;
`;
