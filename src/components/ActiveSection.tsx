import { cloneElement, ReactElement } from 'react';

interface ActiveSectionProps {
    children: ReactElement;
    isActive: boolean;
}

export function ActiveSection({
    children,
    isActive
}: ActiveSectionProps) {
    return (
        <>
            {cloneElement(children, {
                color: isActive ? 'oxblood.300' : 'gray.300'
            })}
        </>
    );
}