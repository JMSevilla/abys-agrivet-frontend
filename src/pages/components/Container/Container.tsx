import { Container } from "@mui/material";
import React from "react";

type Props = {
    maxWidth: any
    children: React.ReactNode
    
}

export const ControlledContainer = (props: Props, {...rest}) => {
    return (
        <Container maxWidth={props.maxWidth} {...rest}>
            {props.children}
        </Container>
    )
}