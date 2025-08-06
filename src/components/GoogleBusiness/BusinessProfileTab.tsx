import React from "react";
import { Row, Col, Card, Badge, Alert } from "react-bootstrap";
import { useQuery } from "react-query";
import googleBusinessService, {
  BusinessProfile,
} from "../../services/googleBusinessService";
import IsLoading from "../../shared-components/isLoading";
import moment from "moment";

interface BusinessProfileTabProps {
  organisationId?: number;
}

const BusinessProfileTab: React.FC<BusinessProfileTabProps> = ({
  organisationId,
}) => {
  const {
    data: profile,
    isLoading,
    error,
  } = useQuery<BusinessProfile>(
    ["google-business-profile", organisationId],
    () => googleBusinessService.getBusinessProfile(organisationId!),
    {
      enabled: !!organisationId,
      retry: false,
    }
  );

  if (isLoading) {
    return <IsLoading />;
  }

  if (error) {
    console.error("Profile error details:", error);
    return (
      <Alert variant="danger">
        <i className="fas fa-exclamation-circle me-2"></i>
        Failed to load business profile. Please try again later.
        <details className="mt-2">
          <summary>Error Details</summary>
          <pre className="small">{JSON.stringify(error, null, 2)}</pre>
        </details>
      </Alert>
    );
  }

  if (!profile) {
    return (
      <Alert variant="info">
        <i className="fas fa-info-circle me-2"></i>
        No business profile data available.
        <div className="mt-2 small">
          <strong>Debug Info:</strong>
          <br />
          Organisation ID: {organisationId}
          <br />
          Loading: {isLoading ? "Yes" : "No"}
          <br />
          Error: {error ? "Yes" : "No"}
        </div>
      </Alert>
    );
  }

  const formatAddress = (address: any) => {
    if (address?.formatted_address) {
      return address.formatted_address;
    }
    return "No address available";
  };

  const formatHours = (hours: any) => {
    if (!hours) return [];

    const daysOrder = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];
    return daysOrder.map((day) => ({
      day: day.charAt(0).toUpperCase() + day.slice(1),
      hours: hours[day] ? `${hours[day].open} - ${hours[day].close}` : "Closed",
    }));
  };

  return (
    <Row>
      {/* Profile Header */}
      <Col md={12} className="mb-4">
        <Card>
          <Card.Body>
            <Row className="align-items-center">
              <Col md={3} className="text-center">
                {profile.profile_photo?.url ? (
                  <img
                    src={profile.profile_photo.url}
                    alt={profile.name}
                    className="rounded-circle"
                    style={{
                      width: "120px",
                      height: "120px",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    className="rounded-circle bg-light d-flex align-items-center justify-content-center text-muted"
                    style={{ width: "120px", height: "120px" }}
                  >
                    <i className="fas fa-store fa-3x"></i>
                  </div>
                )}
              </Col>
              <Col md={9}>
                <h2 className="mb-2">{profile.name}</h2>
                {profile.title && (
                  <h5 className="text-muted mb-3">{profile.title}</h5>
                )}

                <div className="mb-3">
                  {profile.categories?.map((category, index) => (
                    <Badge key={index} bg="primary" className="me-2 mb-1">
                      {category.display_name || category.name}
                    </Badge>
                  ))}
                </div>

                {profile.rating && (
                  <div className="mb-2">
                    <span className="h5 me-2">{profile.rating.toFixed(1)}</span>
                    <span className="text-warning me-2">
                      {[...Array(5)].map((_, i) => (
                        <i
                          key={i}
                          className={`fas fa-star ${i < Math.floor(profile.rating) ? "" : "text-muted"
                            }`}
                        ></i>
                      ))}
                    </span>
                    {profile.review_count && (
                      <span className="text-muted">
                        ({profile.review_count} reviews)
                      </span>
                    )}
                  </div>
                )}
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>

      {/* Contact Information */}
      <Col md={6} className="mb-4">
        <Card className="h-100">
          <Card.Header>
            <h5 className="mb-0">
              <i className="fas fa-address-book me-2"></i>
              Contact Information
            </h5>
          </Card.Header>
          <Card.Body>
            <div className="mb-3">
              <strong className="d-block text-muted small mb-1">ADDRESS</strong>
              <p className="mb-0">
                <i className="fas fa-map-marker-alt me-2 text-primary"></i>
                {formatAddress(profile.address)}
              </p>
            </div>

            {profile.phone && (
              <div className="mb-3">
                <strong className="d-block text-muted small mb-1">PHONE</strong>
                <p className="mb-0">
                  <i className="fas fa-phone me-2 text-primary"></i>
                  <a
                    href={`tel:${profile.phone}`}
                    className="text-decoration-none"
                  >
                    {profile.phone}
                  </a>
                </p>
              </div>
            )}

            {profile.website && (
              <div className="mb-3">
                <strong className="d-block text-muted small mb-1">
                  WEBSITE
                </strong>
                <p className="mb-0">
                  <i className="fas fa-globe me-2 text-primary"></i>
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-decoration-none"
                  >
                    {profile.website}
                  </a>
                </p>
              </div>
            )}
          </Card.Body>
        </Card>
      </Col>

      {/* Business Hours */}
      <Col md={6} className="mb-4">
        <Card className="h-100">
          <Card.Header>
            <h5 className="mb-0">
              <i className="fas fa-clock me-2"></i>
              Business Hours
            </h5>
          </Card.Header>
          <Card.Body>
            {formatHours(profile.hours).map((day, index) => (
              <div key={index} className="d-flex justify-content-between mb-2">
                <span className="fw-bold">{day.day}</span>
                <span className={day.hours === "Closed" ? "text-muted" : ""}>
                  {day.hours}
                </span>
              </div>
            ))}
          </Card.Body>
        </Card>
      </Col>

      {/* Cover Photo */}
      {profile.cover_photo?.url && (
        <Col md={12} className="mb-4">
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-image me-2"></i>
                Cover Photo
              </h5>
            </Card.Header>
            <Card.Body className="p-0">
              <img
                src={profile.cover_photo.url}
                alt="Business Cover"
                className="w-100"
                style={{ maxHeight: "300px", objectFit: "cover" }}
              />
            </Card.Body>
          </Card>
        </Col>
      )}

      {/* Business Description */}
      {profile.description && (
        <Col md={12} className="mb-4">
          <Card>
            <Card.Body>
              <h5 className="mb-3">
                <i className="fas fa-info-circle me-2 text-info"></i>
                About Our Business
              </h5>
              <p className="text-muted mb-0">{profile.description}</p>
            </Card.Body>
          </Card>
        </Col>
      )}

      {/* Business Attributes */}
      {profile.attributes && profile.attributes.length > 0 && (
        <Col md={12} className="mb-4">
          <Card>
            <Card.Body>
              <h5 className="mb-3">
                <i className="fas fa-tags me-2 text-secondary"></i>
                Business Features
              </h5>
              <Row>
                {profile.attributes.map((attr, index) => (
                  <Col md={6} key={index} className="mb-2">
                    <div className="d-flex align-items-center">
                      {attr.value ? (
                        <i className="fas fa-check-circle text-success me-2"></i>
                      ) : (
                        <i className="fas fa-times-circle text-danger me-2"></i>
                      )}
                      <span className="text-capitalize">
                        {attr.name.replace(/_/g, " ")}
                      </span>
                    </div>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      )}
    </Row>
  );
};

export default BusinessProfileTab;