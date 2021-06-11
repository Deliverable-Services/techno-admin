import { AxiosError } from "axios";
import bsCustomFileInput from "bs-custom-file-input";
import { Form, Formik } from "formik";
import moment from "moment";
import { useEffect } from "react";
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { useMutation } from "react-query";
import { useHistory, useLocation } from "react-router-dom";
import { handleApiError } from "../../hooks/handleApiErrors";
import useGetSingleQuery from "../../hooks/useGetSingleQuery";
import BackButton from "../../shared-components/BackButton";
import DatePicker from "../../shared-components/DatePicker";
import { InputField } from "../../shared-components/InputFeild";
import IsLoading from "../../shared-components/isLoading";
import API from "../../utils/API";
import { isActiveArray } from "../../utils/arrays";
import { queryClient } from "../../utils/queryClient";
import { showErrorToast } from "../../utils/showErrorToast";
import { showMsgToast } from "../../utils/showMsgToast";

const key = "disabled-slots";

const createSlot = ({
	formdata,
}: {
	formdata: any;
}) => {
	return API.post(`${key}`, formdata, {
		headers: { "Content-Type": "multipart/form-data" },
	});

};

const SlotCreateUpdateForm = () => {
	const { state } = useLocation()
	const history = useHistory()
	const id = state ? (state as any).id : null;
	useEffect(() => {
		bsCustomFileInput.init();
	}, []);
	const { data, isLoading: dataLoading } = useGetSingleQuery({ id, key });
	const { mutate, isLoading } = useMutation(createSlot, {
		onSuccess: () => {
			setTimeout(() => queryClient.invalidateQueries(key), 500);
			showMsgToast("Slot has been  disabled successfully")
		},
		onError: (error: AxiosError) => {
			handleApiError(error, history)
		}
	});


	const apiData = data as any;

	if (dataLoading) return <IsLoading />;

	return (
		<>
			<BackButton title="Booking Slots" />
			<Row className="rounded">
				<Col className="mx-auto">
					<Formik
						initialValues={apiData || {}}

						onSubmit={(values) => {
							console.log({ values })

							const formdata = {
								datetime: moment(values.datetime).format("YYYY-MM-DD hh-mm-ss")
							}
							mutate({ formdata });
						}}
					>
						{({ setFieldValue }) => (
							<Form>
								<div className="form-container ">
									<InputField
										name="reason"
										placeholder="Reason"
										label="Reason"
										required
									/>
									<DatePicker
										name="datetime"
										setFieldValue={setFieldValue}
										label="Date Time"
									/>

								</div>

								<Row className="d-flex justify-content-start">
									<Col md="2">
										<Button type="submit" disabled={isLoading} className="w-100">
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

export default SlotCreateUpdateForm;
