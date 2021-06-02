import moment from 'moment'
import React from 'react'

interface Props {
    date: string
}

const CreatedUpdatedAt = ({ date }: Props) => {
    return (
        <p>
            {
                date ?
                    moment(date).format("DD:MM:YY") : "NA"
            }
        </p>
    )
}

export default CreatedUpdatedAt
