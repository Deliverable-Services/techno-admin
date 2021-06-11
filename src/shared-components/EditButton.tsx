import React from 'react'
import { Button } from 'react-bootstrap'
import { AiFillEdit } from 'react-icons/ai'
import { primaryColor } from '../utils/constants'

interface Props {
	onClick: () => void
}

const EditButton = (props: Props) => {
	return (
		<div>
			<Button variant="outline-primary" onClick={props.onClick}>
				<AiFillEdit size={16} className="mr-1" />Edit
			</Button>
		</div>
	)
}

export default EditButton