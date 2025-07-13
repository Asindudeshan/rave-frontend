import React, { useState, useEffect } from "react";
import {
  FiUser,
  FiShoppingBag,
  FiStar,
  FiEdit2,
  FiX,
  FiCheck,
} from "react-icons/fi";
import api, { getProfileImageUrl } from "../services/api";

const Profile = ({ user }) => {
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    product_id: "",
    rating: 5,
    comment: "",
  });
  const [showPicModal, setShowPicModal] = useState(false);
  const [picFile, setPicFile] = useState(null);
  const [picUploading, setPicUploading] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, [user]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const [profileRes, ordersRes, reviewsRes] = await Promise.all([
        api.get(`/profile/${user.id}`),
        api.get(`/profile/${user.id}/orders`),
        api.get(`/profile/${user.id}/reviews`),
      ]);
      setProfile(profileRes.data);
      setOrders(ordersRes.data);
      setReviews(reviewsRes.data);
      setEditForm(profileRes.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = async () => {
    try {
      const response = await api.put(`/profile/${user.id}`, editForm);
      setProfile(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await api.put(`/profile/${user.id}/orders/${orderId}/cancel`);
      fetchUserData();
    } catch (error) {
      console.error("Error cancelling order:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#f39c12";
      case "confirmed":
        return "#3498db";
      case "shipped":
        return "#9b59b6";
      case "delivered":
        return "#27ae60";
      case "cancelled":
        return "#e74c3c";
      default:
        return "#95a5a6";
    }
  };

  const handleAddReview = (order) => {
    const reviewableItems = getReviewableItems(order);
    setSelectedOrder(order);
    setReviewForm({
      product_id: reviewableItems[0]?.product_id || "",
      rating: 5,
      comment: "",
    });
    setShowReviewModal(true);
  };

  const hasReviewForProduct = (productId, orderId) => {
    return reviews.some(
      (review) => review.product_id === productId && review.order_id === orderId
    );
  };

  const getReviewableItems = (order) => {
    return (
      order.items?.filter(
        (item) => !hasReviewForProduct(item.product_id, order.id)
      ) || []
    );
  };

  const handleSubmitReview = async () => {
    try {
      await api.post(`/profile/${user.id}/reviews`, {
        ...reviewForm,
        order_id: selectedOrder.id,
      });
      setShowReviewModal(false);
      fetchUserData();
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <h1>My Profile</h1>
          <div className="profile-pic-container">
            <img
              src={getProfileImageUrl(
                profile?.profile_pic || user.profile_pic || user.id
              )}
              alt="Profile"
              className="profile-pic-img"
            />
            <button
              className="edit-pic-btn"
              type="button"
              title="Edit profile picture"
              onClick={() => setShowPicModal(true)}
            >
              <FiEdit2 />
            </button>
          </div>
        </div>
        {/* Profile Pic Modal */}
        {showPicModal && (
          <div className="profile-pic-modal-overlay">
            <div className="profile-pic-modal">
              <div className="modal-header">
                <h3>Change Profile Picture</h3>
                <button
                  className="close-btn"
                  onClick={() => setShowPicModal(false)}
                >
                  <FiX />
                </button>
              </div>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!picFile) return;
                  setPicUploading(true);
                  const formData = new FormData();
                  formData.append("profile_pic", picFile);
                  try {
                    const res = await api.post(
                      `/profile/${user.id}/upload-profile-pic`,
                      formData,
                      {
                        headers: { "Content-Type": "multipart/form-data" },
                      }
                    );
                    setProfile((p) => ({
                      ...p,
                      profile_pic: res.data.profile_pic,
                    }));
                    setShowPicModal(false);
                    setPicFile(null);
                  } catch (err) {
                    // Optionally show error
                  } finally {
                    setPicUploading(false);
                  }
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPicFile(e.target.files[0])}
                />
                <button
                  className="submit-btn"
                  type="submit"
                  disabled={picUploading || !picFile}
                >
                  {picUploading ? "Uploading..." : "Upload"}
                </button>
              </form>
            </div>
          </div>
        )}

        <div className="profile-tabs">
          <button
            className={activeTab === "profile" ? "tab active" : "tab"}
            onClick={() => setActiveTab("profile")}
          >
            <FiUser /> Profile
          </button>
          <button
            className={activeTab === "orders" ? "tab active" : "tab"}
            onClick={() => setActiveTab("orders")}
          >
            <FiShoppingBag /> Orders
          </button>
          <button
            className={activeTab === "reviews" ? "tab active" : "tab"}
            onClick={() => setActiveTab("reviews")}
          >
            <FiStar /> Reviews
          </button>
        </div>

        <div className="profile-content">
          {activeTab === "profile" && (
            <div className="profile-info">
              <div className="profile-card">
                <div className="profile-card-header">
                  <h2>Profile Information</h2>
                  {!isEditing ? (
                    <button
                      className="edit-btn"
                      onClick={() => setIsEditing(true)}
                    >
                      <FiEdit2 /> Edit
                    </button>
                  ) : (
                    <div className="edit-actions">
                      <button className="save-btn" onClick={handleEditProfile}>
                        <FiCheck /> Save
                      </button>
                      <button
                        className="cancel-btn"
                        onClick={() => {
                          setIsEditing(false);
                          setEditForm(profile);
                        }}
                      >
                        <FiX /> Cancel
                      </button>
                    </div>
                  )}
                </div>

                <div className="profile-fields">
                  <div className="field">
                    <label>Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.name || ""}
                        onChange={(e) =>
                          setEditForm({ ...editForm, name: e.target.value })
                        }
                      />
                    ) : (
                      <p>{profile?.name}</p>
                    )}
                  </div>

                  <div className="field">
                    <label>Email</label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editForm.email || ""}
                        onChange={(e) =>
                          setEditForm({ ...editForm, email: e.target.value })
                        }
                      />
                    ) : (
                      <p>{profile?.email}</p>
                    )}
                  </div>

                  <div className="field">
                    <label>Phone</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editForm.phone || ""}
                        onChange={(e) =>
                          setEditForm({ ...editForm, phone: e.target.value })
                        }
                      />
                    ) : (
                      <p>{profile?.phone || "Not provided"}</p>
                    )}
                  </div>

                  <div className="field">
                    <label>Member Since</label>
                    <p>{new Date(profile?.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="orders-section">
              <h2>Order History</h2>
              {orders.length === 0 ? (
                <p>No orders found.</p>
              ) : (
                <div className="orders-list">
                  {orders.map((order) => (
                    <div key={order.id} className="order-card">
                      <div className="order-header">
                        <div className="order-info">
                          <h3>Order #{order.id}</h3>
                          <p>
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="order-status">
                          <span
                            className="status-badge"
                            style={{
                              backgroundColor: getStatusColor(order.status),
                            }}
                          >
                            {order.status}
                          </span>
                          {order.status === "pending" && (
                            <button
                              className="cancel-order-btn"
                              onClick={() => handleCancelOrder(order.id)}
                            >
                              Cancel Order
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="order-items">
                        {order.items?.map((item) => (
                          <div key={item.id} className="order-item">
                            {item.image_url ? (
                              <img
                                src={getImageUrl(item.product_id)}
                                alt={item.name}
                              />
                            ) : (
                              <div className="product-placeholder">
                                <span>👟</span>
                              </div>
                            )}
                            <div className="item-details">
                              <h4>{item.name}</h4>
                              <p>Quantity: {item.quantity}</p>
                              <p>Price: LKR {item.price}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="order-total">
                        <strong>Total: LKR {order.total_price}</strong>
                      </div>

                      {order.status === "delivered" && (
                        <div className="order-actions">
                          {getReviewableItems(order).length > 0 ? (
                            <button
                              className="review-btn"
                              onClick={() => handleAddReview(order)}
                            >
                              Add Review
                            </button>
                          ) : (
                            <span className="review-status">
                              All items reviewed
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="reviews-section">
              <h2>My Reviews</h2>
              {reviews.length === 0 ? (
                <p>No reviews yet.</p>
              ) : (
                <div className="reviews-list">
                  {reviews.map((review) => (
                    <div key={review.id} className="review-card">
                      <div className="review-product">
                        {review.image ? (
                          <img
                            src={getImageUrl(review.product_id)}
                            alt={review.product_name}
                          />
                        ) : (
                          <div className="product-placeholder">
                            <span>👟</span>
                          </div>
                        )}
                        <h3>{review.product_name}</h3>
                      </div>

                      <div className="review-content">
                        <div className="rating">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FiStar
                              key={star}
                              className={
                                star <= review.rating ? "star filled" : "star"
                              }
                            />
                          ))}
                        </div>
                        <p>{review.comment}</p>
                        <small>
                          {new Date(review.created_at).toLocaleDateString()}
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="modal-overlay">
          <div className="review-modal">
            <div className="modal-header">
              <h3>Add Review</h3>
              <button
                className="close-btn"
                onClick={() => setShowReviewModal(false)}
              >
                <FiX />
              </button>
            </div>
            <div className="modal-content">
              <div className="form-group">
                <label>Product</label>
                <select
                  value={reviewForm.product_id}
                  onChange={(e) =>
                    setReviewForm({ ...reviewForm, product_id: e.target.value })
                  }
                >
                  {getReviewableItems(selectedOrder)?.map((item) => (
                    <option key={item.product_id} value={item.product_id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Rating</label>
                <div className="rating-select">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FiStar
                      key={star}
                      className={
                        star <= reviewForm.rating ? "star filled" : "star"
                      }
                      onClick={() =>
                        setReviewForm({ ...reviewForm, rating: star })
                      }
                    />
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label>Comment</label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) =>
                    setReviewForm({ ...reviewForm, comment: e.target.value })
                  }
                  placeholder="Share your experience..."
                  rows="4"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="cancel-btn"
                onClick={() => setShowReviewModal(false)}
              >
                Cancel
              </button>
              <button className="submit-btn" onClick={handleSubmitReview}>
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
