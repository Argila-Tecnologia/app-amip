export default {
  COLORS: {
    // Cores de marca - idênticas ao tema claro de propósito (ver
    // src/themes/light.ts). O escudo/dourado/verde da AMIP não deve mudar
    // de cor só porque o usuário trocou de tema, como o ícone do WhatsApp
    // continua verde no modo escuro dele.
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

    // Tokens de tema (claro/escuro) - únicos 5 valores que realmente
    // mudam em relação ao tema claro. Ver comentário completo em
    // src/themes/light.ts.
    background: '#12141C',
    surface: '#1B1E28',
    text: '#F2F0EC',
    'text-secondary': '#9598A6',
    border: '#2C2F3A',
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
