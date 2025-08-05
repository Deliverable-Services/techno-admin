import API from "../utils/API";

export interface BusinessProfile {
  id: string;
  name: string;
  title: string;
  phone: string;
  address: {
    formatted_address: string;
    address_components: Array<{
      long_name: string;
      short_name: string;
      types: string[];
    }>;
  };
  categories: Array<{
    name: string;
    display_name: string;
  }>;
  website: string;
  cover_photo: {
    url: string;
    reference: string;
  };
  profile_photo: {
    url: string;
    reference: string;
  };
  hours: {
    [key: string]: {
      open: string;
      close: string;
    };
  };
  rating: number;
  review_count: number;
}

export interface BusinessReview {
  id: string;
  reviewer_name: string;
  reviewer_photo_url: string;
  rating: number;
  comment: string;
  created_time: string;
  reply?: {
    comment: string;
    created_time: string;
  };
}

export interface BusinessImage {
  id: string;
  url: string;
  alt_text?: string;
  upload_time: string;
  image_type: "COVER" | "LOGO" | "ADDITIONAL";
}

export interface ReviewReplyRequest {
  review_id: string;
  reply_text: string;
}

class GoogleBusinessService {
  /**
   * Get business profile information
   */
  async getBusinessProfile(organisationId: number): Promise<BusinessProfile> {
    const response = await API.get(`/google-business/profile`, {
      params: { organisation_id: organisationId },
    });
    return response.data;
  }

  /**
   * Get all reviews for the business
   */
  async getBusinessReviews(
    organisationId: number,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    reviews: BusinessReview[];
    total: number;
    page: number;
    total_pages: number;
  }> {
    const response = await API.get(`/google-business/reviews`, {
      params: {
        organisation_id: organisationId,
        page,
        limit,
      },
    });
    return response.data;
  }

  /**
   * Get all images for the business
   */
  async getBusinessImages(
    organisationId: number,
    page: number = 1,
    limit: number = 20
  ): Promise<{
    images: BusinessImage[];
    total: number;
    page: number;
    total_pages: number;
  }> {
    const response = await API.get(`/google-business/images`, {
      params: {
        organisation_id: organisationId,
        page,
        limit,
      },
    });
    return response.data;
  }

  /**
   * Reply to a review
   */
  async replyToReview(
    organisationId: number,
    reviewReply: ReviewReplyRequest
  ): Promise<{ message: string }> {
    const response = await API.post(`/google-business/reviews/reply`, {
      organisation_id: organisationId,
      ...reviewReply,
    });
    return response.data;
  }

  /**
   * Get business analytics/insights
   */
  async getBusinessInsights(
    organisationId: number,
    startDate?: string,
    endDate?: string
  ): Promise<{
    views: number;
    searches: number;
    actions: {
      call: number;
      website: number;
      direction: number;
    };
    period: {
      start_date: string;
      end_date: string;
    };
  }> {
    const response = await API.get(`/google-business/insights`, {
      params: {
        organisation_id: organisationId,
        start_date: startDate,
        end_date: endDate,
      },
    });
    return response.data;
  }
}

export default new GoogleBusinessService();
