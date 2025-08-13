import { AxiosError } from "axios";
type EditorState = string;
import React, { useMemo, useState, useEffect } from "react";
import { useMutation, useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { handleApiError } from "../../hooks/handleApiErrors";
import useUserProfileStore from "../../hooks/useUserProfileStore";
import EditButton from "../../shared-components/EditButton";
import IsLoading from "../../shared-components/isLoading";
import PageHeading from "../../shared-components/PageHeading";
import Restricted from "../../shared-components/Restricted";
import API from "../../utils/API";
import { isDesktop, primaryColor } from "../../utils/constants";
import { queryClient } from "../../utils/queryClient";
import { showMsgToast } from "../../utils/showMsgToast";
import StaticPageCreateForm from "./StaticPageCreateUpdateForm";
import ReactTable from "../../shared-components/ReactTable";
import { Cell } from "react-table";
import { Hammer } from "../ui/icon";
import { Trash2 } from 'lucide-react';


const key = "staticPages";

const updatePageData = ({ formdata, id }: { formdata: any; id: string }) => {
  return API.post(`${key}/${id}`, formdata);
};
const deletePage = (id: any) => {
  return API.post(`${key}/delete`, { id });
};

const intitialFilter = {
  role: "",
  q: "",
  page: null,
  perPage: 25,
  disabled: "",
};

const StaticPages = () => {
  const history = useHistory();
  const isRestricted = useUserProfileStore((state) => state.isRestricted);

  const [filter, setFilter] = useState(intitialFilter);
  const { data, isLoading, isFetching } = useQuery<any>([key, , filter]);
  const [titles, setTitles] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState(titles[0]);
  const [modalShow, setModalShow] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);

  const _onEditClick = (id: string) => {
    history.push(`/website-pages/create-edit/${id}`, { id });
  };

  const { mutate: mutateDelete, isLoading: isDeleteLoading } = useMutation(
    deletePage,
    {
      onSuccess: () => {
        showMsgToast("Page deleted successfully");
        setTimeout(() => queryClient.invalidateQueries(key), 500);
      },
      onError: (error: AxiosError) => {
        handleApiError(error, history);
      },
    }
  );

  const _onDeletePage = (pageId: any) => {
    mutateDelete(pageId);
  };

  const columns = useMemo(
    () => [
      { Header: "#Id", accessor: "id" },
      { Header: "Name", accessor: "title" },
      { Header: "Description", accessor: "description" },
      { Header: "URL", accessor: "url" },
      { Header: "Organization Id", accessor: "organisation_id" },
      {
        Header: "Actions",
        Cell: (data: Cell) => {
          const [open, setOpen] = useState(false);
          return (
            <div className="flex items-center justify-end gap-3">
              <EditButton
                onClick={() => _onEditClick(data?.row?.values?.id)}
                permissionReq="update_banner"
              />
              {/* Tailwind Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setOpen(!open)}
                  className="p-1 bg-transparent border-0 shadow-none"
                  id={`dropdown-${data.row.values.id}`}
                >
                  <Trash2 size={18} />
                </button>
                {open && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-[999]">
                    <button
                      onClick={() => {
                        setSelectedDeleteId(data?.row?.values?.id);
                        setDeletePopup(true);
                        setOpen(false);
                      }}
                      className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={16} className="mr-2" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        },
      },
    ],
    []
  );

  useEffect(() => {
    if (!isLoading && !isFetching && data) {
      setTitles(data?.data.map((p) => p.title));
    }
  }, [data, isLoading, isFetching]);

  useEffect(() => {
    if (titles.length > 0) {
      setSelectedTitle(titles[0]);
    }
  }, [titles.length]);

  const _onFilterChange = (idx: string, value: any) => {
    setFilter((prev) => ({ ...prev, [idx]: value }));
  };

  if (!data && (!isLoading || !isFetching)) {
    return (
      <div className="flex justify-center text-5xl">
        <div className="flex flex-col items-center">
          <Hammer color={primaryColor} />
          <span className="text-primary text-5xl">Something went wrong</span>
        </div>
      </div>
    );
  }

  if (isLoading) return <IsLoading />;

  return (
    <>
      {/* Delete Modal */}
      {deletePopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center border-b p-4">
              <h2 className="text-lg font-semibold">Are you sure?</h2>
              <button onClick={() => setDeletePopup(false)}>✕</button>
            </div>
            <div className="p-4">
              Do you really want to delete this user? This process cannot be undone.
            </div>
            <div className="flex justify-end gap-2 border-t p-4">
              <button
                onClick={() => setDeletePopup(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Close
              </button>
              <button
                onClick={() => {
                  if (selectedDeleteId) {
                    _onDeletePage(selectedDeleteId);
                    setDeletePopup(false);
                    setSelectedDeleteId(null);
                  }
                }}
                disabled={isDeleteLoading}
                className="px-4 py-2 bg-red-600 text-white rounded disabled:opacity-50"
              >
                {isDeleteLoading ? "Loading..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full px-4">
        <PageHeading
          title="Static Pages"
          onClick={() => setModalShow(true)}
          permissionReq="create_staticpage"
        />
        {!isRestricted("update_staticpage") && (
          <p className="text-sm text-gray-500">
            Press "Ctrl+S" inside editor to save content
          </p>
        )}
      </div>

      <ReactTable
        data={data?.data}
        columns={columns}
        onFilterChange={_onFilterChange}
        filter={filter}
        isDataLoading={isFetching}
        searchPlaceHolder="Search using name"
        deletePermissionReq="delete_banner"
      />

      {/* Create Modal */}
      {modalShow && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
            <div className="flex justify-between items-center border-b p-4">
              <h2 className="text-lg font-semibold">Create Static Page</h2>
              <button onClick={() => setModalShow(false)}>✕</button>
            </div>
            <div className="p-4">
              <StaticPageCreateForm onHideModal={() => setModalShow(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const PageContainer = ({ page, selectedTitle }) => {
  const history = useHistory();
  const isRestricted = useUserProfileStore((state) => state.isRestricted);
  const [contentDetails, setContentDetials] = useState<EditorState>("");

  useEffect(() => {
    if (page) setContentDetials(page.content || "");
  }, [page]);

  const { mutate, isLoading: isUpdatedLoading } = useMutation(updatePageData, {
    onSuccess: () => {
      showMsgToast("Page saved successfully");
      setTimeout(() => queryClient.invalidateQueries(key), 500);
    },
    onError: (error: AxiosError) => {
      handleApiError(error, history);
    },
  });

  const { mutate: mutateDelete, isLoading: isDeleteLoading } = useMutation(
    deletePage,
    {
      onSuccess: () => {
        showMsgToast("Page deleted successfully");
        setTimeout(() => queryClient.invalidateQueries(key), 500);
      },
      onError: (error: AxiosError) => {
        handleApiError(error, history);
      },
    }
  );

  const handleSave = (content: string, pagedata: any) => {
    if (isRestricted("update_staticpage")) return;
    mutate({ formdata: { ...pagedata, content }, id: pagedata.id });
  };

  const _onDeletePage = (pageId: any) => {
    mutateDelete(pageId);
  };

  return (
    <div
      className="p-0 mb-3"
      style={{ display: selectedTitle === page.title ? "block" : "none" }}
    >
      <div
        className={`flex justify-between ${
          !isDesktop ? "flex-col items-start gap-10" : "items-center"
        }`}
      >
        <p className="text-black px-2 text-lg font-bold">{page.title}</p>
        <div className="flex items-center">
          <Restricted to="update_staticpage">
            <button
              className="mr-2 px-3 py-1 bg-blue-600 text-white rounded"
              onClick={() => handleSave(contentDetails, page)}
              disabled={isUpdatedLoading}
            >
              {isUpdatedLoading ? "Loading..." : "Save Changes"}
            </button>
          </Restricted>
          <Restricted to="delete_staticpage">
            <button
              className="mr-2 px-3 py-1 bg-red-600 text-white rounded"
              onClick={() => _onDeletePage(page.id)}
              disabled={isDeleteLoading}
            >
              {isDeleteLoading ? "Loading..." : "Delete page"}
            </button>
          </Restricted>
        </div>
      </div>
      <p className="text-gray-500 px-2">{page.description}</p>
      <div className="mx-auto">
        {isUpdatedLoading ? (
          <IsLoading />
        ) : (
          <div className="bg-gray-100 rounded p-2">
            <textarea
              className="w-full border rounded p-2"
              style={{ minHeight: 300 }}
              value={contentDetails}
              onChange={(e) => setContentDetials(e.target.value)}
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
                  e.preventDefault();
                  handleSave(contentDetails, page);
                }
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default StaticPages;
