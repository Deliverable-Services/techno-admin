import { AxiosError } from "axios";
import bsCustomFileInput from "bs-custom-file-input";
import { Field, Form, Formik } from "formik";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import { MdEmail, MdNotificationsActive, MdTextsms } from "react-icons/md";
import { RiTimerFill } from "react-icons/ri";
import { useMutation, useQuery } from "react-query";
import { useHistory, useLocation } from "react-router-dom";
import { Cell } from "react-table";
import { handleApiError } from "../../hooks/handleApiErrors";
import useGetSingleQuery from "../../hooks/useGetSingleQuery";
import BackButton from "../../shared-components/BackButton";
import CustomBadge from "../../shared-components/CustomBadge";
import DatePicker from "../../shared-components/DatePicker";
import { InputField } from "../../shared-components/InputFeild";
import IsActiveBadge from "../../shared-components/IsActiveBadge";
import IsLoading from "../../shared-components/isLoading";
import TablePagination from "../../shared-components/Pagination";
import ReactTable from "../../shared-components/ReactTable";
import Restricted from "../../shared-components/Restricted";
import TextEditor from "../../shared-components/TextEditor";
import API from "../../utils/API";
import { NotificationSendToCategories } from "../../utils/arrays";
import { primaryColor } from "../../utils/constants";
import { queryClient } from "../../utils/queryClient";
import { showMsgToast } from "../../utils/showMsgToast";
import PageHeading from "../../shared-components/PageHeading";
import { AiOutlinePlus } from "react-icons/ai";

const key = "fcm-notification";

const createUpdataBrand = ({ formdata, id }: { formdata: any; id: string }) => {
  if (!id) {
    return API.post(`${key}`, formdata);
  }

  return API.post(`${key}/${id}`, formdata);
};

const intitialFilter = {
  q: "",
  role: "",
  page: 1,
  perPage: 25,
};

