import { Linking } from 'react-native';

import { useTheme } from 'styled-components/native';

import MarkdownDisplay from 'react-native-markdown-display';

import { RFValue } from '@utils/rf-value';

// Renderiza de verdade o markdown que o editor de texto do admin-web-amip
// salva (src/components/Editor, MDXEditor) - antes, toda tela deste app que
// mostra uma descrição (Campeonatos, Notícias, Museus) exibia a string
// markdown crua (`{item.description}`/`{item.content}`), então qualquer
// lista/negrito/parágrafo extra virava caracteres estranhos na tela (ex:
// "\- Categoria A" com a barra invertida de escape aparecendo literalmente,
// já que o MDXEditor escapa um "-" digitado como texto comum pra não virar
// lista sozinho na hora de salvar). Ver CLAUDE.md do admin-web-amip,
// "Editor de texto: largura, autolink e renderização markdown" (2026-11-19).
//
// `onLinkPress` sempre abre no navegador do sistema (Linking.openURL) -
// mesmo padrão já usado pro link de vídeo em DetailsChampionshipScreen -
// em vez de tentar navegar dentro do app. Retornar `false` cancela a
// abertura padrão da lib (que tentaria o mesmo via Linking internamente,
// sem tratamento de erro) - preferimos o catch explícito aqui.
type MarkdownProps = {
  children: string;
};

export function Markdown({ children }: MarkdownProps) {
  const theme = useTheme();

  const handleLinkPress = (url: string) => {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      }
    });

    return false;
  };

  return (
    <MarkdownDisplay
      onLinkPress={handleLinkPress}
      style={{
        body: {
          fontFamily: theme.FONT_FAMILY.REGULAR,
          fontSize: RFValue(theme.FONT_SIZE.MD),
          color: theme.COLORS.text,
        },
        heading1: {
          fontFamily: theme.FONT_FAMILY.BOLD,
          fontSize: RFValue(theme.FONT_SIZE.XL),
          color: theme.COLORS.text,
        },
        heading2: {
          fontFamily: theme.FONT_FAMILY.BOLD,
          fontSize: RFValue(theme.FONT_SIZE.LG),
          color: theme.COLORS.text,
        },
        heading3: {
          fontFamily: theme.FONT_FAMILY.BOLD,
          fontSize: RFValue(theme.FONT_SIZE.MD),
          color: theme.COLORS.text,
        },
        strong: {
          fontFamily: theme.FONT_FAMILY.BOLD,
        },
        em: {
          fontStyle: 'italic',
        },
        link: {
          color: theme.COLORS['blue-light-color'],
          textDecorationLine: 'underline',
        },
        bullet_list: {
          marginVertical: RFValue(4),
        },
        ordered_list: {
          marginVertical: RFValue(4),
        },
        list_item: {
          marginVertical: RFValue(2),
        },
        paragraph: {
          marginTop: 0,
          marginBottom: RFValue(8),
        },
        hr: {
          backgroundColor: theme.COLORS.border,
        },
        table: {
          borderColor: theme.COLORS.border,
        },
        th: {
          color: theme.COLORS.text,
        },
        td: {
          color: theme.COLORS.text,
        },
      }}
    >
      {children}
    </MarkdownDisplay>
  );
}
