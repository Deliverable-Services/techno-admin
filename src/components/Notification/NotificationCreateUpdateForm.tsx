import { AxiosError } from "axios";
import bsCustomFileInput from "bs-custom-file-input";
import { Form, Formik } from "formik";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import { RiTimerFill } from "react-icons/ri";
import { useMutation, useQuery } from "react-query";
import { useHistory, useLocation } from "react-router-dom";
import { Cell } from "react-table";
import { handleApiError } from "../../hooks/handleApiErrors";
import useGetSingleQuery from "../../hooks/useGetSingleQuery";
import BackButton from "../../shared-components/BackButton";
import DatePicker from "../../shared-components/DatePicker";
import { InputField } from "../../shared-components/InputFeild";
import IsActiveBadge from "../../shared-components/IsActiveBadge";
import IsLoading from "../../shared-components/isLoading";
import ReactTable from "../../shared-components/ReactTable";
import TextEditor from "../../shared-components/TextEditor";
import API from "../../utils/API";
import { primaryColor } from "../../utils/constants";
import { queryClient } from "../../utils/queryClient";
import { showMsgToast } from "../../utils/showMsgToast";

const key = "fcm-notification";

const createUpdataBrand = ({
	formdata,
	id,
}: {
	formdata: any;
	id: string;
}) => {
	if (!id) {
		return API.post(`${key}`, formdata, {
			headers: { "Content-Type": "multipart/form-data" },
		});
	}

	return API.post(`${key}/${id}`, formdata, {
		headers: { "Content-Type": "multipart/form-data" },
	});
};


const intitialFilter = {
	q: "",
	role: "",
	page: null,
	perPage: 25
}

const NotificationCreateUpdateForm = () => {
	const { state } = useLocation();
	const history = useHistory();
	const [isScheduleOpen, setIsScheduleOpen] = useState(false);
	const [selectedRows, setSelectedRows] = useState([])
	const [selectedRowIds, setSelectedRowIds] = useState<Record<string, boolean>>({})
	const [filter, setFilter] = useState(intitialFilter);
	const id = state ? (state as any).id : null;
	useEffect(() => {
		bsCustomFileInput.init();
	}, []);
	const { data, isLoading: dataLoading } = useGetSingleQuery({ id, key });

	const { data: Users, error, isLoading: isUsersLoading, isFetching } = useQuery<any>(["users", , filter])

	const _onFilterChange = (idx: string, value: any) => {
		setFilter((prev) => {
			return {
				...prev,
				[idx]: value,
			};
		});
	};
	const columns = useMemo(
		() => [
			{
				Header: "#Id",
				accessor: "id", //accessor is the "key" in the data
			},
			{
				Header: "Name",
				accessor: "name",
			},
			{
				Header: "Phone",
				accessor: "phone",
			},
			{
				Header: "Role",
				accessor: "role",
			},
			{
				Header: " Disabled?",
				accessor: "disabled",
				Cell: (data: Cell) => {
					return <IsActiveBadge value={data.row.values.disabled} />;
				},
			},
		],
		[]
	);
	const { mutate, isLoading } = useMutation(createUpdataBrand, {
		onSuccess: () => {
			setTimeout(() => queryClient.invalidateQueries(key), 500);
			history.replace("/push-notifications")
			if (id) return showMsgToast("Notification updated successfully");
			showMsgToast("Notification created successfully");

		},
		onError: (error: AxiosError) => {
			handleApiError(error, history);
		},
	});

	const apiData = data as any;

	const _openSchedulTab = () => setIsScheduleOpen(true)
	const _closeSchedulTab = () => setIsScheduleOpen(false)

	if (dataLoading) return <IsLoading />;

	return (
		<>
			<BackButton title="Notification" />
			<Row className="rounded">
				<Col className="mx-auto">
					<Formik
						initialValues={apiData || {}}
						onSubmit={(values) => {

							const formdata = {
								...values,
								users: selectedRows.map(i => i.id)
							}

							if (!values?.scheduled_at) formdata["scheduled_at"] = moment().format("YYYY-MM-DD hh:mm:ss")
							// const { logo, ...rest } = values;
							// const formdata = new FormData();
							// for (let k in rest) formdata.append(k, rest[k]);


							mutate({ formdata, id });
						}}
					>
						{({ setFieldValue }) => (
							<Form>
								<div className="form-container ">
									<InputField
										name="title"
										placeholder="Title"
										label="Title"
										required
									/>

								</div>
								<Row>
									<Col md={12} xl={12}>
										<TextEditor
											name="description"
											label="Description"
											setFieldValue={setFieldValue}
										/>

									</Col>

									<Col md={12} xl={12}>
										<h4 className="font-weight-bold d-flex align-items-center ">
											<RiTimerFill size={24} /> <span> Schedule</span>
										</h4>
										<div className="navigation-tab mt-3">
											<button type="button"
												className={!isScheduleOpen ? "text-primary" : "text-muted"}
												style={{
													borderBottom: !isScheduleOpen ? ` 2px solid ${primaryColor}` : "",
												}}
												onClick={_closeSchedulTab}
											>
												<b>Now</b>
											</button>
											<button type="button"
												className={`${isScheduleOpen ? "text-primary" : "text-muted"} ml-2`}
												style={{
													borderBottom: isScheduleOpen ? ` 2px solid ${primaryColor}` : "",
												}}
												onClick={_openSchedulTab}
											>

												<b>Schedule</b>
											</button>
										</div>

										<div className="display-for-schedule mt-2">
											{
												!isScheduleOpen ?
													<div className="py-3">

														<p>
															Notification will be send now
														</p>
													</div> :
													<div style={{
														width: "200px"
													}}>
														<DatePicker
															name="scheduled_at"
															setFieldValue={setFieldValue}
															label="Data\time"

														/>
													</div>
											}
										</div>
									</Col>
									<Col md={12} xl={12}>
										<h4 className="font-weight-bold d-flex align-items-center ">
											<span> Users</span>
										</h4>
										{!error && !isUsersLoading && Users && <ReactTable
											data={Users?.data}
											columns={columns}
											setSelectedRows={setSelectedRows}
											filter={filter}
											onFilterChange={_onFilterChange}
											isDataLoading={isFetching}
											initialState={{
												selectedRowIds
											}}
											setSelectedRowIds={setSelectedRowIds}
										/>}

									</Col>
								</Row>

								<Row className="d-flex justify-content-start">
									<Col md="2">
										<Button
											type="submit"
											disabled={isLoading}
											className="w-100"
										>
											{isLoading ? (
												<Spinner animation="border" size="sm" />
											) : (
												"Submit"
											)}
										</Button>
									</Col>
								</Row>
							</Form>
						)}
					</Formik>
				</Col>
			</Row>
		</>
	);
};

export default NotificationCreateUpdateForm;
