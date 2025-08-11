import { AxiosError } from "axios";
import React from "react";
import { Col, Container, Row } from "../components/ui/bootstrap-compat";
import { useMutation } from "react-query";
import { useHistory } from "react-router-dom";
import { handleApiError } from "../hooks/handleApiErrors";
import API from "../utils/API";
import { config } from "../utils/constants";
import { queryClient } from "../utils/queryClient";
import { showMsgToast } from "../utils/showMsgToast";
import { Hammer } from "../components/ui/icon";

type Folder = "services" | "plans";

interface Props {
  images: Array<any>;
  folder: Folder;
}

const deleteImage = ({ imageId, type }: { imageId: string; type: Folder }) => {
  if (type === "services")
    return API.post(`services/delete-image`, { id: imageId });

  return API.post(`plans/delete-image`, { id: imageId });
};

const ImagesContainer = ({ images, folder }: Props) => {
  const history = useHistory();
  const { mutate, isLoading, error, status } = useMutation(deleteImage, {
    onSuccess: () => {
      if (folder === "services") queryClient.invalidateQueries("services");
      else queryClient.invalidateQueries("plans");
      showMsgToast("Image deleted successfully");
    },
    onError: (error: AxiosError) => {
      handleApiError(error, history);
    },
  });

  if (!images && !images?.length)
    return (
      <Container fluid className="d-flex justify-content-center display-3">
        <div className="d-flex flex-column align-items-center pt-3 pb-3">
          <Hammer color="#000" size={60} />
          <h4 className="text-black font-weight-bold mt-2">No Images found</h4>
        </div>
      </Container>
    );

  return (
    <>
      {isLoading && <p className="text-muted text-center">Deleting...</p>}
      <Row className="mt-3 ">
        {images.map((file) => (
          <Col sm={6} className="mt-2">
            <div
              className="card shadow p-relative"
              style={{ height: "200px", position: "relative" }}
            >
              <div
                style={{
                  top: 0,
                  right: 0,
                  position: "absolute",
                  background: "red",
                }}
                className="p-1"
                onClick={() => {
                  mutate({ imageId: file.id, type: folder });
                }}
              >
                <button type="button" className="p-0">
                  <Hammer color="#fff" size={14} />
                </button>
              </div>
              <img
                src={`${config.baseUploadUrl}${folder}/${file.image}`}
                alt={file.image}
              />
            </div>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default ImagesContainer;
