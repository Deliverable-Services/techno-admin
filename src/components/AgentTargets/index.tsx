import { AxiosError } from "axios";
import moment from "moment";
import React, { useMemo, useState } from "react";
import { Button, Col, Container, Dropdown, Form, Row } from "react-bootstrap";
import { BiSad } from "react-icons/bi";
import { useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { Cell } from "react-table";
import { handleApiError } from "../../hooks/handleApiErrors";
import CreatedUpdatedAt from "../../shared-components/CreatedUpdatedAt";
import EditButton from "../../shared-components/EditButton";
import FilterSelect from "../../shared-components/FilterSelect";
import IsLoading from "../../shared-components/isLoading";
import PageHeading from "../../shared-components/PageHeading";
import TablePagination from "../../shared-components/Pagination";
import ReactTable from "../../shared-components/ReactTable";
import TableLink from "../../shared-components/TableLink";
import { areTwoObjEqual } from "../../utils/areTwoObjEqual";
import { primaryColor } from "../../utils/constants";
import { BsFunnel } from "react-icons/bs";
import { GiOnTarget } from "react-icons/gi";

const key = "create-target";

const intitialFilter = {
  q: "",
  page: 1,
  perPage: 25,
  month: "",
  target: "",
  agent_id: "",
};

const AgentTargets = () => {
  const history = useHistory();
  const [selectedRows, setSelectedRows] = useState([]);
  const [filter, setFilter] = useState(intitialFilter);
  const { data, isLoading, isFetching, error } = useQuery<any>(
    [key, , filter],
    {
      onError: (error: AxiosError) => {
        handleApiError(error, history);
      },
    }
  );

  const { data: Agents, isLoading: isAgentLoading } = useQuery<any>([
    "users",
    ,
    {
      role: "agent",
    },
  ]);
  const _onCreateClick = () => {
    history.push("/agent-targets/create-edit");
  };
  const _onEditClick = (id: string) => {
    history.push("/agent-targets/create-edit", { id });
  };

  const _onFilterChange = (idx: string, value: any) => {
    setFilter((prev) => ({
      ...prev,
      [idx]: value,
    }));
  };

  const _onUserClick = (id: string) => {
    if (!id) return;
    history.push("/users/create-edit", { id });
  };

  const columns = useMemo(
    () => [
      {
        Header: "#Id",
        accessor: "id", //accessor is the "key" in the data
      },
      {
        Header: "Agent",
        accessor: "agent.name",
        Cell: (data: Cell) => {
          return (
            <TableLink
              onClick={_onUserClick}
              id={(data.row.original as any).agent_id}
              title={data.row.values["agent.name"]}
            />
          );
        },
      },
      {
        Header: "Month",
        accessor: "month",
      },
      {
        Header: "Assigned Target",
        accessor: "target",
      },
      // {
      //   Header: "Achieved Target",
      //   accessor: "achieved",
      // },
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
      {
        Header: "Actions",
        Cell: (data: Cell) => {
          return (
            <EditButton
              onClick={() => {
                _onEditClick(data.row.values.id);
              }}
              permissionReq="update_agenttarget"
            />
          );
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
      <div className="view-padding">
        <PageHeading
          title="Agent Targets"
          description="Create and manage targets for your agents"
          icon={<GiOnTarget size={24} />}
          onClick={_onCreateClick}
          totalRecords={data?.total}
          permissionReq="create_agenttarget"
        />
      </div>
      <hr />

      <div className="h-100 p-0">
        {isLoading ? (
          <IsLoading />
        ) : (
          <>
            {!error && (
              <>
                <ReactTable
                  data={data?.data}
                  filters={
                    <Dropdown className="filter-dropdown">
                      <Dropdown.Toggle as={Button} variant="primary">
                        <BsFunnel /> Filters
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <div className="filter-dropdown-heading d-flex justify-content-between w-100">
                          <h4>Filter</h4>
                          <div className="d-flex align-items-center justify-md-content-center">
                            <Button
                              variant={
                                areTwoObjEqual(intitialFilter, filter)
                                  ? "light"
                                  : "primary"
                              }
                              style={{
                                fontSize: 14,
                              }}
                              onClick={() => setFilter(intitialFilter)}
                            >
                              Reset Filters
                            </Button>
                          </div>
                        </div>
                        <div className="select-filter">
                          <FilterSelect
                            currentValue={filter.agent_id}
                            data={!isAgentLoading && Agents.data}
                            label="Agents"
                            idx="agent_id"
                            onFilterChange={_onFilterChange}
                          />
                          <Form.Group>
                            <Form.Label className="text-muted">Month</Form.Label>
                            <Form.Control
                              type="month"
                              value={moment(filter.month).format("YYYY-MM")}
                              onChange={(e) => {
                                const value = moment(e.target.value).format(
                                  "MMM-YYYY"
                                );
                                _onFilterChange("month", value);
                              }}
                              style={{
                                fontSize: 14,
                                height: 35,
                              }}
                            />
                          </Form.Group>
                        </div>
                      </Dropdown.Menu>
                    </Dropdown>
                  }
                  columns={columns}
                  setSelectedRows={setSelectedRows}
                  filter={filter}
                  onFilterChange={_onFilterChange}
                  isDataLoading={isFetching}
                  searchPlaceHolder="Search using month, target"
                  isSelectable={false}
                />
              </>
            )}
            {!error && data?.data?.length > 0 ? (
              <TablePagination
                currentPage={data?.current_page}
                lastPage={data?.last_page}
                setPage={_onFilterChange}
                hasNextPage={!!data?.next_page_url}
                hasPrevPage={!!data?.prev_page_url}
              />
            ) : null}{" "}
          </>
        )}
      </div>

    </>
  );
};

export default AgentTargets;
