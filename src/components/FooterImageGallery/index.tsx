import React from 'react';

import { Container, Title } from './styles';

interface IFooterImageGalleryProps {
  currentIndex: number;
  total: number;
}

export function FooterImageGallery({
  currentIndex,
  total,
}: IFooterImageGalleryProps) {
  return (
    <Container>
      <Title>
        {currentIndex + 1}/{total}
      </Title>
    </Container>
  );
}
