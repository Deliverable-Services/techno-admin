import { AxiosError } from "axios";
import { Formik, Form } from "formik";
import { useMemo, useState } from "react";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import { useMutation, useQuery } from "react-query";
import { useHistory, useLocation } from "react-router-dom";
import { Cell } from "react-table";
import { handleApiError } from "../../hooks/handleApiErrors";
import useGetSingleQuery from "../../hooks/useGetSingleQuery";
import CreatedUpdatedAt from "../../shared-components/CreatedUpdatedAt";
import { InputField } from "../../shared-components/InputFeild";
import PageHeading from "../../shared-components/PageHeading";
import ReactTable from "../../shared-components/ReactTable";
import API from "../../utils/API";
import { queryClient } from "../../utils/queryClient";
import { showMsgToast } from "../../utils/showMsgToast";
import { Hammer } from "../ui/icon";

const key = "user-balance";

const walletAction = ({ formdata }: { formdata: any }) => {
  if (formdata.action === "deposit") {
    return API.post(`user-deposit`, formdata);
  }

  return API.post(`user-withdraw`, formdata);
};

const intitialFilter = {
  q: "",
  page: 1,
  perPage: 25,
};
const UserWallet = () => {
  const history = useHistory();
  const { state } = useLocation();
  const id = state ? (state as any).id : null;
  const [filter, setFilter] = useState(intitialFilter);
  const { data, isLoading: dataLoading } = useGetSingleQuery({ id, key });
  const {
    data: WalletTransactions,
    isLoading: isTransactionLoading,
    isFetching: isTransactionFetching,
  } = useQuery<any>(["get-users-trasaction", , { ...filter, user_id: id }]);

  const { mutate, isLoading, error, status } = useMutation(walletAction, {
    onSuccess: () => {
      setTimeout(() => queryClient.invalidateQueries(key), 500);
      queryClient.invalidateQueries("get-users-trasaction");
      showMsgToast("Transaction successfull");
    },
    onError: (error: AxiosError) => handleApiError(error, history),
  });

  const columns = useMemo(
    () => [
      {
        Header: "#Id",
        accessor: "id", //accessor is the "key" in the data
      },
      {
        Header: "Amount",
        accessor: "amount",
        Cell: (data: Cell) => {
          const type = (data.row.original as any)?.type;
          const amount = data.row.values?.amount;

          if (type === "deposit")
            return (
              <p className="text-success mb-0">
                <Hammer className="mb-1" />₹{amount}
              </p>
            );
          if (type === "withdraw")
            return (
              <p className="text-danger mb-0 ">
                <Hammer />₹{amount}
              </p>
            );

          return <p>₹{amount}</p>;
        },
      },
      {
        Header: "Transaction date",
        accessor: "created_at",
        Cell: (data: Cell) => {
          return <CreatedUpdatedAt date={data.row.values.created_at} />;
        },
      },
    ],
    []
  );
  const _onFilterChange = (idx: string, value: any) => {
    setFilter((prev) => ({
      ...prev,
      [idx]: value,
    }));
  };

  if (dataLoading) return null;

  return (
    <>
      <div className="card view-padding p-2 d-flex mt-3">
        <PageHeading title="User Wallet" />
        <div className="text-primary">
          <div className="d-flex justify-content-between">
            <div
              className="text-black pb-3"
              style={{ cursor: "pointer", fontWeight: 600 }}
            >
              Wallet Balance: ₹{data}
            </div>
          </div>
        </div>

        <hr className="mb-3" />
        <Row className="rounded mt-3 ">
          <Col className="mx-auto">
            <Formik
              enableReinitialize
              initialValues={{ action: "deposit", amount: 0 }}
              onSubmit={(values) => mutate({ formdata: { id, ...values } })}
            >
              {({ values }) => {
                return (
                  <Form>
                    <div className="form-container ">
                      <InputField
                        name="amount"
                        label="Amount"
                        placeholder="amount"
                        type="number"
                        required
                      />
                      <InputField
                        name="action"
                        label="Select Action"
                        as="select"
                        selectData={[
                          { id: "deposit", name: "Deposit" },
                          { id: "withdraw", name: "Withdraw" },
                        ]}
                      />
                    </div>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <Spinner animation="border" size="sm" />
                      ) : null}

                      {values.action === "deposit" ? "Deposit" : "Withdraw"}
                    </Button>
                  </Form>
                );
              }}
            </Formik>
          </Col>
        </Row>
        <hr className="my-2" />
        <PageHeading title="Wallet History" />
        {!isTransactionLoading && (
          <ReactTable
            data={WalletTransactions?.data}
            columns={columns}
            filter={filter}
            onFilterChange={_onFilterChange}
            isDataLoading={isTransactionFetching}
            searchPlaceHolder="Search using amount"
            isSelectable={false}
          />
        )}
      </div>
    </>
  );
};

export default UserWallet;
