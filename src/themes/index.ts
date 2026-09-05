import light from './light';
import dark from './dark';

// Mantido como default export (era o único tema até aqui) pra não quebrar
// nenhum lugar que ainda importa "themes" direto - o tema ativo de verdade
// passa a vir de ThemeModeProvider (src/hooks/theme.tsx), não mais daqui.
export default light;

export { light, dark };

// "typeof light" sozinho não serve aqui: como light.ts e dark.ts usam
// "as const", cada cor vira um tipo literal (ex: '#F5F5F5'), então light e
// dark acabam sendo dois tipos incompatíveis entre si (mesmas chaves,
// literais diferentes). Record<..., string> generaliza os valores de COLORS
// pra "string comum", o suficiente pra ThemeModeProvider poder alternar
// entre os dois sem o TypeScript reclamar.
export type ITheme = {
  COLORS: Record<keyof typeof light.COLORS, string>;
  FONT_FAMILY: typeof light.FONT_FAMILY;
  FONT_SIZE: typeof light.FONT_SIZE;
};
