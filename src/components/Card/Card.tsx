import { Box, Card, CardContent } from "@mui/material";

type CardProps = {
    children?: React.ReactNode
    style?: React.CSSProperties
    className?: any
    handleClick?: any
}

export const UncontrolledCard: React.FC<CardProps> = ({children, style, className, handleClick}) => {
    return (
        <>
            <Card className={className} style={style} onClick={handleClick}>
                <CardContent>
                    {children}
                </CardContent>
            </Card>
        </>
    )
}

