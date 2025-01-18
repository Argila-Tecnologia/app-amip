import styled from 'styled-components/native';

import { RFValue } from 'react-native-responsive-fontsize';

import { BottomSheetView } from '@gorhom/bottom-sheet';

export const ChooseTakePhotoModalContent = styled(BottomSheetView)`
  height: ${RFValue(100)}px;

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
  width: ${RFValue(2)}px;
  height: ${RFValue(50)}px;

  background-color: ${({ theme }) => theme.COLORS['gray-color-400']};
`;
