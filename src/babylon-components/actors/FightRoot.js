import React from 'react';

export const FightRoot = React.forwardRef(({ children, ...props }, transformNodeRef) => {
    return (
        <transformNode name="flightRoot" ref={transformNodeRef} {...props}>
            {children}
        </transformNode>
    );
});
