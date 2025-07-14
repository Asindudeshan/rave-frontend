import axios from "axios";

const API_BASE_URL =
  "https://rave-backend-b8efggd0f7hmhphm.canadacentral-01.azurewebsites.net/api";
const IMAGE_BASE_URL =
  "https://rave-backend-b8efggd0f7hmhphm.canadacentral-01.azurewebsites.net";

// Helper function to get full image URL
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;

  // If it's just a number (product ID), construct the product image path
  if (typeof imagePath === "number" || /^\d+$/.test(imagePath)) {
    return `${IMAGE_BASE_URL}/images/products/${imagePath}.jpg`;
  }

  // Otherwise, treat it as a full image path
  return `${IMAGE_BASE_URL}/${imagePath}`;
};
export const getProfileImageUrl = (imagePath) => {
  console.log("Image Path:", imagePath);
  if (!imagePath) return null;

  // If it's just a number (product ID), construct the product image path
  if (typeof imagePath === "number" || /^\d+$/.test(imagePath)) {
    return `${IMAGE_BASE_URL}/images/profiles/${imagePath}.jpg`;
  }

  // Otherwise, treat it as a full image path
  return `${IMAGE_BASE_URL}/${imagePath}`;
};

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (email, password) => api.post("/auth/login", { email, password }),
  register: (userData) => api.post("/auth/register", userData),
  getProfile: () => api.get("/auth/profile"),
};

export const productAPI = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    return api.get(`/products?${params}`);
  },
  getById: (id) => api.get(`/products/${id}`),
  create: (productData) => {
    if (productData instanceof FormData) {
      return api.post("/products", productData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }
    return api.post("/products", productData);
  },
  update: (id, productData) => {
    if (productData instanceof FormData) {
      return api.put(`/products/${id}`, productData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }
    return api.put(`/products/${id}`, productData);
  },
  uploadImage: (id, imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);
    return api.post(`/products/${id}/image`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  delete: (id) => api.delete(`/products/${id}`),
};

export const categoryAPI = {
  getAll: () => api.get("/categories"),
};

export const brandAPI = {
  getAll: () => api.get("/brands"),
};

export const sectionAPI = {
  getAll: () => api.get("/sections"),
};

export const genderAPI = {
  getAll: () => api.get("/genders"),
};

export const colorAPI = {
  getAll: () => api.get("/colors"),
};

export const orderAPI = {
  create: (orderData) => api.post("/orders", orderData),
  getMyOrders: () => api.get("/orders/my-orders"),
  getById: (id) => api.get(`/orders/${id}`),
};

export const billingAPI = {
  getSummary: () => api.get("/billing/summary"),
  getRecentOrders: () => api.get("/billing/recent-orders"),
  getBestProducts: () => api.get("/billing/best-products"),
  getDailySales: () => api.get("/billing/daily-sales"),
};

export const adminAPI = {
  getAllOrders: () => api.get("/orders"),
  updateOrderStatus: (orderId, status) =>
    api.put(`/orders/${orderId}/status`, { status }),
  updateStock: (productId, stock) =>
    api.put(`/products/${productId}/stock`, { stock }),
};

export const addressAPI = {
  getAll: () => api.get("/addresses"),
  create: (addressData) => api.post("/addresses", addressData),
  update: (id, addressData) => api.put(`/addresses/${id}`, addressData),
  delete: (id) => api.delete(`/addresses/${id}`),
};

export const commissionAPI = {
  getRates: () => api.get("/commissions/rates"),
  createRate: (rateData) => api.post("/commissions/rates", rateData),
  updateRate: (id, rateData) => api.put(`/commissions/rates/${id}`, rateData),
  deleteRate: (id) => api.delete(`/commissions/rates/${id}`),
  calculate: (data) => api.post("/commissions/calculate", data),
  getSummary: () => api.get("/commissions/summary"),
  getEmployeeCommissions: () => api.get("/commissions/employee-commissions"),
};

export default api;
