import React from 'react'
import { Badge } from 'react-bootstrap'

interface Props {
    value: any
}

const IsActiveBadge = ({ value }: Props) => {
    return (
        <Badge variant={parseInt(value) === 1 ? "primary" : "danger"}>
            {
                parseInt(value) == 1 ? "Yes" : "No"
            }
        </Badge>
    )
}

export default IsActiveBadge
