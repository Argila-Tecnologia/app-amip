import { useEffect, useState } from 'react';

import { StyleProp, StyleSheet, ViewStyle } from 'react-native';

import { Image, ImageProps } from 'expo-image';

import styled, { css } from 'styled-components/native';

import logoImage from '../../assets/AMIP_LOGO.png';

interface IFallbackImageProps extends Omit<ImageProps, 'source'> {
  // Mesmo formato que os componentes já passavam pra "source" do
  // expo-image (source={{ uri: algumaCoisa }}) - só que aqui "uri" pode
  // ser null/undefined/string vazia sem problema, ao contrário do
  // <Image> puro.
  source?: { uri?: string | null } | number;
  // Quando informado, o fallback mostra as iniciais desse nome (ex:
  // "João Paulo" -> "JP") em vez da logo da AMIP - usado só pro avatar do
  // atleta (Profile, HeaderApp), que tem um nome pra derivar as iniciais.
  // Sem "name" (News, Championships, Museum, que mostram imagem de
  // conteúdo, não de pessoa), mantém a logo como antes.
  name?: string;
}

// Primeira letra do primeiro e do último nome (ex: "João Paulo" -> "JP");
// nome com uma palavra só usa a primeira letra dela.
function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return '';
  }

  if (words.length === 1) {
    return words[0][0].toUpperCase();
  }

  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

// A caixa do placeholder herda width/height/border-radius de quem chamou
// (styled(FallbackImage)`...`), mas o conteúdo interno (a logo) fica
// centralizado numa fração do tamanho, em vez de esticar - do contrário,
// um contêiner pensado pra foto grande (ex: banner de 320px) deixava a
// logo enorme e distorcida ao tentar preencher tudo com "cover".
const FallbackContainer = styled.View`
  width: 100%;
  height: 100%;

  align-items: center;
  justify-content: center;

  /*
    A logo (55% do espaço) nunca precisou disso, mas as iniciais (com
    "adjustsFontSizeToFit") podem medir um pouco maior que o contêiner
    antes de encolher - sem isso, a letra vazava pra fora do círculo do
    avatar (borderRadius vem do "style" aplicado aqui, mas sem
    overflow:hidden ele não recorta o conteúdo).
  */
  overflow: hidden;

  /*
    Era 'gray-color-200' fixo - criado antes de existir tema claro/escuro,
    então ficava sempre branco/quase-branco, inclusive no tema dark (esse
    componente é usado em News, Championships, Museum, Profile e no avatar
    do HeaderApp - o mesmo bug aparecia em todos eles). 'surface' inverte
    com o tema, mesmo token já usado nos campos de formulário e nos
    círculos de avatar (ver Profile/styles.ts).
  */
  background-color: ${({ theme }) => theme.COLORS.surface};
`;

const InitialsText = styled.Text`
  width: 100%;

  text-align: center;

  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.BOLD};
    color: ${theme.COLORS.text};
  `};
`;

// Substitui o uso direto de <Image> do expo-image nas telas que mostram
// foto vinda da API (campeonato, notícia, museu, avatar do atleta). Antes,
// cada tela só renderizava a imagem "se tiver image_url" - sem imagem, o
// espaço simplesmente sumia, sem placeholder nenhum; e não existia
// tratamento pra quando a imagem TEM url mas falha ao carregar (sem
// internet, link quebrado, etc.), que ficava só com um ícone de erro
// nativo. Aqui os dois casos caem no mesmo lugar: mostra a logo da AMIP
// (já existente em assets/), pequena e centralizada num fundo neutro, sem
// nunca esticar/distorcer.
export function FallbackImage({
  source,
  style,
  contentFit,
  name,
  ...rest
}: IFallbackImageProps) {
  const uri = typeof source === 'object' ? source?.uri : undefined;

  const [hasLoadError, setHasLoadError] = useState(false);

  // Se a tela troca de item (ex: item diferente de uma lista reusando o
  // mesmo componente), reseta o estado de erro - senão uma imagem nova
  // que carregaria bem ficaria presa mostrando o placeholder por causa do
  // erro do item anterior.
  useEffect(() => {
    setHasLoadError(false);
  }, [uri]);

  const isFallback = !uri || hasLoadError;

  if (isFallback) {
    // "style" aqui é o que styled(FallbackImage) calculou (width/height/
    // border-radius definidos por cada tela) - aplicado na caixa externa,
    // não na logo, que fica só numa fração fixa do espaço disponível.
    // O cast é seguro: na prática são sempre propriedades de layout
    // (largura/altura/raio de borda) compatíveis com View, só o tipo
    // ImageStyle do expo-image declara um campo (transformOrigin) que o
    // TS não reconhece como compatível com ViewStyle.
    //
    // Pro tamanho da fonte das iniciais, calcula como fração da largura
    // real do avatar (166px no Profile, 50px no HeaderApp) em vez de usar
    // "adjustsFontSizeToFit" - no Android esse auto-encolhimento não
    // respeitou o contêiner de forma confiável (texto vazava pra fora do
    // círculo mesmo com overflow:hidden), então um cálculo direto e
    // previsível é mais seguro aqui.
    const flattenedStyle = StyleSheet.flatten(style) as ViewStyle | undefined;
    const avatarSize =
      typeof flattenedStyle?.width === 'number' ? flattenedStyle.width : 48;

    return (
      <FallbackContainer style={style as StyleProp<ViewStyle>}>
        {name ? (
          <InitialsText style={{ fontSize: avatarSize * 0.4 }}>
            {getInitials(name)}
          </InitialsText>
        ) : (
          <Image
            source={logoImage}
            contentFit="contain"
            style={{ width: '55%', height: '55%' }}
            alt=""
          />
        )}
      </FallbackContainer>
    );
  }

  return (
    <Image
      source={{ uri }}
      contentFit={contentFit}
      style={style}
      onError={() => setHasLoadError(true)}
      alt=""
      {...rest}
    />
  );
}
