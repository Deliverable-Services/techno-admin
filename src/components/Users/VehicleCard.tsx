import React from 'react';
import { Badge } from 'react-bootstrap';
import IsActiveBadge from '../../shared-components/IsActiveBadge';

interface Props {
    vehicle: any
}

const VehicleCard = ({ vehicle }: Props) => {
    return (
        <div className="card p-2 d-flex mt-3">
            <div className="d-flex flex-column p-2">
                <div className="text-black font-weight-bold">
                    <div className="d-flex align-items-center">
                        <h3>{vehicle.name}</h3>
                        <Badge variant="primary" className="ml-2">{vehicle.fuel_type}</Badge>
                    </div>
                </div>
                <div
                    className="d-flex flex-column w-100"
                    style={{ fontSize: 18 }}
                >
                    <table className="w-100">
                        <tbody>
                            <tr>
                                <td className="text-muted text-capitalize">Brand</td>
                                <td className="text-black font-weight-bold text-right">
                                    {vehicle.brand_id}
                                </td>
                            </tr>
                            <tr>
                                <td className="text-muted text-capitalize">Model</td>
                                <td className="text-black font-weight-bold text-right">
                                    {vehicle.model_id}
                                </td>
                            </tr>
                            <tr>
                                <td className="text-muted text-capitalize">Manufactoring Year</td>
                                <td className="text-black font-weight-bold text-right">
                                    {vehicle.manufactoring_year}
                                </td>
                            </tr>
                            <tr>
                                <td className="text-muted text-capitalize">Reg. Number</td>
                                <td className="text-black font-weight-bold text-right">
                                    {vehicle.registration_number}
                                </td>
                            </tr>
                            <tr>
                                <td className="text-muted text-capitalize">Reg. State</td>
                                <td className="text-black font-weight-bold text-right">
                                    {vehicle.registration_state}
                                </td>
                            </tr>
                            <tr>
                                <td className="text-muted text-capitalize">Is Default?</td>
                                <td className="text-black font-weight-bold text-right">
                                    <IsActiveBadge value={vehicle.is_default} />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default VehicleCard