const NotificationCreateUpdateForm = () => {
  const { state } = useLocation();
  const history = useHistory();
  const id = state ? (state as any).id : null;
  const [isScheduleOpen, setIsScheduleOpen] = useState(() =>
    id ? true : false
  );
  const [selectedRows, setSelectedRows] = useState([]);
  // const [selectedRowIds, setSelectedRowIds] = useState<Record<
  //   string,
  //   any
  // > | null>(null);

  console.log({ selectedRows });
  const [filter, setFilter] = useState(intitialFilter);
  useEffect(() => {
    bsCustomFileInput.init();
  }, []);
  const { data, isLoading: dataLoading } = useGetSingleQuery({ id, key });

  const {
    data: Users,
    error,
    isLoading: isUsersLoading,
    isFetching,
  } = useQuery<any>(["users", , filter]);

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
        Cell: (data: Cell) => (
          <CustomBadge variant="primary" title={data.row.values.role} />
        ),
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

  // const rows = useMemo(() => {
  //   let ids = {}
  //   if(!Users) return {};
  //   if(!selectedRows.length) return {} ;
  //     selectedRows.forEach((row: any) => {
  //     const user = Users.data.find(u=>u.id === row.id)
  //     if(!user) return;
  //       const index = Users.data.indexof(user)
  //       console.log({index})
  // }, [Users,selectedRows]);

  const { mutate, isLoading } = useMutation(createUpdataBrand, {
    onSuccess: () => {
      setTimeout(() => queryClient.invalidateQueries(key), 500);
      if (id) return showMsgToast("Notification updated successfully");
      showMsgToast("Notification created successfully");
      history.replace("/notifications");
    },
    onError: (error: AxiosError) => {
      handleApiError(error, history);
    },
  });

  const apiData = data as any;

  const _openSchedulTab = () => setIsScheduleOpen(true);
  const _closeSchedulTab = () => setIsScheduleOpen(false);

  if (dataLoading) return <IsLoading />;

  return (
    <>
      <div className="card">
        <div className="view-padding view-heading">
          <PageHeading
            title="Create New Notification"
            customButton={
              <Restricted to={id ? "update_notification" : "create_notification"}>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    <div className="text-white d-flex align-items-center">
                      <AiOutlinePlus size={18} />
                      <span className="mb-0 ml-1">Create</span>
                    </div>
                  )}
                </Button>
              </Restricted>
            }
          />
        </div>
        <hr />
        <div className="view-padding">
          <Row className="rounded">
            <Col className="mx-auto">
              <Formik
                enableReinitialize
                initialValues={
                  apiData
                    ? { ...apiData, is_sms: apiData?.is_sms ? "1" : "0" }
                    : { is_sms: "0" }
                }
                onSubmit={(values) => {
                  const { is_sms, send_to, ...rest } = values;
                  const formdata = {
                    ...rest,
                    users: selectedRows.map((i) => i.id),
                  };

                  if (send_to !== "custom") formdata["send_to"] = send_to;

                  if (is_sms === "1") {
                    formdata["is_sms"] = is_sms;
                    formdata["channels"] = ["sms"];
                  } else {
                    formdata["channels"] = ["pushnotification"];
                  }

                  if (!values?.scheduled_at)
                    formdata["scheduled_at"] = moment().format(
                      "YYYY-MM-DD hh:mm:ss"
                    );
                  mutate({ formdata, id });
                }}
              >
                {({ setFieldValue, values }) => (
                  <Form>
                    <div className="d-flex">
                      <label className="d-flex align-items-center">
                        <Field type="radio" name="is_sms" value="1" />
                        <p className="m-0 mx-2 lead">
                          <span className="mx-1">
                            <MdTextsms />
                          </span>
                          SMS
                        </p>
                      </label>
                      <label className="d-flex align-items-center ml-4">
                        <Field type="radio" name="is_sms" value="0" />
                        <p className="m-0 mx-2 lead">
                          <span className="mx-1">
                            <MdNotificationsActive />
                          </span>
                          Notification
                        </p>
                      </label>
                      <label className="d-flex align-items-center ml-4">
                        <Field type="radio" name="is_sms" value="0" />
                        <p className="m-0 mx-2 lead">
                          <span className="mx-1">
                            <MdEmail />
                          </span>
                          Email
                        </p>
                      </label>
                    </div>

                    <div className="form-container">
                      <InputField
                        name="title"
                        placeholder="Title"
                        label="Title"
                        required
                      />
                      <InputField
                        as="select"
                        selectData={NotificationSendToCategories}
                        name="send_to"
                        label="Send to ?"
                        placeholder="Choose user category"
                      />
                      {values.is_sms === "0" && (
                        <InputField
                          name="description"
                          placeholder="Description"
                          label="Description"
                          as="textarea"
                          required
                        />
                      )}
                    </div>
                    <Row>
                      <Col md={12} xl={12}>
                        {values.is_sms === "0" && (
                          <h4 className="font-weight-bold d-flex align-items-center ">
                            <RiTimerFill size={24} /> <span> Schedule</span>
                          </h4>
                        )}
                        {values.is_sms === "0" && !id && (
                          <div className="navigation-tab mt-3">
                            <button
                              type="button"
                              className={
                                !isScheduleOpen ? "text-primary" : "text-muted"
                              }
                              style={{
                                borderBottom: !isScheduleOpen
                                  ? ` 2px solid ${primaryColor}`
                                  : "",
                              }}
                              onClick={_closeSchedulTab}
                            >
                              <b>Now</b>
                            </button>
                            <button
                              type="button"
                              className={`${isScheduleOpen ? "text-primary" : "text-muted"
                                } ml-2`}
                              style={{
                                borderBottom: isScheduleOpen
                                  ? ` 2px solid ${primaryColor}`
                                  : "",
                              }}
                              onClick={_openSchedulTab}
                            >
                              <b>Schedule</b>
                            </button>
                          </div>
                        )}
                        {values.is_sms === "0" && (
                          <div className="display-for-schedule mt-2">
                            {!isScheduleOpen ? (
                              <div className="py-3">
                                <p>Notification will be send now</p>
                              </div>
                            ) : (
                              <div
                                style={{
                                  width: "200px",
                                }}
                              >
                                <DatePicker
                                  name="scheduled_at"
                                  setFieldValue={setFieldValue}
                                  label="Data\time"
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </Col>
                      {values?.send_to === "custom" && (
                        <Col md={12} xl={12}>
                          {!error && !isUsersLoading && Users && (
                            <>
                              <ReactTable
                                data={Users?.data}
                                columns={columns}
                                setSelectedRows={setSelectedRows}
                                filter={filter}
                                onFilterChange={_onFilterChange}
                                isDataLoading={isFetching}
                                // initialState={{
                                //   selectedRowIds: selectedRowIds
                                //     ? selectedRowIds[filter.page]
                                //     : [],
                                // }}
                                deletePermissionReq="read_user"
                              />
                              <TablePagination
                                currentPage={Users?.current_page}
                                lastPage={Users?.last_page}
                                setPage={_onFilterChange}
                                hasNextPage={!!Users?.next_page_url}
                                hasPrevPage={!!Users?.prev_page_url}
                              />
                            </>
                          )}
                        </Col>
                      )}
                    </Row>
                  </Form>
                )}
              </Formik>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};

export default NotificationCreateUpdateForm;
