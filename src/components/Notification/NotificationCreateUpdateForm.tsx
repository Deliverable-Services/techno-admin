import { AxiosError } from "axios";
import bsCustomFileInput from "bs-custom-file-input";
import { Form, Formik } from "formik";
import { useEffect } from "react";
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { useMutation } from "react-query";
import { useHistory, useLocation } from "react-router-dom";
import { handleApiError } from "../../hooks/handleApiErrors";
import useGetSingleQuery from "../../hooks/useGetSingleQuery";
import BackButton from "../../shared-components/BackButton";
import { InputField } from "../../shared-components/InputFeild";
import IsLoading from "../../shared-components/isLoading";
import API from "../../utils/API";
import { isActiveArray } from "../../utils/arrays";
import { queryClient } from "../../utils/queryClient";
import { showErrorToast } from "../../utils/showErrorToast";
import { showMsgToast } from "../../utils/showMsgToast";

const key = "brands";

const createUpdataBrand = ({
	formdata,
	id,
}: {
	formdata: FormData;
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

const NotificationCreateUpdateForm = () => {
	const { state } = useLocation();
	const history = useHistory();
	const id = state ? (state as any).id : null;
	useEffect(() => {
		bsCustomFileInput.init();
	}, []);
	const { data, isLoading: dataLoading } = useGetSingleQuery({ id, key });
	const { mutate, isLoading } = useMutation(createUpdataBrand, {
		onSuccess: () => {
			setTimeout(() => queryClient.invalidateQueries(key), 500);
			if (id) return showMsgToast("Brand updated successfully");
			showMsgToast("Brands created successfully");
		},
		onError: (error: AxiosError) => {
			handleApiError(error, history);
		},
	});

	const apiData = data as any;

	if (dataLoading) return <IsLoading />;

	return (
		<>
			<BackButton title="Brands" />
			<Row className="rounded">
				<Col className="mx-auto">
					<Formik
						initialValues={apiData || {}}
						onSubmit={(values) => {
							const { logo, ...rest } = values;
							const formdata = new FormData();
							for (let k in rest) formdata.append(k, rest[k]);

							if (values.logo && typeof values.logo !== "string")
								formdata.append("logo", values.logo);

							mutate({ formdata, id });
						}}
					>
						{({ setFieldValue }) => (
							<Form>
								<div className="form-container ">
									<InputField
										name="name"
										placeholder="Name"
										label="Name"
										required
									/>

									<InputField
										name="url"
										placeholder="Url"
										label="Url"
										required
									/>

									<InputField
										as="select"
										selectData={isActiveArray}
										name="is_active"
										label="Is active?"
										placeholder="Choose is active"
									/>
								</div>

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
