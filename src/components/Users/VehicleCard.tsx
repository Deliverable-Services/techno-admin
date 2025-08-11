import React from "react";
import CustomBadge from "../../shared-components/CustomBadge";

interface Props {
  vehicle: any;
}

const VehicleCard = ({ vehicle }: Props) => {
  return (
    <div className="card view-padding p-2 d-flex">
      <div className="d-flex flex-column">
        <div className="text-primary">
          <div className="d-flex justify-content-between">
            <div
              className="text-black pb-3"
              style={{ cursor: "pointer", fontWeight: 600 }}
            >
              {vehicle.name}{" "}
              <span>
                {vehicle.is_default && (
                  <CustomBadge variant="primary" title="Default" />
                )}
              </span>
            </div>
          </div>
        </div>

        <hr className="mb-3" />

        <div className="d-flex flex-column w-100" style={{ fontSize: 18 }}>
          <table className="w-100">
            <tbody>
              <tr>
                <td className="view-heading">Brand</td>
                <td className="text-right">
                  <p className="view-subheading">
                    {vehicle?.brand?.name || "NA"}
                  </p>
                </td>
              </tr>
              <tr>
                <td className="view-heading">Model</td>
                <td className="text-success font-weight-bold text-right">
                  <p className="view-subheading">
                    {vehicle?.model?.name || "NA"}
                  </p>
                </td>
              </tr>
              <tr>
                <td className="view-heading ">Manf. Year</td>
                <td
                  className="text-primary  font-weight-bold text-right"
                  style={{ fontSize: "24px" }}
                >
                  <p className="view-subheading">
                    {vehicle.manufactoring_year}
                  </p>
                </td>
              </tr>
              <tr>
                <td className="view-heading ">Fuel Type</td>
                <td
                  className="text-primary  font-weight-bold text-right"
                  style={{ fontSize: "24px" }}
                >
                  <p className="view-subheading">{vehicle.fuel_type}</p>
                </td>
              </tr>
              <tr>
                <td className="view-heading ">Reg. Number</td>
                <td
                  className="text-primary  font-weight-bold text-right"
                  style={{ fontSize: "24px" }}
                >
                  <p className="view-subheading">
                    {vehicle.registration_number}
                  </p>
                </td>
              </tr>
              <tr>
                <td className="view-heading ">Reg. State</td>
                <td
                  className="text-primary  font-weight-bold text-right"
                  style={{ fontSize: "24px" }}
                >
                  <p className="view-subheading">
                    {vehicle.registration_state}
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
