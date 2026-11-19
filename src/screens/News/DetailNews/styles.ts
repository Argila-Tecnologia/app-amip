import styled, { css } from 'styled-components/native';

import { RFValue } from '@utils/rf-value';

import { FallbackImage } from '@components/FallbackImage';

export const DetailsNewsContainer = styled.View`
  flex: 1;

  background-color: ${({ theme }) => theme.COLORS.background};
`;

export const DetailsNewsContent = styled.View`
  flex: 1;

  padding: ${RFValue(16)}px;
`;

export const DetailsNewsTitle = styled.Text`
  width: 100%;

  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.BOLD};
    font-size: ${RFValue(theme.FONT_SIZE.LG)}px;
    color: ${theme.COLORS.text};
  `};

  font-weight: bold;
`;

export const BoxNews = styled.View`
  width: 100%;

  flex-direction: column;
  align-items: center;

  margin: ${RFValue(15)}px 0;

  /* margin: ${RFValue(10)}px ${RFValue(15)}px ${RFValue(20)}px ${RFValue(
    15,
  )}px; */
`;

export const DetailNewsImageContainer = styled.View`
  width: 100%;
  height: ${RFValue(200)}px;

  background-color: aqua;

  border-radius: 10px;

  overflow: hidden;

  margin-bottom: ${RFValue(10)}px;
`;

export const DetailNewsImage = styled(FallbackImage)`
  width: 100%;
  height: 100%;
` as unknown as typeof FallbackImage;

// DetailNewsDescription (styled.Text puro) foi substituído por <Markdown>
// na tela (2026-11-19, ver CLAUDE.md "Editor de texto: largura, autolink e
// renderização markdown") - mesmo motivo das telas de Campeonato/Museu.

export const DetailNewsLinkVideoButton = styled.TouchableOpacity.attrs({
  activeOpacity: 0.7,
})`
  margin-top: ${RFValue(10)}px;
`;

export const DetailNewsLinkVideoButtonText = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.REGULAR};
    font-size: ${RFValue(theme.FONT_SIZE.SM)}px;
    color: ${theme.COLORS.text};
  `};

  text-align: justify;
`;

export const DetailNewsLinkVideoButtonTextLink = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.BOLD};
    font-size: ${RFValue(theme.FONT_SIZE.SM)}px;
    color: ${theme.COLORS['green-color']};
  `};

  text-align: justify;
`;
