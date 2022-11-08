import { extendTheme } from '@chakra-ui/react'

export const theme = extendTheme({
  colors: {
    grain: '#efebe8',
    red: {
      '100': '#BF434A',
      '200': '#7C0A0F'
    },
    gray: {
      '100': '#f7f5f3',
      '200': '#e3dcd7',
      '300': '#7d7d7d',
      '400': '#636363',
      '500': '#565656',
      '600': '#494949',
      '700': '#3d3d3d',
      '800': '#303030',
      '900': '#1b1b1b'
    },
    oxblood: {
      '100': '#487566',
      '200': '#30574B',
      '300': '#1C4638',
      '400': '#0E3629',
      '500': '#042319'
    },
    tan: {
      '300': '#D7EFBF',
      '400': '#BDE598',
      '500': '#91C263',
      '600': '#659933',
      '700': '#427313'
    }
  },
  fonts: {
    heading: `'Poppins', sans-serif`,
    body: `'Poppins', sans-serif`
  },
  styles: {
    global: {
      body: {
        bg: 'gray.100',
        color: 'black'
      }
    }
  }
})
