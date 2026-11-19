// Usado só nas prévias de lista (Museum/index.tsx, News/index.tsx) - lá o
// texto é cortado em poucas linhas (numberOfLines + ellipsizeMode, props de
// Text) pra caber no card. O componente <Markdown> (react-native-markdown-
// display) não é um Text só - é uma árvore de Views/Texts - então não dá
// pra truncar com essas props do jeito que a prévia já fazia. Em vez de
// montar um mini-parser markdown numa área que só precisa de um resumo em
// texto puro, isso aqui só remove a sintaxe mais comum (negrito/itálico,
// links, listas, cabeçalhos, barras de escape) pra sobrar um texto legível
// e truncável normalmente - não precisa ser perfeito, só não pode mostrar
// os símbolos crus (o mesmo problema original, só que na lista).
export function stripMarkdown(markdown: string): string {
  return markdown
    .replace(/\\([\\`*_{}[\]()#+\-.!])/g, '$1') // remove barra de escape (\- vira -)
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1') // imagem -> texto alternativo
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // link -> texto do link
    .replace(/^#{1,6}\s+/gm, '') // cabeçalhos
    .replace(/(\*\*|__)(.*?)\1/g, '$2') // negrito
    .replace(/(\*|_)(.*?)\1/g, '$2') // itálico
    .replace(/~~(.*?)~~/g, '$1') // tachado
    .replace(/^>\s?/gm, '') // citação
    .replace(/^[-*+]\s+/gm, '') // lista não ordenada
    .replace(/^\d+\.\s+/gm, '') // lista ordenada
    .replace(/`([^`]*)`/g, '$1') // código inline
    .trim();
}
