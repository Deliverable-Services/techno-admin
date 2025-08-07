import React, { useState } from "react";
import {
  Row,
  Col,
  Card,
  Modal,
  Button,
  Badge,
  Pagination,
  Alert,
} from "react-bootstrap";
import { useQuery } from "react-query";
import googleBusinessService, {
  BusinessImage,
} from "../../services/googleBusinessService";
import IsLoading from "../../shared-components/isLoading";
import moment from "moment";

interface ImagesTabProps {
  organisationId?: number;
}

const ImagesTab: React.FC<ImagesTabProps> = ({ organisationId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<BusinessImage | null>(
    null
  );
  const [imageFilter, setImageFilter] = useState<string>("all");

  const {
    data: imagesData,
    isLoading,
    error,
  } = useQuery(
    ["google-business-images", organisationId, currentPage],
    () =>
      googleBusinessService.getBusinessImages(organisationId!, currentPage, 20),
    {
      enabled: !!organisationId,
      retry: false,
      keepPreviousData: true,
    }
  );

  const handleImageClick = (image: BusinessImage) => {
    setSelectedImage(image);
    setShowImageModal(true);
  };

  const getImageTypeBadge = (type: string) => {
    const variants: { [key: string]: string } = {
      COVER: "primary",
      LOGO: "success",
      ADDITIONAL: "secondary",
    };
    return variants[type] || "secondary";
  };

  const getImageTypeIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      COVER: "fas fa-image",
      LOGO: "fas fa-store",
      ADDITIONAL: "fas fa-photo-video",
    };
    return icons[type] || "fas fa-image";
  };

  const filteredImages = React.useMemo(() => {
    if (!imagesData?.images) return [];
    if (imageFilter === "all") return imagesData.images;
    return imagesData.images.filter(
      (image) => image.image_type === imageFilter
    );
  }, [imagesData?.images, imageFilter]);

  if (isLoading) {
    return <IsLoading />;
  }

  if (error) {
    return (
      <Alert variant="danger">
        <i className="fas fa-exclamation-circle me-2"></i>
        Failed to load images. Please try again later.
      </Alert>
    );
  }

  const images = imagesData?.images || [];
  const totalPages = imagesData?.total_pages || 1;

  return (
    <>
      <Row>
        <Col md={12} className="mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <h4>
              <i className="fas fa-images me-2 text-primary"></i>
              Business Images
              {imagesData?.total && (
                <Badge variant="secondary" className="ms-2">
                  {imagesData.total} total
                </Badge>
              )}
            </h4>

            {/* Filter Buttons */}
            <div className="btn-group" role="group">
              <Button
                variant={imageFilter === "all" ? "primary" : "outline-primary"}
                size="sm"
                onClick={() => setImageFilter("all")}
              >
                All
              </Button>
              <Button
                variant={
                  imageFilter === "COVER" ? "primary" : "outline-primary"
                }
                size="sm"
                onClick={() => setImageFilter("COVER")}
              >
                Cover
              </Button>
              <Button
                variant={imageFilter === "LOGO" ? "primary" : "outline-primary"}
                size="sm"
                onClick={() => setImageFilter("LOGO")}
              >
                Logo
              </Button>
              <Button
                variant={
                  imageFilter === "ADDITIONAL" ? "primary" : "outline-primary"
                }
                size="sm"
                onClick={() => setImageFilter("ADDITIONAL")}
              >
                Additional
              </Button>
            </div>
          </div>
        </Col>

        {filteredImages.length === 0 ? (
          <Col md={12}>
            <Alert variant="info" className="text-center py-5">
              <i className="fas fa-images fa-3x text-muted mb-3"></i>
              <h5>No images found</h5>
              <p className="mb-0">
                {imageFilter === "all"
                  ? "No images have been uploaded to your Google Business Profile yet."
                  : `No ${imageFilter.toLowerCase()} images found.`}
              </p>
            </Alert>
          </Col>
        ) : (
          filteredImages.map((image) => (
            <Col lg={3} md={4} sm={6} key={image.id} className="mb-4">
              <Card className="h-100 shadow-sm">
                <div
                  className="position-relative overflow-hidden"
                  style={{ height: "200px", cursor: "pointer" }}
                  onClick={() => handleImageClick(image)}
                >
                  <img
                    src={image.url}
                    alt={image.alt_text || "Business image"}
                    className="w-100 h-100"
                    style={{
                      objectFit: "cover",
                      transition: "transform 0.3s ease",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.transform = "scale(1.05)")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  />

                  {/* Image Type Badge */}
                  <Badge
                    variant={getImageTypeBadge(image.image_type)}
                    className="position-absolute top-0 start-0 m-2"
                  >
                    <i
                      className={`${getImageTypeIcon(image.image_type)} me-1`}
                    ></i>
                    {image.image_type}
                  </Badge>

                  {/* Overlay on hover */}
                  <div
                    className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                    style={{
                      backgroundColor: "rgba(0,0,0,0.5)",
                      opacity: 0,
                      transition: "opacity 0.3s ease",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.opacity = "1")}
                    onMouseOut={(e) => (e.currentTarget.style.opacity = "0")}
                  >
                    <Button variant="light" size="sm">
                      <i className="fas fa-search-plus me-1"></i>
                      View
                    </Button>
                  </div>
                </div>

                <Card.Body className="p-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      <i className="fas fa-calendar me-1"></i>
                      {moment(image.upload_time).format("MMM D, YYYY")}
                    </small>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleImageClick(image)}
                    >
                      <i className="fas fa-eye"></i>
                    </Button>
                  </div>

                  {image.alt_text && (
                    <div className="mt-2">
                      <small className="text-muted">{image.alt_text}</small>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Col md={12} className="d-flex justify-content-center">
            <Pagination>
              <Pagination.First
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              />
              <Pagination.Prev
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              />

              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 2 && page <= currentPage + 2)
                ) {
                  return (
                    <Pagination.Item
                      key={page}
                      active={page === currentPage}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Pagination.Item>
                  );
                }
                return null;
              })}

              <Pagination.Next
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              />
              <Pagination.Last
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              />
            </Pagination>
          </Col>
        )}
      </Row>

      {/* Image Modal */}
      <Modal
        show={showImageModal}
        onHide={() => setShowImageModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedImage && (
              <>
                <i
                  className={`${getImageTypeIcon(
                    selectedImage.image_type
                  )} me-2`}
                ></i>
                {selectedImage.image_type} Image
              </>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center p-0">
          {selectedImage && (
            <>
              <img
                src={selectedImage.url}
                alt={selectedImage.alt_text || "Business image"}
                className="w-100"
                style={{ maxHeight: "70vh", objectFit: "contain" }}
              />

              <div className="p-3">
                <div className="row">
                  <div className="col-md-6">
                    <strong className="d-block text-muted small mb-1">
                      UPLOAD DATE
                    </strong>
                    <p className="mb-0">
                      {moment(selectedImage.upload_time).format(
                        "MMMM D, YYYY h:mm A"
                      )}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <strong className="d-block text-muted small mb-1">
                      IMAGE TYPE
                    </strong>
                    <Badge variant={getImageTypeBadge(selectedImage.image_type)}>
                      {selectedImage.image_type}
                    </Badge>
                  </div>
                </div>

                {selectedImage.alt_text && (
                  <div className="mt-3">
                    <strong className="d-block text-muted small mb-1">
                      DESCRIPTION
                    </strong>
                    <p className="mb-0">{selectedImage.alt_text}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-primary"
            onClick={() =>
              selectedImage && window.open(selectedImage.url, "_blank")
            }
          >
            <i className="fas fa-external-link-alt me-1"></i>
            Open Original
          </Button>
          <Button variant="secondary" onClick={() => setShowImageModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ImagesTab;
