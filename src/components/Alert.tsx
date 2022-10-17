import { Alert as ChakraAlert, AlertIcon, AlertDescription, CloseButton } from '@chakra-ui/react';
import { AlertComponentPropsWithStyle } from 'react-alert';


export function Alert({ message, options, style, close }: AlertComponentPropsWithStyle) {
    return (
        <ChakraAlert status={options.type} style={style}>
            <AlertIcon />
            <AlertDescription>{message}</AlertDescription>
            <CloseButton position='absolute' right='8px' top='8px' onClick={close} />
        </ChakraAlert>
    );
}