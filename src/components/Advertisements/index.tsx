import { useMemo, useState } from "react";
import { Button, Container, Form, Modal, Spinner } from "react-bootstrap";
import { AiFillDelete, AiFillEdit, AiFillPlusSquare } from "react-icons/ai";
import { BiSad } from "react-icons/bi";
import { QueryFunction, useMutation, useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { Cell } from "react-table";
import BreadCrumb from "../../shared-components/BreadCrumb";
import CreatedUpdatedAt from "../../shared-components/CreatedUpdatedAt";
import IsActiveBadge from "../../shared-components/IsActiveBadge";
import IsLoading from "../../shared-components/isLoading";
import TablePagination from "../../shared-components/Pagination";
import ReactTable from "../../shared-components/ReactTable";
import API from "../../utils/API";
import LightBox from "react-lightbox-component";
import { userRoles } from "../../utils/arrays";
import {
  baseUploadUrl,
  primaryColor,
  secondaryColor,
} from "../../utils/constants";
import { queryClient } from "../../utils/queryClient";
import { showErrorToast } from "../../utils/showErrorToast";
import { AxiosError } from "axios";
import { handleApiError } from "../../hooks/handleApiErrors";
import { showMsgToast } from "../../utils/showMsgToast";
interface IFilter {
  type: string | null;
}
const key = "banners/list";

const deleteAd = (id: string) => {
  return API.delete(`${key}/${id}`);
};
const initialFilter = {
  type: "offers",
  q: "",
  page: "",
  perPage: 25
};

const getBanners: QueryFunction = async ({ queryKey }) => {

  const params = {};
  //@ts-ignore
  for (let k in queryKey[2]) {
    if (queryKey[2][k])
      params[k] = queryKey[2][k]
  }

  const r = await API.get(
    `${queryKey[0]}/${(queryKey[1] as string).toLowerCase()}`,
    params
  );

  return await r.data;
};

const Advertisements = () => {
  const history = useHistory();
  const [selectedRowId, setSelectedRowId] = useState<string>("");
  const [selectedRows, setSelectedRows] = useState([])
  console.log(selectedRows.map(item => item.id))
  const [page, setPage] = useState<number>(1);
  const [deletePopup, setDeletePopup] = useState(false);

  const [filter, setFilter] = useState<IFilter>(initialFilter);

  const { data, isLoading, isFetching, error } = useQuery<any>(
    [key, filter.type, filter],
    getBanners, {
    onError: (error: AxiosError) => {
      handleApiError(error, history)
    },
  }
  );

  const { mutate, isLoading: isDeleteLoading } = useMutation(deleteAd, {
    onSuccess: () => {
      queryClient.invalidateQueries(key);
      setDeletePopup(false);
      showMsgToast("Users deleted successfully")
    },
    onError: (error: AxiosError) => {
      handleApiError(error, history)
    },
  });
  const _onFilterChange = (idx: string, value: any) => {
    setFilter((prev) => {
      return {
        ...prev,
        [idx]: value,
      };
    });
  };

  const _onCreateClick = () => {
    history.push("/advertisements/create-edit");
  };
  const _onEditClick = (id: string) => {
    history.push("/advertisements/create-edit", { id });
  };

  console.log({ data, isLoading, isFetching });

  const columns = useMemo(
    () => [
      {
        Header: "#Id",
        accessor: "id", //accessor is the "key" in the data
      },
      {
        Header: "Image",
        accessor: "image",
        Cell: (data: Cell) => (
          <LightBox
            images={[
              {
                src: `${baseUploadUrl}banners/${data.row.values.image}`,
                title: data.row.values.image,
              },
            ]}
            thumbnailWidth="100px"
            thumbnailHeight="50px"
          />
        ),
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Order",
        accessor: "order",
      },
      {
        Header: " Is Active?",
        accessor: "is_active",
        Cell: (data: Cell) => {
          return <IsActiveBadge value={data.row.values.is_active} />;
        },
      },
      {
        Header: "Valid from",
        accessor: "valid_from",
        Cell: (data: Cell) => {
          return <CreatedUpdatedAt date={data.row.values.valid_from} />;
        },
      },
      {
        Header: "Valid To",
        accessor: "valid_to",
        Cell: (data: Cell) => {
          return <CreatedUpdatedAt date={data.row.values.valid_to} />;
        },
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
      {
        Header: "Actions",
        Cell: (data: Cell) => {
          return (
            <div className="d-flex">
              <button
                onClick={() => {
                  _onEditClick(data.row.values.id);
                }}
              >
                <AiFillEdit color={secondaryColor} size={24} />
              </button>
              <button
                className="ml-2"
                onClick={() => {
                  setSelectedRowId(data.row.values.id);
                  setDeletePopup(true);
                }}
              >
                <AiFillDelete color="red" size={24} />
              </button>
            </div>
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
      <Container fluid className="d-flex justify-content-between py-2">
        <h2 className="font-weight-bold">Banners</h2>
        <div className="d-flex">
          <Button variant="primary" onClick={_onCreateClick}>
            <div className="text-white d-flex ">
              <AiFillPlusSquare size={25} /> <b>Create</b>
            </div>
          </Button>
        </div>
      </Container>

      {(!isLoading || !isFetching) && (
        <Container fluid>
          <div>
            <div className="filter">
              <BreadCrumb
                onFilterChange={_onFilterChange}
                value="offers"
                currentValue={filter.type}
                dataLength={data?.data?.length}
                idx="type"
                title="Offers"
              />
              <BreadCrumb
                onFilterChange={_onFilterChange}
                value="latest"
                currentValue={filter.type}
                dataLength={data?.data?.length}
                idx="type"
                title="Latest"
              />
              <BreadCrumb
                onFilterChange={_onFilterChange}
                value="trending"
                currentValue={filter.type}
                dataLength={data?.data?.length}
                idx="type"
                title="Trending"
                isLast
              />
            </div>
          </div>
        </Container>
      )}
      <Container fluid className="component-wrapper px-0 py-2">
        <Container fluid className="h-100 p-0">
          {isLoading ? (
            <IsLoading />
          ) : (
            <>
              {!error && <ReactTable
                data={data.data}
                columns={columns}
                setSelectedRows={setSelectedRows}
                onFilterChange={_onFilterChange}
                filter={filter}
                isDataLoading={isFetching}
              />}
              {!error && data.length > 0 ? (
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
      <Modal show={deletePopup} onHide={() => setDeletePopup(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Are you sure?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Do you really want to delete this record? This process cannot be
          undone
        </Modal.Body>
        <Modal.Footer>
          <Button variant="bg-light" onClick={() => setDeletePopup(false)}>
            Close
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              mutate(selectedRowId);
            }}
          >
            {isDeleteLoading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Disable"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
      {
        selectedRows.length > 0 &&
        <div className="delete-button rounded">
          <span><b>Delete {selectedRows.length} rows</b></span>
          <Button variant="danger">
            Delete
          </Button>
        </div>
      }
    </>
  );
};

export default Advertisements;
