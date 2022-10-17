import { Button } from "@chakra-ui/react";

interface PaginationItemProps {
    number: number;
    isCurrent?: boolean;
    onPageChange: (page: number) => void;
}

export function PaginationItem({ number, isCurrent = false, onPageChange }: PaginationItemProps) {
    if (isCurrent) {
        return (
            <Button
                size="sm"
                fontSize="xs"
                width="4"
                bg="gray"
                color="white"
                disabled
                _hover={{
                    bg: "gray"
                }}
                _disabled={{
                    cursor: 'default'
                }}
            >
                {number}
            </Button>
        );
    }

    return (
        <Button
            size="sm"
            fontSize="xs"
            width="4"
            colorScheme="oxblood"
            onClick={(e) => {
                e.preventDefault();
                onPageChange(number);
            }}
        >
            {number}
        </Button>
    );
}