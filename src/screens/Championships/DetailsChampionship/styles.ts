import styled, { css } from 'styled-components/native';

import { RFValue } from '@utils/rf-value';

import { FallbackImage } from '@components/FallbackImage';

export const DetailChampionshipContainer = styled.View`
  flex: 1;

  background-color: ${({ theme }) => theme.COLORS.background};
`;

export const DetailChampionshipContent = styled.View`
  flex: 1;

  padding: ${RFValue(16)}px;
`;

export const DetailChampionshipTitle = styled.Text`
  width: ${RFValue(100)}%;

  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.BOLD};
    font-size: ${RFValue(theme.FONT_SIZE.LG)}px;
    color: ${theme.COLORS.text};
  `};

  font-weight: bold;

  margin-top: 10px;
`;

export const DetailChampionshipInfoContainer = styled.View`
  width: 100%;

  flex-direction: column;
  align-items: center;

  margin-top: ${RFValue(10)}px;
  margin-bottom: ${RFValue(20)}px;
`;

export const DetailChampionshipImageContainer = styled.View`
  width: 100%;
  height: ${RFValue(320)}px;

  overflow: hidden;

  border-radius: 10px;

  margin-top: ${RFValue(5)}px;
  margin-bottom: ${RFValue(20)}px;
`;

export const DetailChampionshipImage = styled(FallbackImage)`
  width: 100%;
  height: 100%;
` as unknown as typeof FallbackImage;

export const DetailChampionshipInfoDescription = styled.Text`
  width: 100%;

  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  font-size: ${({ theme }) => theme.FONT_SIZE.MD}px;
  /*
    Não tinha "color" nenhum antes - funcionava por acidente porque preto é
    a cor padrão de Text no React Native, mas isso não muda de tema nenhum.
    Adicionado explicitamente pra acompanhar claro/escuro.
  */
  color: ${({ theme }) => theme.COLORS.text};
  text-align: justify;

  margin-top: ${RFValue(10)}px;
  margin-bottom: ${RFValue(10)}px;
`;

// Antes "Local" e "Data" ficavam lado a lado numa linha só, com altura
// fixa (30px) - um texto mais longo (ex: "Ginásio Municipal de Caruaru")
// quebra em 2 linhas, e a altura fixa cortava a segunda (o Android, ao
// contrário do padrão do RN, corta por padrão o que ultrapassa os limites
// de uma View com altura definida). Cada informação agora ocupa a própria
// linha, largura cheia, sem altura fixa - o container cresce conforme o
// texto precisar, nunca corta.
export const DetailChampionshipInfoRow = styled.View`
  width: 100%;

  flex-direction: row;
  align-items: flex-start;

  margin-bottom: ${RFValue(8)}px;
`;

export const DetailChampionshipIconContainer = styled.View`
  margin-top: ${RFValue(2)}px;
`;

export const DetailChampionshipPlaceDateContent = styled.View`
  flex: 1;

  margin: 0 ${RFValue(4)}px;
`;

export const DetailChampionshipPlaceDateText = styled.Text`
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  font-size: ${({ theme }) => RFValue(theme.FONT_SIZE.SM)}px;
  /* Mesmo caso do DetailChampionshipInfoDescription acima - sem "color"
     nenhum, ficava preto só por ser o padrão do RN. */
  color: ${({ theme }) => theme.COLORS.text};
`;

export const DetailChampionshipLinkVideoButton = styled.TouchableOpacity.attrs({
  activeOpacity: 0.7,
})`
  margin-top: ${RFValue(10)}px;
  margin-bottom: ${RFValue(20)}px;
`;

export const DetailChampionshipLinkVideoButtonText = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.REGULAR};
    font-size: ${RFValue(theme.FONT_SIZE.MD)}px;
    color: ${theme.COLORS['blue-light-color']};
  `};

  text-align: justify;
`;

export const DetailChampionshipSubscriptionButton = styled.TouchableOpacity.attrs(
  {
    activeOpacity: 0.7,
  },
)`
  margin-top: ${RFValue(10)}px;
`;

export const DetailChampionshipSubscriptionButtonText = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.REGULAR};
    font-size: ${RFValue(theme.FONT_SIZE.MD)}px;
    color: ${theme.COLORS['blue-light-color']};
  `};

  font-weight: bold;

  text-align: justify;
  text-transform: uppercase;
`;
