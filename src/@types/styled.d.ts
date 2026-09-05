import 'styled-components/native';

// ITheme (não "typeof light" nem "typeof dark" direto) porque light.ts e
// dark.ts usam "as const" - cada um vira um tipo com valores literais
// diferentes pra cada cor, e o app precisa trocar entre os dois em tempo de
// execução (ThemeModeProvider). ITheme generaliza esses valores pra
// "string comum", o suficiente pra qualquer um dos dois temas satisfazer
// esse tipo.
import { ITheme } from '../themes';

declare module 'styled-components/native' {
  // CRIAR UMA TIPAGEM BASEADA NO CONTEÚDO DO MEU TEMA
  type ThemeType = ITheme;

  /**
   * EXTENDER DO TEMA PADRÃO DO STYLED COMPONENT
   * DIZENDO QUAL É O TIPO DO TEMA QUE ESTOU UTILIZANDO
   * QUAL O CONTEÚDO DO TEMA
   */
  export interface DefaultTheme extends ThemeType {}
}
