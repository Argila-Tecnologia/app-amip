export default {
  COLORS: {
    'primary-color': '#CCAC7c',
    'secondary-color': '#54341C',

    'background-color': '#F7F7F7',

    'blue-dark-color': '#0c0c5b',
    'blue-light-color': '#2ebfdc',

    'orange-color': '#e78848',
    'orange-light-color': '#F1A661',

    'light-brown-color': '#8F7668',

    'red-color': '#C53030',
    'red-dark-color': '#791F34',

    'white-color': '#FFFFFF',

    'green-color': '#23961E',
    'green-dark-color': '#138D75',
    'green-light-color': '#B6E388',

    'success-color': '#008000',
    'error-color': '#bc451b',

    'black-color': '#000000',
    'black-color-100': '#292929',

    'gray-color': '#777777',
    'gray-color-100': '#F5F5F5',
    'gray-color-200': '#ECECEC',
    'gray-color-300': '#d3d3d3',
    'gray-color-400': '#808080',

    'modal-color': '#121214e6',

    // Tokens de tema (claro/escuro) - ver proposta aprovada pelo usuário.
    // Diferente das cores acima (que são identidade de marca e não mudam
    // entre os temas), estas 5 são o que efetivamente muda entre claro e
    // escuro. Introduzidas como chaves NOVAS em vez de reaproveitar
    // 'black-color'/'white-color'/'gray-color-100' porque essas já são
    // usadas de forma ambígua pelo app (às vezes como texto sobre uma cor
    // fixa, que não deve mudar de tema; às vezes como fundo/superfície de
    // verdade, que deveria mudar) - migrar os usos existentes pra estes
    // tokens novos é um trabalho tela por tela, feito aos poucos depois
    // que essa infraestrutura estiver pronta.
    background: '#F5F5F5',
    surface: '#FFFFFF',
    text: '#000000',
    'text-secondary': '#808080',
    border: '#D3D3D3',
  },
  FONT_FAMILY: {
    REGULAR: 'RobotoSlab_400Regular',
    BOLD: 'RobotoSlab_500Medium',
  },
  FONT_SIZE: {
    SM: 14,
    MD: 16,
    LG: 18,
    XL: 24,
  },
} as const;
