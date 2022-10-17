import { forwardRef } from "react";
import { Tooltip, Button, ButtonProps } from '@chakra-ui/react';

interface TooltipButtonProps extends ButtonProps {
    tooltipLabel: string
}

const TooltipButtonBase = function ({ tooltipLabel, ...rest }: TooltipButtonProps, ref) {
    return (
        <Tooltip label={tooltipLabel} bg='tan.400' color='white' placement='top-start'>
            <Button
                as="a"
                cursor="pointer"
                ref={ref}
                {...rest}
            >
            </Button>
        </Tooltip>
    );
};

export default forwardRef(TooltipButtonBase);