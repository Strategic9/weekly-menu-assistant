import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
    colors: {
        grain: '#D7CEC7',
        gray: {
            '100': '#efefef',
            '200': '#a4a4a4',
            '300': '#7d7d7d',
            '400': '#636363',
            '500': '#565656',
            '600': '#494949',
            '700': '#3d3d3d',
            '800': '#303030',
            '900': '#1b1b1b'
        },
        oxblood: {
            '100': '#cb2f38',
            '200': '#b62a32',
            '300': '#a1252c',
            '400': '#8c2126',
            '500': '#781c21',
            '600': '#63171B',
            '700': '#4e1215',
            '800': '#3a0d10',
            '900': '#25090a',
        },
        tan: {
            '300': '#D1B9a2',
            '400': '#C8AC91',
            '500': '#C09F80',
            '600': '#B8926F',
            '700': '#AF855E',
        }
    },
    fonts: {
        heading: 'Roboto',
        body: 'Roboto'
    },
    styles: {
        global: {
            body: {
                bg: 'gray.100',
                color: 'black'
            }
        }
    }
});