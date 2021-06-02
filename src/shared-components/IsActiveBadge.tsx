import React from 'react'
import { Badge } from 'react-bootstrap'

interface Props {
    value: number
}

const IsActiveBadge = ({ value }: Props) => {
    return (
        <Badge variant={value == 1 ? "primary" : "danger"}>
            {
                value == 1 ? "Yes" : "No"
            }
        </Badge>
    )
}

export default IsActiveBadge
