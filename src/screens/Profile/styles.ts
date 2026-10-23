import styled, { css } from 'styled-components/native';

import { RFValue } from '@utils/rf-value';

import { FallbackImage } from '@components/FallbackImage';

export const ProfileContainer = styled.View`
  flex: 1;

  background-color: ${({ theme }) => theme.COLORS.background};
`;

export const ProfileHeader = styled.View`
  width: 100%;
  /* height: ${RFValue(70)}px; */

  flex-direction: row;

  background-color: ${({ theme }) => theme.COLORS['blue-dark-color']};

  padding: ${RFValue(0)}px ${RFValue(8)}px ${RFValue(15)}px;
`;

export const ProfileHeaderTitleContainer = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
`;

// Sem seta de "voltar" - Perfil agora é uma aba (igual Notícias/
// Campeonatos/Museu, nenhuma delas tem botão de voltar no header).
export const ProfileHeaderTitle = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.BOLD};
    font-size: ${RFValue(theme.FONT_SIZE.LG)}px;
    color: ${theme.COLORS['white-color']};
  `};

  margin-left: ${RFValue(16)}px;
`;

export const ProfileHeaderLogoutContainer = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;

  margin-right: ${RFValue(10)}px;
`;

export const ProfileHeaderLogoutButton = styled.TouchableOpacity``;

export const ProfileContent = styled.View`
  flex: 1;

  padding: 0 ${RFValue(16)}px;
`;

export const ProfileAvatarImageNameContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;

  margin-top: ${RFValue(25)}px;
`;

export const ProfileAvatarButton = styled.TouchableOpacity.attrs({
  activeOpacity: 0.7,
})`
  width: ${RFValue(166)}px;
  height: ${RFValue(166)}px;

  /*
    Era 'surface' (inverte com o tema) - trocado pra 'blue-dark-color' fixo
    de propósito: o avatar (com foto real ou com as iniciais do
    FallbackImage, ver initialsBackgroundColor abaixo) agora é um acento de
    marca, igual ao header - não deve mudar de cor com o tema claro/escuro.
    Só aparece de fato enquanto a foto está subindo (o Loading cobre o
    resto do círculo); sem foto real, quem preenche o círculo é o
    FallbackImage por baixo, não este fundo.
  */
  background-color: ${({ theme }) => theme.COLORS['blue-dark-color']};

  border-radius: ${RFValue(98)}px;

  margin-top: ${RFValue(32)}px;

  position: relative;
`;

export const ProfileAvatarImage = styled(FallbackImage)`
  width: ${RFValue(166)}px;
  height: ${RFValue(166)}px;

  border-radius: ${RFValue(98)}px;

  align-self: center;
` as unknown as typeof FallbackImage;

export const ProfileAvatarCamera = styled.View`
  width: ${RFValue(50)}px;
  height: ${RFValue(50)}px;

  position: absolute;
  right: 0;
  bottom: 5px;

  background-color: ${({ theme }) => theme.COLORS['black-color']};

  border-radius: 25px;

  align-items: center;
  justify-content: center;

  margin-right: ${RFValue(5)}px;
`;

export const ProfileName = styled.Text`
  margin-top: ${RFValue(30)}px;

  font-size: ${RFValue(30)}px;
  color: ${({ theme }) => theme.COLORS.text};
`;

export const ProfilePlayerLogoutAvatarImage = styled.View`
  width: ${RFValue(166)}px;
  height: ${RFValue(166)}px;

  border-radius: ${RFValue(98)}px;

  align-items: center;
  justify-content: center;

  /* margin-top: ${RFValue(10)}px; */

  /* Sem uso hoje (dead style) - mesma decisão de 'surface' aplicada acima
     em ProfileAvatarButton, por consistência caso volte a ser usado. */
  background-color: ${({ theme }) => theme.COLORS.surface};
`;

export const ProfileOptionsContent = styled.View`
  flex: 1;

  margin-top: ${RFValue(50)}px;
`;

// Card branco com borda ao redor de toda a lista - cada ProfileOptionButton
// vira uma linha dentro dele (separadas por border-bottom, ver abaixo),
// igual ao mockup aprovado. 'surface' inverte com o tema (fica branco no
// claro, uma camada mais clara que o fundo no escuro); 'border' é o mesmo
// token cinza-claro já usado em campos de formulário.
export const ProfileOptionsCard = styled.View`
  background-color: ${({ theme }) => theme.COLORS.surface};

  border-width: 1px;
  border-color: ${({ theme }) => theme.COLORS.border};
  border-radius: ${RFValue(14)}px;

  overflow: hidden;
`;

export const ProfileOptionButton = styled.TouchableOpacity.attrs({
  activeOpacity: 0.7,
})`
  flex-direction: row;
  align-items: center;

  padding: ${RFValue(15)}px ${RFValue(16)}px;

  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.COLORS.border};

  /*
    Última linha do card não tem borda embaixo (senão sobraria uma faixa
    cinza encostada no cantos arredondados do ProfileOptionsCard).
  */
  &:last-child {
    border-bottom-width: 0;
  }
`;

// Caixinha colorida atrás do ícone, do jeito que o mockup mostra - $tintColor
// é a cor de fundo (passada com baixa opacidade, ex: '#0c0c5b1a'), o ícone
// em si continua na cor sólida correspondente (ver uso em index.tsx).
export const ProfileOptionButtonIcon = styled.View<{ $tintColor: string }>`
  width: ${RFValue(34)}px;
  height: ${RFValue(34)}px;

  align-items: center;
  justify-content: center;

  background-color: ${({ $tintColor }) => $tintColor};
  border-radius: ${RFValue(10)}px;

  margin-right: ${RFValue(14)}px;
`;

export const ProfileOptionButtonTitle = styled.Text<{ $bold?: boolean }>`
  flex: 1;

  font-size: ${({ theme }) => RFValue(theme.FONT_SIZE.LG)}px;
  color: ${({ theme }) => theme.COLORS.text};
  font-weight: ${({ $bold }) => ($bold ? 'bold' : 'normal')};
`;

export const ProfileRemoveAccountButton = styled.TouchableOpacity`
  height: 50px;

  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.COLORS['red-color']};

  border-radius: 10px;

  margin-top: 50px;

  padding: 10px;
`;

export const ProfileRemoveAccountText = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.REGULAR};
    font-size: ${RFValue(theme.FONT_SIZE.MD)}px;
    color: ${theme.COLORS['white-color']};
  `};
`;
