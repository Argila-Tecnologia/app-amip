import React from 'react';

import { useTheme } from 'styled-components/native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Feather } from '@expo/vector-icons';

import {
  CloseButton,
  HeaderImageGalleryContainer,
  HeaderImageGalleryContent,
} from './styles';

interface ImageObject {
  id?: string | number;
  thumbUrl?: string;
  url: string;
}

interface IHeaderImageGalleryProps {
  currentIndex?: number;
  item?: ImageObject;
  onCloseGalleryButton: () => void;
}

export function HeaderImageGallery({
  onCloseGalleryButton,
}: IHeaderImageGalleryProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const paddingTop = insets.top;

  return (
    <HeaderImageGalleryContainer style={{ paddingTop }}>
      <HeaderImageGalleryContent>
        <CloseButton onPress={onCloseGalleryButton}>
          <Feather name="x" size={25} color={theme.COLORS['white-color']} />
        </CloseButton>
      </HeaderImageGalleryContent>
    </HeaderImageGalleryContainer>
  );
}
