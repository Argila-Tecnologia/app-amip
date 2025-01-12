import React from 'react';

import { useTheme } from 'styled-components/native';

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
  currentIndex,
  item,
  onCloseGalleryButton,
}: IHeaderImageGalleryProps) {
  const theme = useTheme();

  return (
    <HeaderImageGalleryContainer>
      <HeaderImageGalleryContent>
        <CloseButton onPress={onCloseGalleryButton}>
          <Feather name="x" size={25} color={theme.COLORS['white-color']} />
        </CloseButton>
      </HeaderImageGalleryContent>
    </HeaderImageGalleryContainer>
  );
}
