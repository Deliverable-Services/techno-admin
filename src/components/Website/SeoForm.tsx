import React, { useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Button, Spinner } from "react-bootstrap";

const sampleData = {
  id: 1,
  name: "Website A",
  seoDetails: {
    metaTitle: "Meta A",
    metaDescription: "Description A",
    metaKeywords: ["keyword1", "keyword2"],
    socialFeaturedImage: "https://picsum.photos/300/200",
  },
  organisationId: "org-123",
  lastEditedOn: "2025-07-20",
  isPublished: 1,
  isArchived: 0,
};

const validationSchema = Yup.object().shape({
  metaTitle: Yup.string().required("Meta title is required"),
  metaDescription: Yup.string().required("Meta description is required"),
  metaKeywords: Yup.string().required("Meta keywords are required"),
  socialFeaturedImage: Yup.string().url("Must be a valid URL"),
});

const SeoForm = ({ seoDetails }) => {
  useEffect(() => {
    // Any bootstrap input init logic if needed
  }, []);
  console.log(seoDetails, "seoDetails");
  return (
    <div className="card view-padding p-4 mt-3">
      <h4 className="mb-3">SEO Details</h4>
      <Formik
        initialValues={{
          metaTitle: seoDetails.metaTitle,
          metaDescription: seoDetails.metaDescription,
          metaKeywords: seoDetails.metaKeywords.join(", "),
          socialFeaturedImage: seoDetails.socialFeaturedImage,
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          console.log("Submitting", values);
          setTimeout(() => setSubmitting(false), 1000);
        }}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form className="space-y-4">
            <div>
              <label>Meta Title</label>
              <Field
                name="metaTitle"
                className="form-control"
                placeholder="Enter Meta Title"
              />
              {touched.metaTitle && errors.metaTitle && (
                <div className="text-danger">{errors.metaTitle}</div>
              )}
            </div>

            <div>
              <label>Meta Description</label>
              <Field
                as="textarea"
                name="metaDescription"
                className="form-control"
                placeholder="Enter Meta Description"
              />
              {touched.metaDescription && errors.metaDescription && (
                <div className="text-danger">{errors.metaDescription}</div>
              )}
            </div>

            <div>
              <label>Meta Keywords</label>
              <Field
                name="metaKeywords"
                className="form-control"
                placeholder="e.g. ai, photo, editor"
              />
              {touched.metaKeywords && errors.metaKeywords && (
                <div className="text-danger">{errors.metaKeywords}</div>
              )}
            </div>

            <div>
              <label>Social Featured Image</label>
              <Field
                name="socialFeaturedImage"
                className="form-control"
                placeholder="https://image.url"
              />
              {touched.socialFeaturedImage && errors.socialFeaturedImage && (
                <div className="text-danger">{errors.socialFeaturedImage}</div>
              )}
              {seoDetails.socialFeaturedImage && (
                <img
                  src={seoDetails.socialFeaturedImage}
                  alt="Preview"
                  className="mt-3 w-25"
                />
              )}
            </div>

            <div className="pt-3">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SeoForm;
