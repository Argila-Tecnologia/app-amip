import BottomSheet from '@gorhom/bottom-sheet';

import { useEffect, useRef, useMemo, useCallback } from 'react';

import { useTheme } from 'styled-components/native';

import { MaterialIcons } from '@expo/vector-icons';

import {
  ChooseTakePhotoModalContent,
  BoxOptionsTakePhoto,
  TakePhotoButton,
  Divisor,
} from './styles';

interface IChooseTakePhotoModalProps {
  isOpenModal: boolean;
  onCloseModal: () => void;
  onTakePhotoCamera: () => void;
  onTakePhotoGallery: () => void;
}

const INITIAL_POSITION_BOTTOM_SHEET = -1;

export function ChooseTakePhotoModal({
  isOpenModal,
  onCloseModal,
  onTakePhotoCamera,
  onTakePhotoGallery,
}: IChooseTakePhotoModalProps) {
  const theme = useTheme();

  const bottomSheetRef = useRef<BottomSheet>(null);

  // variables
  const snapPoints = useMemo(() => [1, 140], []);

  // FUNCTIONS
  const openModal = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  const closeModal = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);
  // END FUNCTIONS

  useEffect(() => {
    if (isOpenModal) {
      openModal();
    } else {
      closeModal();
    }
  }, [isOpenModal, openModal, closeModal]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={INITIAL_POSITION_BOTTOM_SHEET} // NOTE bottom sheet initial hidden
      snapPoints={snapPoints}
      // enableHandlePanningGesture={false}
      onChange={(index) => {
        if (index === 0) {
          onCloseModal();
        }
      }}
    >
      <ChooseTakePhotoModalContent>
        <BoxOptionsTakePhoto>
          <TakePhotoButton onPress={onTakePhotoCamera}>
            <MaterialIcons
              name="photo-camera"
              size={50}
              color={theme.COLORS['black-color']}
            />
          </TakePhotoButton>

          <Divisor />

          <TakePhotoButton onPress={onTakePhotoGallery}>
            <MaterialIcons
              name="collections"
              size={50}
              color={theme.COLORS['black-color']}
            />
          </TakePhotoButton>
        </BoxOptionsTakePhoto>
      </ChooseTakePhotoModalContent>
    </BottomSheet>
  );
}
