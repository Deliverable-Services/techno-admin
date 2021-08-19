import { AxiosError } from "axios";
import { Formik, Form } from "formik";
import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import { MdRemoveShoppingCart } from "react-icons/md";
import { useMutation } from "react-query";
import { useHistory, useLocation } from "react-router-dom";
import { handleApiError } from "../../hooks/handleApiErrors";
import useGetSingleQuery from "../../hooks/useGetSingleQuery";
import { InputField } from "../../shared-components/InputFeild";
import PageHeading from "../../shared-components/PageHeading";
import API from "../../utils/API";
import { queryClient } from "../../utils/queryClient";
import { showMsgToast } from "../../utils/showMsgToast";
import AddressCard from "./AddressCard";

const key = "user-balance";

const walletAction = ({ formdata }: { formdata: any }) => {
  if (formdata.action === "deposit") {
    return API.post(`user-deposit`, formdata);
  }

  return API.post(`user-withdraw`, formdata);
};

const UserWallet = () => {
  const history = useHistory();
  const { state } = useLocation();
  const id = state ? (state as any).id : null;
  const { data, isLoading: dataLoading } = useGetSingleQuery({ id, key });

  console.log({ data });
  const { mutate, isLoading, error, status } = useMutation(walletAction, {
    onSuccess: () => {
      setTimeout(() => queryClient.invalidateQueries("users"), 500);
      showMsgToast("Transaction successfull");
    },
    onError: (error: AxiosError) => handleApiError(error, history),
  });

  if (dataLoading) return null;

  return (
    <>
      <PageHeading title="User Wallet" />
      <div className="card view-padding p-2 d-flex mt-3">
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
      </div>
    </>
  );
};

export default UserWallet;
