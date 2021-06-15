import { useLocation } from "react-router-dom";
import UserAddress from "./UserAddresses";
import UserBasics from "./UserBasics";
import UserVehicles from "./UserVechiles";
import useGetSingleQuery from "../../hooks/useGetSingleQuery";
import UserMap from "../../shared-components/UserMap";

const order = {
	id: 1,
	ref_id: "1622553167-2",
	order_type: "normal",
	status: "error_payment",
	inside_cart: 0,
	total_cost: 800,
	discount: 0,
	payable_amount: 800,
	pickup_at: null,
	scheduled_at: "2021-06-18 09:09:00",
	closed_at: null,
	plan_id: null,
	user_id: 2,
	coupon_id: null,
	vehicle_id: null,
	address_id: 1,
	cancelled_by: null,
	cancellation_reason: null,
	agent_id: 2,
	feedback: null,
	rating: null,
	created_at: "2021-06-01T13:12:47.000000Z",
	updated_at: "2021-06-09T11:49:13.000000Z",
	agent: {
		id: 2,
		name: "Dishant Agnihotri",
		email: "dishantagnihotri@gmail.com",
		phone: "7018064278",
		device_id: null,
		profile_pic: "1622577093.jpg",
		role: "admin",
		disabled: 0,
		password: null,
		two_factor_secret: null,
		two_factor_recovery_codes: null,
		email_verified_at: null,
		otp: null,
		otp_generated_at: null,
		created_at: "2021-06-01T12:00:35.000000Z",
		updated_at: "2021-06-14T19:07:00.000000Z",
		deleted_at: null,
		agent_location: null,
	},
	user: {
		id: 2,
		name: "Dishant Agnihotri",
		email: "dishantagnihotri@gmail.com",
		phone: "7018064278",
		device_id: null,
		profile_pic: "1622577093.jpg",
		role: "admin",
		disabled: 0,
		password: null,
		two_factor_secret: null,
		two_factor_recovery_codes: null,
		email_verified_at: null,
		otp: null,
		otp_generated_at: null,
		created_at: "2021-06-01T12:00:35.000000Z",
		updated_at: "2021-06-14T19:07:00.000000Z",
		deleted_at: null,
	},
	vehicle: null,
	address: {
		id: 1,
		address: "Nangal RoadPoona",
		city: "Una",
		pincode: "174301",
		lat: "31.3672396",
		lng: "76.3327936",
		is_default: 1,
		user_id: 2,
		created_at: "2021-06-01T13:14:05.000000Z",
		updated_at: "2021-06-01T13:14:05.000000Z",
		name: "#34",
		state: "Himachal Pradesh",
	},
	plan: null,
	coupon: null,
};

const UserCreateUpdateForm = () => {
	const { state } = useLocation();
	const id = state ? (state as any).id : null;
	console.log({ id });
	return (
		<>
			<UserBasics />
			{id && (
				<>
					<UserAddress />
					<div className="row">
						<div className="col-md-6">
							<UserMap userAddress={order.address} ID={id} />
						</div>
					</div>
					<UserVehicles />
				</>
			)}
		</>
	);
};

export default UserCreateUpdateForm;
