import styled from 'styled-components/native';

import { scale, verticalScale } from 'react-native-size-matters';

import { BottomSheetView } from '@gorhom/bottom-sheet';

export const ChooseTakePhotoModalContent = styled(BottomSheetView)`
  height: ${verticalScale(100)}px;

  flex: 1;
  justify-content: center;
`;

export const BoxOptionsTakePhoto = styled.View`
  flex-direction: row;

  align-items: center;
  justify-content: space-around;
`;

export const TakePhotoButton = styled.TouchableOpacity.attrs({
  activeOpacity: 0.7,
})``;

export const Divisor = styled.View`
  width: ${scale(2)}px;
  height: ${verticalScale(50)}px;

  background-color: ${({ theme }) => theme.COLORS['gray-color-400']};
`;
