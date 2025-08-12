import { AxiosError } from "axios";
// Removed bs-custom-file-input
import { Form, Formik } from "formik";
import { useEffect } from "react";
import { Button, Col, Row, Spinner } from "../ui/bootstrap-compat";
import { useMutation } from "react-query";
import { useHistory, useLocation } from "react-router-dom";
import { handleApiError } from "../../hooks/handleApiErrors";
import useGetSingleQuery from "../../hooks/useGetSingleQuery";
import BackButton from "../../shared-components/BackButton";
import { InputField } from "../../shared-components/InputFeild";
import IsLoading from "../../shared-components/isLoading";
import TiptapTextEditor from "../../shared-components/Tiptap/TiptapTextEditor";
import API from "../../utils/API";
import { queryClient } from "../../utils/queryClient";
import { showMsgToast } from "../../utils/showMsgToast";

const key = "staticPages";

const createUpdataStaticPages = ({
  formdata,
  id,
}: {
  formdata: any;
  id: string;
}) => {
  if (!id) {
    return API.post(`${key}`, formdata, {
      headers: { "Content-Type": "applicatioin/json" },
    });
  }

  return API.post(`${key}/${id}`, formdata, {
    headers: { "Content-Type": "application/json" },
  });
};

const StaticPageCreateForm = ({ onHideModal }) => {
  const history = useHistory();
  const { state } = useLocation();
  const id = state ? (state as any).id : null;
  useEffect(() => {}, []);
  const { data, isLoading: dataLoading } = useGetSingleQuery({ id, key });
  const { mutate, isLoading, error, status } = useMutation(
    createUpdataStaticPages,
    {
      onSuccess: () => {
        setTimeout(() => queryClient.invalidateQueries(key), 500);
        onHideModal();
        if (id) return showMsgToast("Page updated successfully");
        showMsgToast("Page created successfully");
      },
      onError: (error: AxiosError) => {
        handleApiError(error, history);
      },
    }
  );

  const apiData = data && (data as any);

  if (dataLoading) return <IsLoading />;

  return (
    <>
      <div className="">
        {id && (
          <div className="pl-5 pt-5">
            <BackButton title="Static Page" />
          </div>
        )}
        <Row className="rounded px-5">
          <Col className="mx-auto">
            <Formik
              enableReinitialize
              initialValues={apiData || {}}
              onSubmit={(values) => {
                mutate({ formdata: values, id });
              }}
            >
              {({ setFieldValue }) => (
                <Form>
                  <div className="form-container  py-2 ">
                    <InputField
                      name="title"
                      placeholder="Title"
                      label="Title"
                      required
                    />

                    <InputField
                      name="url"
                      placeholder="Url"
                      label="Url"
                      required
                    />
                    <InputField
                      name="description"
                      placeholder="Description"
                      label="Description"
                      as="textarea"
                      required
                    />
                  </div>

                  {!id && (
                    <Row>
                      <Col md={12} xl={12}>
                        <TiptapTextEditor
                          name="content"
                          // value={data.content}
                          setFieldValue={setFieldValue}
                        />
                      </Col>
                    </Row>
                  )}

                  <Row className="d-flex justify-content-center">
                    <Col md="6">
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
      </div>
    </>
  );
};

export default StaticPageCreateForm;
