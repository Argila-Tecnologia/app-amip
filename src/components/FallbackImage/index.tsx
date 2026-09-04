import { useEffect, useState } from 'react';

import { StyleProp, ViewStyle } from 'react-native';

import { Image, ImageProps } from 'expo-image';

import styled from 'styled-components/native';

import logoImage from '../../assets/AMIP_LOGO.png';

interface IFallbackImageProps extends Omit<ImageProps, 'source'> {
  // Mesmo formato que os componentes já passavam pra "source" do
  // expo-image (source={{ uri: algumaCoisa }}) - só que aqui "uri" pode
  // ser null/undefined/string vazia sem problema, ao contrário do
  // <Image> puro.
  source?: { uri?: string | null } | number;
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

  background-color: ${({ theme }) => theme.COLORS['gray-color-200']};
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
    return (
      <FallbackContainer style={style as StyleProp<ViewStyle>}>
        <Image
          source={logoImage}
          contentFit="contain"
          style={{ width: '55%', height: '55%' }}
          alt=""
        />
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
