import React, { useState } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  Modal,
  Form,
  Alert,
  Badge,
  Pagination,
} from "react-bootstrap";
import { useQuery, useMutation, useQueryClient } from "react-query";
import googleBusinessService, {
  BusinessReview,
  ReviewReplyRequest,
} from "../../services/googleBusinessService";
import IsLoading from "../../shared-components/isLoading";
import moment from "moment";
import { showMsgToast } from "../../utils/showMsgToast";
import { showErrorToast } from "../../utils/showErrorToast";

interface ReviewsTabProps {
  organisationId?: number;
}

const ReviewsTab: React.FC<ReviewsTabProps> = ({ organisationId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState<BusinessReview | null>(
    null
  );
  const [replyText, setReplyText] = useState("");

  const queryClient = useQueryClient();

  const {
    data: reviewsData,
    isLoading,
    error,
  } = useQuery(
    ["google-business-reviews", organisationId, currentPage],
    () =>
      googleBusinessService.getBusinessReviews(
        organisationId!,
        currentPage,
        10
      ),
    {
      enabled: !!organisationId,
      retry: false,
      keepPreviousData: true,
    }
  );

  const replyMutation = useMutation(
    (replyData: ReviewReplyRequest) =>
      googleBusinessService.replyToReview(organisationId!, replyData),
    {
      onSuccess: () => {
        showMsgToast("Reply sent successfully!");
        setShowReplyModal(false);
        setReplyText("");
        setSelectedReview(null);
        queryClient.invalidateQueries([
          "google-business-reviews",
          organisationId,
        ]);
      },
      onError: (error: any) => {
        showErrorToast("Failed to send reply. Please try again.");
        console.error("Reply error:", error);
      },
    }
  );

  const handleReplyClick = (review: BusinessReview) => {
    setSelectedReview(review);
    setShowReplyModal(true);
    setReplyText("");
  };

  const handleSendReply = () => {
    if (!selectedReview || !replyText.trim()) {
      showErrorToast("Please enter a reply message.");
      return;
    }

    replyMutation.mutate({
      review_id: selectedReview.id,
      reply_text: replyText.trim(),
    });
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <i
        key={i}
        className={`fas fa-star ${i < rating ? "text-warning" : "text-muted"}`}
      ></i>
    ));
  };

  const getReviewBadgeVariant = (rating: number) => {
    if (rating >= 4) return "success";
    if (rating >= 3) return "warning";
    return "danger";
  };

  if (isLoading) {
    return <IsLoading />;
  }

  if (error) {
    console.error("Reviews error details:", error);
    return (
      <Alert variant="danger">
        <i className="fas fa-exclamation-circle me-2"></i>
        Failed to load reviews. Please try again later.
        <details className="mt-2">
          <summary>Error Details</summary>
          <pre className="small">{JSON.stringify(error, null, 2)}</pre>
        </details>
      </Alert>
    );
  }

  const reviews = reviewsData?.reviews || [];
  const totalPages = reviewsData?.total_pages || 1;
  const totalReviews = reviewsData?.total || 0;

  return (
    <>
      <Row>
        <Col md={12} className="mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <h4>
              <i className="fas fa-star me-2 text-warning"></i>
              Customer Reviews
              <Badge variant="secondary" className="ms-2">
                {totalReviews} total
              </Badge>
            </h4>
            <div className="text-muted small">
              Page {currentPage} of {totalPages}
              {reviews.length > 0 && (
                <span className="ms-2">
                  Showing {reviews.length} review
                  {reviews.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>

          {/* Reviews Summary */}
          {totalReviews > 0 && (
            <div className="mt-3 p-3 bg-light rounded">
              <Row className="text-center">
                <Col md={3}>
                  <div className="h5 mb-1 text-primary">{totalReviews}</div>
                  <div className="small text-muted">Total Reviews</div>
                </Col>
                <Col md={3}>
                  <div className="h5 mb-1 text-success">
                    {reviews.filter((r) => r.rating >= 4).length}
                  </div>
                  <div className="small text-muted">Positive (4-5★)</div>
                </Col>
                <Col md={3}>
                  <div className="h5 mb-1 text-warning">
                    {reviews.filter((r) => r.rating === 3).length}
                  </div>
                  <div className="small text-muted">Neutral (3★)</div>
                </Col>
                <Col md={3}>
                  <div className="h5 mb-1 text-info">
                    {reviews.filter((r) => r.reply).length}
                  </div>
                  <div className="small text-muted">With Replies</div>
                </Col>
              </Row>
            </div>
          )}
        </Col>

        {reviews.length === 0 ? (
          <Col md={12}>
            <Alert variant="info" className="text-center py-5">
              <i className="fas fa-comment-slash fa-3x text-muted mb-3"></i>
              <h5>No reviews on this page</h5>
              <p className="mb-0">
                {totalReviews > 0
                  ? `There are ${totalReviews} total reviews. Try navigating to other pages.`
                  : "Reviews from your Google Business Profile will appear here."}
              </p>
            </Alert>
          </Col>
        ) : (
          reviews.map((review) => (
            <Col md={12} key={review.id} className="mb-4">
              <Card>
                <Card.Body>
                  <Row>
                    <Col md={2} className="text-center">
                      {review.reviewer_photo_url ? (
                        <img
                          src={review.reviewer_photo_url}
                          alt={review.reviewer_name}
                          className="rounded-circle mb-2"
                          style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <div
                          className="rounded-circle bg-light d-flex align-items-center justify-content-center text-muted mb-2"
                          style={{ width: "60px", height: "60px" }}
                        >
                          <i className="fas fa-user"></i>
                        </div>
                      )}
                      <div className="small text-muted">
                        {moment(review.created_time).format("MMM D, YYYY")}
                      </div>
                    </Col>

                    <Col md={10}>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <h6 className="mb-1">{review.reviewer_name}</h6>
                          <div className="mb-2">
                            <span className="me-2">
                              {renderStars(review.rating)}
                            </span>
                            <Badge variant={getReviewBadgeVariant(review.rating)}>
                              {review.rating}/5
                            </Badge>
                          </div>
                        </div>

                        {!review.reply && (
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleReplyClick(review)}
                          >
                            <i className="fas fa-reply me-1"></i>
                            Reply
                          </Button>
                        )}
                      </div>

                      <p className="mb-3">{review.comment}</p>

                      {review.reply && (
                        <div className="border-start border-primary ps-3 mt-3">
                          <div className="d-flex align-items-center mb-2">
                            <i className="fas fa-store me-2 text-primary"></i>
                            <strong>Business Response</strong>
                            <span className="text-muted ms-2 small">
                              {moment(review.reply.created_time).format(
                                "MMM D, YYYY"
                              )}
                            </span>
                          </div>
                          <p className="mb-0 text-dark">
                            {review.reply.comment}
                          </p>
                        </div>
                      )}
                    </Col>
                  </Row>
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

      {/* Reply Modal */}
      <Modal
        show={showReplyModal}
        onHide={() => setShowReplyModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-reply me-2"></i>
            Reply to Review
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedReview && (
            <div className="mb-4 p-3 bg-light rounded">
              <div className="d-flex align-items-center mb-2">
                <strong>{selectedReview.reviewer_name}</strong>
                <span className="ms-2">
                  {renderStars(selectedReview.rating)}
                </span>
              </div>
              <p className="mb-0 text-muted">{selectedReview.comment}</p>
            </div>
          )}

          <Form.Group>
            <Form.Label>Your Reply</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a professional response to this review..."
              maxLength={500}
            />
            <Form.Text className="text-muted">
              {replyText.length}/500 characters
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowReplyModal(false)}
            disabled={replyMutation.isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSendReply}
            disabled={replyMutation.isLoading || !replyText.trim()}
          >
            {replyMutation.isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin me-2"></i>
                Sending...
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane me-2"></i>
                Send Reply
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ReviewsTab;
