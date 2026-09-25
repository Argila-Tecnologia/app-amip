import { useEffect, useRef, useMemo, useCallback } from 'react';

import BottomSheet from '@gorhom/bottom-sheet';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

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

const INITIAL_POSITION_BOTTOM_SHEET = 10;

export function ChooseTakePhotoModal({
  isOpenModal,
  onCloseModal,
  onTakePhotoCamera,
  onTakePhotoGallery,
}: IChooseTakePhotoModalProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

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
      // Sem isso, os botões de câmera/galeria ficavam colados (às vezes
      // parcialmente cobertos) pela barra de navegação de 3 botões do
      // Android - a folha não sabia nada sobre a área do sistema embaixo
      // dela. "bottomInset" é o jeito documentado da própria lib pra
      // resolver isso, alimentado pelo inset real do dispositivo.
      bottomInset={insets.bottom}
      // Sem isso o fundo da folha fica sempre branco (padrão da própria
      // lib @gorhom/bottom-sheet) - precisa ser explícito pra acompanhar
      // tema, senão os ícones abaixo (agora com cor de tema) ficariam
      // invisíveis no escuro sobre um fundo que nunca escurece.
      backgroundStyle={{ backgroundColor: theme.COLORS.surface }}
      onChange={(index) => {
        if (index === 0) {
          onCloseModal();
        }
      }}
    >
      {/* <BottomSheetView style={{ flex: 1 }}> */}
      <ChooseTakePhotoModalContent>
        <BoxOptionsTakePhoto>
          <TakePhotoButton onPress={onTakePhotoCamera}>
            <MaterialIcons
              name="photo-camera"
              size={50}
              color={theme.COLORS.text}
            />
          </TakePhotoButton>

          <Divisor />

          <TakePhotoButton onPress={onTakePhotoGallery}>
            <MaterialIcons
              name="collections"
              size={50}
              color={theme.COLORS.text}
            />
          </TakePhotoButton>
        </BoxOptionsTakePhoto>
      </ChooseTakePhotoModalContent>
      {/* </BottomSheetView> */}
    </BottomSheet>
  );
}
