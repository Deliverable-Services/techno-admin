import React from "react";
import { Row, Col, Card } from "react-bootstrap";

const PlatformTab = ({
  formData,
  handleInputChange,
  selectedSocial,
  setSelectedSocial,
  socialValue,
  setSocialValue,
  socialOptions,
  handleAddSocial,
  handleRemoveSocial,
}) => (
  <div>
    <div className="tab-header">
      <h4>Platform Configurations</h4>
      <p>Used for setting global business rules or platform logic.</p>
    </div>
    <div className="right-content">
      <div className="profile-card d-flex flex-column align-items-center">
        <div className="border-div form-group w-100 mt-4 d-flex align-items-center">
          <label htmlFor="minOrderCart">Minimum Order Cart</label>
          <input
            type="number"
            className="form-control input-div"
            id="minOrderCart"
            name="minOrderCart"
            value={formData.minOrderCart}
            onChange={handleInputChange}
            placeholder="Enter minimum order cart value"
          />
        </div>
        <div className="border-div form-group w-100 mt-3 d-flex align-items-center">
          <label htmlFor="copyrightMsg">Copyright Message</label>
          <input
            type="text"
            className="form-control input-div"
            id="copyrightMsg"
            name="copyrightMsg"
            value={formData.copyrightMsg}
            onChange={handleInputChange}
            placeholder="Enter copyright message"
          />
        </div>
        <div className="form-group w-100 mt-3">
          <div className="d-flex">
            <label>Social Media Links</label>
            <div className="d-flex align-items-center justify-end mb-4">
              <select
                className="form-control mr-2 form-custom"
                style={{ maxWidth: "fit-content" }}
                value={selectedSocial}
                onChange={(e) => setSelectedSocial(e.target.value)}
              >
                <option value="">Select Social Platform</option>
                {socialOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <input
                type="text"
                className="form-control mr-2"
                style={{ maxWidth: 300 }}
                placeholder="Enter link or username"
                value={socialValue}
                onChange={(e) => setSocialValue(e.target.value)}
                disabled={!selectedSocial}
              />
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAddSocial}
                disabled={!selectedSocial || !socialValue}
              >
                Add
              </button>
            </div>
          </div>
          <Row className="g-3 social-cards px-2">
            {formData.socialLinks.map((link, idx) => {
              const opt = socialOptions.find((o) => o.value === link.type);
              return (
                <Col key={idx} xs={12} sm={6} md={4} lg={3} className="p-2">
                  <Card className="position-relative mb-3 shadow-sm border-0 mb-0">
                    <button
                      type="button"
                      className="close position-absolute"
                      style={{
                        top: "10px",
                        right: "10px",
                        zIndex: 1,
                      }}
                      onClick={() => handleRemoveSocial(idx)}
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                    <Card.Body className="d-flex align-items-center">
                      <div className="d-flex align-items-top">
                        <span
                          className="d-flex icon-social-media"
                          style={{ fontSize: 30, marginRight: 10 }}
                        >
                          {opt?.icon}
                        </span>
                        <div>
                          <div className="font-weight-bold ">{opt?.label}</div>
                          <div
                            className="text-muted small"
                            style={{ wordBreak: "break-word" }}
                          >
                            {link.value}
                          </div>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </div>
      </div>
    </div>
  </div>
);

export default PlatformTab;