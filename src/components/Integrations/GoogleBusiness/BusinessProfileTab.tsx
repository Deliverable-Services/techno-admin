import React, { useState } from "react";
import {
  Row,
  Col,
  Card,
  Badge,
  Modal,
  Image,
  Button,
} from "react-bootstrap";
import {
  FaStar,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";

const dummyPhotos = [
  "https://www.shutterstock.com/image-photo/happy-mid-aged-business-woman-600nw-2353012835.jpg",
  "https://img.freepik.com/free-photo/happy-african-american-bank-manager-shaking-hands-with-client-after-successful-agreement-office_637285-1150.jpg?semt=ais_hybrid&w=740",
  "https://img.freepik.com/premium-photo/group-business-people-are-sitting-circle-with-documents-hands_151013-21563.jpg",
  "https://thumbs.dreamstime.com/b/business-consulting-meeting-working-brainstorming-new-project-finance-investment-concept-148096487.jpg",
  "https://www.theforage.com/blog/wp-content/uploads/2022/09/management-consultant-1024x682.jpg",
  "https://businessconsultingagency.com/wp-content/uploads/2024/09/Benefits-of-US-Market-Services-by-Localized-Professionals.jpg",
];

const dummyReviews = [
  {
    name: "Ajay Kumar",
    rating: 5,
    comment: "Excellent service! Highly recommended.",
    photo: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Priya Singh",
    rating: 4,
    comment: "Good experience overall, will visit again.",
    photo: "https://randomuser.me/api/portraits/women/44.jpg",
  },
];

interface BusinessProfileTabProps {
  organisationId?: number;
}

const GoogleBusinessProfile: React.FC<BusinessProfileTabProps> = ({ organisationId }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  return (
    <div className="my-4 google-buisness">
      {/* Cover Photo */}
      <Image
        src="https://businessconsultingagency.com/wp-content/uploads/2024/09/Benefits-of-US-Market-Services-by-Localized-Professionals.jpg"
        alt="Cover"
        fluid
        rounded
        className="mb-4 g-cover"
      />

      {/* Profile and Info */}
      <Card className="mb-4">
        <Card.Body className="d-flex align-items-center g-user-profile">
          <Image
            src="https://randomuser.me/api/portraits/men/1.jpg"
            roundedCircle
            width="100"
            height="100"
            className="me-3"
          />
          <div>
            <h4 className="mb-0">My Business Name</h4>
            <Badge variant="success" className="mt-1">
              Open Now
            </Badge>
          </div>
        </Card.Body>
      </Card>

      <Row>
        {/* Contact Info */}
        <Col md={6} className="mb-4">
          <Card>
            <Card.Header className="g-card-heading">Contact Information</Card.Header>
            <Card.Body className="g-contact_information">
              <p><strong>Phone:</strong> +91 9876543210</p>
              <p><strong>Email:</strong> info@example.com</p>
              <p><strong>Address:</strong> 123 Street, New Delhi, India</p>
              <p><strong>Website:</strong>{" "}
                <a href="https://example.com" target="_blank" rel="noreferrer">
                  www.example.com
                </a>
              </p>
            </Card.Body>
          </Card>
        </Col>

        {/* Business Hours */}
        <Col md={6} className="mb-4">
          <Card>
            <Card.Header className="g-card-heading">Business Hours</Card.Header>
            <Card.Body>
              {[
                { day: "Monday", hours: "9 AM – 6 PM" },
                { day: "Tuesday", hours: "9 AM – 6 PM" },
                { day: "Wednesday", hours: "9 AM – 6 PM" },
                { day: "Thursday", hours: "9 AM – 6 PM" },
                { day: "Friday", hours: "9 AM – 6 PM" },
                { day: "Saturday", hours: "10 AM – 4 PM" },
                { day: "Sunday", hours: "Closed" },
              ].map((item, index) => (
                <div key={index} className="d-flex justify-content-between border-bottom py-1">
                  <strong>{item.day}</strong>
                  <span>{item.hours}</span>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Review Summary */}
      <Card className="mb-4">
        <Card.Header className="g-card-heading">Review Summary</Card.Header>
        <Card.Body>
          <Row>
            <Col md={4} className="text-center mb-3">
              <h1 className="display-4 mb-0">4.9</h1>
              <div className="text-warning mb-2">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} color="#f4c150" />
                ))}
              </div>
              <div className="text-info">63 reviews</div>
            </Col>

            <Col md={8}>
              {[5, 4, 3, 2, 1].map((star, idx) => {
                const percentage = star === 5 ? 90 : star === 4 ? 5 : 1;
                return (
                  <div key={idx} className="d-flex align-items-center mb-2">
                    <strong className="me-2" style={{ width: "20px" }}>{star}</strong>
                    <div className="flex-grow-1 bg-light rounded-pill overflow-hidden me-2" style={{ height: "8px" }}>
                      <div style={{
                        width: `${percentage}%`,
                        height: "100%",
                        backgroundColor: "#f4c150"
                      }} />
                    </div>
                  </div>
                );
              })}
            </Col>
          </Row>

          <div className="mt-4 review-summery">
            <div className="d-flex align-items-center mb-3">
              <Image src="https://randomuser.me/api/portraits/women/65.jpg" roundedCircle width={40} height={40} className="me-3" />
              <p className="mb-0">"Nice company with nice <strong>environment</strong> and nice <strong>people</strong> 😊"</p>
            </div>
            <div className="d-flex align-items-center mb-3">
              <Image src="https://randomuser.me/api/portraits/men/52.jpg" roundedCircle width={40} height={40} className="me-3" />
              <p className="mb-0">"It's a great <strong>place</strong> to work, and I highly recommend it."</p>
            </div>
            <div className="d-flex align-items-center mb-3">
              <Image src="https://randomuser.me/api/portraits/men/60.jpg" roundedCircle width={40} height={40} className="me-3" />
              <p className="mb-0">"The work <strong>environment</strong> is positive, and the <strong>management</strong> truly values <strong>employees</strong>."</p>
            </div>
          </div>

          <div className="text-center mt-4">
            <Button variant="info" className="px-4">📝 Write a review</Button>
          </div>
        </Card.Body>
      </Card>

      {/* Customer Reviews */}
      <Card className="mb-4">
        <Card.Header className="g-card-heading">Customer Reviews</Card.Header>
        <Card.Body>
          {dummyReviews.map((review, index) => (
            <div className="d-flex mb-4 g-reviews" key={index}>
              <Image
                src={review.photo}
                roundedCircle
                width="50"
                height="50"
                className="me-3"
              />
              <div>
                <h6 className="mb-1">{review.name}</h6>
                <div className="text-warning mb-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} color={i < review.rating ? "#f4c150" : "#ccc"} />
                  ))}
                </div>
                <p className="mb-0">{review.comment}</p>
              </div>
            </div>
          ))}
        </Card.Body>
      </Card>

      {/* Photo Gallery */}
      <Card className="mb-4">
        <Card.Header className="g-card-heading">Photo Gallery</Card.Header>
        <Card.Body>
          <Row>
            {dummyPhotos.map((url, index) => (
              <Col md={4} sm={6} xs={6} key={index} className="mb-3">
                <Image
                  src={url}
                  thumbnail
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelectedPhoto(url)}
                />
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>

      {/* Photo Modal */}
      <Modal show={!!selectedPhoto} onHide={() => setSelectedPhoto(null)} centered size="lg">
        <Modal.Body className="text-center">
          <Image src={selectedPhoto!} fluid />
        </Modal.Body>
      </Modal>

      {/* About */}
      <Card className="mb-4">
        <Card.Header className="g-card-heading">About</Card.Header>
        <Card.Body>
          <p>
            We are a dedicated business offering top-tier services in New Delhi.
            Our aim is customer satisfaction and long-term relationships.
          </p>
        </Card.Body>
      </Card>

      {/* Features */}
      <Card className="mb-4">
        <Card.Header className="g-card-heading">Business Features</Card.Header>
        <Card.Body>
          <ul className="g-b-features">
            <li>24/7 Support</li>
            <li>Online Payments</li>
            <li>Parking Available</li>
            <li>Wheelchair Accessible</li>
          </ul>
        </Card.Body>
      </Card>

      {/* Social Links */}
      <Card>
        <Card.Header className="g-card-heading">Connect with Us</Card.Header>
        <Card.Body className="d-flex gap-3 g-social">
          <a href="#"><FaFacebook size={24} /></a>
          <a href="#"><FaInstagram size={24} /></a>
          <a href="#"><FaTwitter size={24} /></a>
          <a href="#"><FaYoutube size={24} /></a>
        </Card.Body>
      </Card>
    </div>
  );
};

export default GoogleBusinessProfile;
