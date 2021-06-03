import React from 'react';
import IsActiveBadge from '../../shared-components/IsActiveBadge';

interface Props {
    vehicle: any
}

const VehicleCard = ({ vehicle }: Props) => {
    return (
        <div className="card p-2 d-flex mt-3">
            <div className="d-flex flex-column p-2">
                <div className="text-black font-weight-bold">
                    <h3>{vehicle.name}</h3>
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
                                <td className="text-muted text-capitalize">Fuel Type</td>
                                <td className="text-black font-weight-bold text-right">
                                    {vehicle.fuel_type}
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
