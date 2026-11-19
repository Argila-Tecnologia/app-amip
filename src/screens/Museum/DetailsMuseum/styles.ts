import styled, { css } from 'styled-components/native';

import { RFValue } from '@utils/rf-value';

import { FallbackImage } from '@components/FallbackImage';

export const DetailMuseumContainer = styled.View`
  flex: 1;

  background-color: ${({ theme }) => theme.COLORS.background};
`;

export const DetailMuseumContent = styled.View`
  flex: 1;

  padding: ${RFValue(16)}px;
`;

export const DetailMuseumTitle = styled.Text`
  width: 100%;

  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.BOLD};
    font-size: ${RFValue(theme.FONT_SIZE.LG)}px;
    color: ${theme.COLORS.text};
  `};

  font-weight: bold;
`;

export const DetailMuseumItemMuseum = styled.View`
  width: 100%;

  flex-direction: column;
  align-items: center;

  /* margin: ${RFValue(10)}px ${RFValue(0)}px ${RFValue(20)}px ${RFValue(
    0,
  )}px; */
`;

export const DetailMuseumImageContainer = styled.View`
  width: 100%;
  height: ${RFValue(400)}px;

  border-radius: 10px;

  overflow: hidden;

  margin: ${RFValue(20)}px 0;
`;

export const DetailMuseumImage = styled(FallbackImage)`
  width: 100%;
  height: 100%;
` as unknown as typeof FallbackImage;

// DetailMuseumMuseumDescription (styled.Text puro) foi substituído por
// <Markdown> na tela (2026-11-19, ver CLAUDE.md "Editor de texto: largura,
// autolink e renderização markdown") - mesmo motivo da tela de Campeonato.

export const DetailMuseumGalleryImages = styled.View`
  width: 100%;
`;
