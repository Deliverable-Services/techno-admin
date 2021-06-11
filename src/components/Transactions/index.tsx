import { useMemo, useState } from "react";
import { Button, Container, Modal, Spinner, Col, Row } from "react-bootstrap";
import { BiSad } from "react-icons/bi";
import { useMutation, useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { Cell } from "react-table";
import useTransactionStoreFilter from "../../hooks/useTranscationFilterStore";
import BreadCrumb from "../../shared-components/BreadCrumb";
import CreatedUpdatedAt from "../../shared-components/CreatedUpdatedAt";
import FilterSelect from "../../shared-components/FilterSelect";
import IsLoading from "../../shared-components/isLoading";
import PageHeading from "../../shared-components/PageHeading";
import TablePagination from "../../shared-components/Pagination";
import ReactTable from "../../shared-components/ReactTable";
import API from "../../utils/API";
import { primaryColor } from "../../utils/constants";
import { queryClient } from "../../utils/queryClient";
import { showErrorToast } from "../../utils/showErrorToast";

const key = "transactions";

const Transactions = () => {
	const history = useHistory();
	const [selectedRows, setSelectedRows] = useState([]);
	const [page, setPage] = useState<number>(1);

	const filter = useTransactionStoreFilter((state) => state.filter);
	const NumberOfRows = useTransactionStoreFilter(
		(state) => state.rows_per_page
	);
	const onFilterChange = useTransactionStoreFilter(
		(state) => state.onFilterChange
	);
	const onRowsChange = useTransactionStoreFilter((state) => state.onRowsChange);
	const resetFilter = useTransactionStoreFilter((state) => state.resetFilter);
	const { data, isLoading, isFetching, error } = useQuery<any>([key, page], {
		onError: (err: any) => {
			showErrorToast(err.response.data.message);
		},
	});

	const _onUserClick = (id: string) => {
		if (!id) return;
		history.push("/users/create-edit", { id });
	};
	const { data: Customers, isLoading: isCustomerLoading } = useQuery<any>(
		[
			"users",
			1,
			{
				role: "customer",
			},
		],
		{
			onError: (err: any) => {
				showErrorToast(err.response.data.message);
			},
		}
	);

	const PaymentMethods = [
		{ id: "upi", name: "UPI" },
		{ id: "card", name: "CARD" },
	];

	console.log("upi ", PaymentMethods);
	const _onOrderClick = (id: string) => {
		if (!id) return;
		history.push(`/orders/${id}`);
	};
	const columns = useMemo(
		() => [
			{
				Header: "#Id",
				accessor: "id", //accessor is the "key" in the data
			},
			{
				Header: "Ref Id",
				accessor: "ref_id",
			},
			{
				Header: "User",
				accessor: "user.name",
				Cell: (data: Cell) => {
					return (
						<p
							className="text-primary"
							style={{ cursor: "pointer" }}
							onClick={() => _onUserClick((data.row.original as any).user_id)}
						>
							{data.row.values["user.name"]}
						</p>
					);
				},
			},
			{
				Header: "Order",
				accessor: "order_id",
				Cell: (data: Cell) => {
					return (
						<p
							className="text-primary"
							style={{ cursor: "pointer" }}
							onClick={() => _onOrderClick((data.row.values as any).order_id)}
						>
							{data.row.values.order_id}
						</p>
					);
				},
			},
			{
				Header: "Paid Amount",
				accessor: "paid_amount",
			},
			{
				Header: "Payment Method",
				accessor: "payment_method",
			},
			{
				Header: "Status",
				accessor: "status",
			},
			{
				Header: "Created At",
				accessor: "created_at",
				Cell: (data: Cell) => {
					return <CreatedUpdatedAt date={data.row.values.created_at} />;
				},
			},
			{
				Header: "Updated At",
				accessor: "updated_at",
				Cell: (data: Cell) => {
					return <CreatedUpdatedAt date={data.row.values.updated_at} />;
				},
			},
		],
		[]
	);

	if (!data && (!isLoading || !isFetching)) {
		return (
			<Container fluid className="d-flex justify-content-center display-3">
				<div className="d-flex flex-column align-items-center">
					<BiSad color={primaryColor} />
					<span className="text-primary display-3">Something went wrong</span>
				</div>
			</Container>
		);
	}

	return (
		<>
			<PageHeading title="Transactions" />

			{(!isLoading || !isFetching) && (
				<div>
					<div>
						<div className="filter">
							<BreadCrumb
								onFilterChange={onFilterChange}
								value=""
								currentValue={filter.status}
								dataLength={data?.data?.length}
								idx="status"
								title="All"
							/>
							<BreadCrumb
								onFilterChange={onFilterChange}
								value="success"
								currentValue={filter.status}
								dataLength={data?.data?.length}
								idx="status"
								title="Success"
							/>
							<BreadCrumb
								onFilterChange={onFilterChange}
								value="failed"
								currentValue={filter.status}
								dataLength={data?.data.length}
								idx="status"
								title="Failed"
							/>
						</div>
					</div>
				</div>
			)}

			<Container fluid className="card component-wrapper px-0 py-2">
				<Container fluid className="h-100 p-0">
					<>
						{isLoading || isFetching ? (
							<IsLoading />
						) : (
							<>
								{!error && (
									<>
										<Container className="pt-3">
											<Row className="select-filter d-flex">
												<Col md="auto">
													<FilterSelect
														currentValue={filter.user_id}
														data={!isCustomerLoading && Customers.data}
														label="Customers"
														idx="user_id"
														onFilterChange={onFilterChange}
													/>
												</Col>
												<Col md="auto">
													<FilterSelect
														currentValue={PaymentMethods[0].id}
														data={!isCustomerLoading && Customers.data}
														label="Payment Method"
														idx="user_id"
														onFilterChange={onFilterChange}
													/>
												</Col>
												<Col md="auto">
													<FilterSelect
														currentValue={PaymentMethods[1].id}
														data={!isCustomerLoading && Customers.data}
														label="Agents"
														idx="user_id"
														onFilterChange={onFilterChange}
													/>
												</Col>
												<Col
													md="auto"
													className="d-flex align-items-center mt-1 justify-content-center"
												>
													<Button
														onClick={() => resetFilter()}
														variant="light"
														style={{
															backgroundColor: "#eee",
															fontSize: 14,
														}}
													>
														Reset Filters
													</Button>
												</Col>
											</Row>
										</Container>
									</>
								)}
							</>
						)}
					</>
				</Container>
			</Container>

			<Container fluid className="card component-wrapper px-0 py-2">
				<Container fluid className="h-100 p-0">
					{isLoading || isFetching ? (
						<IsLoading />
					) : (
						<>
							{!error && (
								<ReactTable
									data={data?.data}
									columns={columns}
									setSelectedRows={setSelectedRows}
								/>
							)}
							{!error && data?.data?.length > 0 ? (
								<TablePagination
									currentPage={data?.current_page}
									lastPage={data?.last_page}
									setPage={setPage}
									hasNextPage={!!data?.next_page_url}
									hasPrevPage={!!data?.prev_page_url}
								/>
							) : null}{" "}
						</>
					)}
				</Container>
			</Container>
		</>
	);
};

export default Transactions;
