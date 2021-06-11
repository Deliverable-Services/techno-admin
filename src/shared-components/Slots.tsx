import moment from 'moment'
import React from 'react'

interface Props {
	date: string;
	slots: Array<any>
}

const Slots = (props: Props) => {
	console.log({ props })
	return (
		<div className="	  px-1 py-2 mt-4 border-1">
			<h3 className="text-muted font-weight-bold">{moment(props.date).format("DD-MM-YYYY")}</h3>
			{
				props.slots.map(slot => {
					const hour = Number(moment(slot.datetime).format("hh"))
					const interval = (moment(slot.datetime).format("a"))
					return <div>{`${hour} - ${hour + 1} ${interval}`}</div>
				})
			}
		</div>
	)
}

export default Slots
