import { AxiosError } from "axios";
import BraftEditor, { EditorState } from "braft-editor";
import { title } from "process";
import React, { useState } from "react";
import { useEffect } from "react";
import { Button, Container } from "react-bootstrap";
import { BiSad } from "react-icons/bi";
import { useMutation, useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { handleApiError } from "../../hooks/handleApiErrors";
import EditButton from "../../shared-components/EditButton";
import IsLoading from "../../shared-components/isLoading";
import PageHeading from "../../shared-components/PageHeading";
import API from "../../utils/API";
import { primaryColor } from "../../utils/constants";
import { queryClient } from "../../utils/queryClient";
import { showMsgToast } from "../../utils/showMsgToast";

const key = "staticPages";

const updatePageData = ({ formdata, id }: { formdata: any; id: string }) => {
  return API.post(`${key}/${id}`, formdata);
};
const deletePage = (id: any) => {
  return API.post(`${key}/delete`, { id });
};
const StaticPages = () => {
  const history = useHistory();

  const { data, isLoading, isFetching } = useQuery<any>([key]);
  const { mutate, isLoading: isUpdatedLoading } = useMutation(updatePageData, {
    onSuccess: () => {
      showMsgToast("Page  saved successfully");
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
        showMsgToast("Page  deleted successfully");
        setTimeout(() => queryClient.invalidateQueries(key), 500);
      },
      onError: (error: AxiosError) => {
        handleApiError(error, history);
      },
    }
  );
  const [titles, setTitles] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState(titles[0]);

  useEffect(() => {
    if (isLoading || isFetching) return;
    if (!data) return;

    setTitles(data?.data.map((p) => p.title));
  }, [data, isLoading, isFetching]);
  useEffect(() => {
    if (titles.length > 0) {
      setSelectedTitle(titles[0]);
    }
  }, [titles.length]);

  const _onCreateClick = () => {
    history.push("/static-pages/create-edit");
  };

  const _onEditPageClick = (pageId: any) => {
    // history.push("/static-pages/create-edit");
    console.log("on edit ", pageId);
  };

  const handleSave = (editorState: EditorState, pagedata: any) => {
    const content = editorState.toHTML();
    const formdata = {
      ...pagedata,
      content,
    };
    mutate({ formdata, id: pagedata.id });
  };
  const _onDeletePage = (pageId: any) => {
    console.log("delete page", pageId);
    mutateDelete(pageId);
  };

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

  if (isLoading) return <IsLoading />;

  return (
    <>
      <PageHeading title="Static Pages" onClick={_onCreateClick} />
      <p className="small text-muted">
        Pres Ctrl+S inside editor to save content
      </p>
      <Container fluid className="px-0 my-3">
        {titles?.map((title) => (
          <Button
            variant={selectedTitle === title ? "primary" : "outline-primary"}
            className="mr-2"
            onClick={() => setSelectedTitle(title)}
          >
            {title}
          </Button>
        ))}
      </Container>

      {data?.data.map((page) => (
        <Container
          fluid
          className="p-0 mb-3"
          style={{ display: selectedTitle === page.title ? "block" : "none" }}
        >
          <div className="card">
            <div className="card-title d-flex align-items-center justify-content-between">
              <h3 className="text-black px-2">
                <b>{page.title}</b>
              </h3>
              <div className="d-flex align-items-center">
                <Button
                  className="mr-2"
                  variant="danger"
                  onClick={() => _onDeletePage(page.id)}
                  disabled={isDeleteLoading}
                >
                  {isDeleteLoading ? "Loading..." : "Delete"}
                </Button>
                {/* <EditButton onClick={() => _onEditPageClick(page.id)} /> */}
              </div>
            </div>
            <p className="text-muted px-2">{page.description}</p>
            <div className="mx-auto">
              {isFetching || isUpdatedLoading ? (
                <IsLoading />
              ) : (
                <BraftEditor
                  value={BraftEditor.createEditorState(page.content)}
                  onSave={(editorState: EditorState) =>
                    handleSave(editorState, page)
                  }
                  language="en"
                />
              )}
            </div>
          </div>
        </Container>
      ))}
    </>
  );
};

export default StaticPages;
