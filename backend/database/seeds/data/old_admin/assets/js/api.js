/**
 * Skinfinity Derma Admin Dashboard
 * Central API Service Layer (jQuery AJAX Client)
 */

(function (window, $) {
  'use strict';

  // Base API URL - easily configurable centrally
  const API_BASE_URL = (window.location.port === '4000') ? '/api' : 'http://127.0.0.1:4000/api';

  const API = {
    baseUrl: API_BASE_URL,

    // Token retrieval
    getToken: function () {
      return localStorage.getItem('skf_auth_token') || '';
    },

    setToken: function (token) {
      if (token) {
        localStorage.setItem('skf_auth_token', token);
      } else {
        localStorage.removeItem('skf_auth_token');
      }
    },

    getCurrentUser: function () {
      try {
        const user = localStorage.getItem('skf_admin_user');
        return user ? JSON.parse(user) : null;
      } catch (e) {
        return null;
      }
    },

    setCurrentUser: function (user) {
      if (user) {
        localStorage.setItem('skf_admin_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('skf_admin_user');
      }
    },

    // Standard AJAX Request Wrapper
    request: function (options) {
      const self = this;
      const headers = options.headers || {};
      const token = self.getToken();

      if (token) {
        headers['Authorization'] = 'Bearer ' + token;
      }

      const config = {
        url: options.url.startsWith('http') ? options.url : self.baseUrl + options.url,
        type: options.method || 'GET',
        headers: headers,
        dataType: 'json',
        cache: false
      };

      if (options.data) {
        if (options.contentType === false) {
          // For FormData uploads
          config.data = options.data;
          config.processData = false;
          config.contentType = false;
        } else {
          config.data = JSON.stringify(options.data);
          config.contentType = 'application/json; charset=utf-8';
        }
      }

      if (options.params) {
        config.data = options.params;
      }

      return $.ajax(config).fail(function (xhr, status, error) {
        if (xhr.status === 401 && !window.location.pathname.endsWith('login.html')) {
          self.setToken('');
          self.setCurrentUser(null);
          window.location.href = 'login.html';
        }
      });
    },

    // Shorthand methods
    get: function (endpoint, params) {
      return this.request({ url: endpoint, method: 'GET', params: params });
    },

    post: function (endpoint, data) {
      return this.request({ url: endpoint, method: 'POST', data: data });
    },

    put: function (endpoint, data) {
      return this.request({ url: endpoint, method: 'PUT', data: data });
    },

    patch: function (endpoint, data) {
      return this.request({ url: endpoint, method: 'PATCH', data: data });
    },

    delete: function (endpoint) {
      return this.request({ url: endpoint, method: 'DELETE' });
    },

    // File Upload (Single)
    uploadImage: function (file) {
      const formData = new FormData();
      formData.append('image', file);
      return this.request({
        url: '/upload',
        method: 'POST',
        data: formData,
        contentType: false
      });
    },

    // Multiple Files Upload
    uploadMultipleImages: function (files) {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i]);
      }
      return this.request({
        url: '/upload-multiple',
        method: 'POST',
        data: formData,
        contentType: false
      });
    },

    // Auth helpers
    login: function (email, password) {
      return this.post('/auth/login', { email, password });
    },

    logout: function () {
      this.setToken('');
      this.setCurrentUser(null);
      window.location.href = 'login.html';
    },

    getMe: function () {
      return this.get('/auth/me');
    },

    // Dashboard
    getDashboardStats: function () {
      return this.get('/dashboard/stats');
    },

    // Banners
    getBanners: function (params) {
      return this.get('/banners', params);
    },
    getBanner: function (id) {
      return this.get('/banners/' + id);
    },
    createBanner: function (data) {
      return this.post('/banners', data);
    },
    updateBanner: function (id, data) {
      return this.put('/banners/' + id, data);
    },
    toggleBannerStatus: function (id) {
      return this.patch('/banners/' + id + '/toggle-status');
    },
    deleteBanner: function (id) {
      return this.delete('/banners/' + id);
    },

    // Doctors
    getDoctors: function (params) {
      return this.get('/doctors', params);
    },
    getDoctor: function (id) {
      return this.get('/doctors/' + id);
    },
    createDoctor: function (data) {
      return this.post('/doctors', data);
    },
    updateDoctor: function (id, data) {
      return this.put('/doctors/' + id, data);
    },
    toggleDoctorStatus: function (id) {
      return this.patch('/doctors/' + id + '/toggle-status');
    },
    deleteDoctor: function (id) {
      return this.delete('/doctors/' + id);
    },

    // Treatments
    getTreatments: function (params) {
      return this.get('/treatments', params);
    },
    getTreatment: function (id) {
      return this.get('/treatments/' + id);
    },
    createTreatment: function (data) {
      return this.post('/treatments', data);
    },
    updateTreatment: function (id, data) {
      return this.put('/treatments/' + id, data);
    },
    duplicateTreatment: function (id) {
      return this.post('/treatments/' + id + '/duplicate');
    },
    toggleTreatmentStatus: function (id) {
      return this.patch('/treatments/' + id + '/toggle-status');
    },
    toggleTreatmentFeatured: function (id) {
      return this.patch('/treatments/' + id + '/toggle-featured');
    },
    deleteTreatment: function (id) {
      return this.delete('/treatments/' + id);
    },

    // Categories
    getCategories: function () {
      return this.get('/categories');
    },
    createCategory: function (data) {
      return this.post('/categories', data);
    },
    updateCategory: function (id, data) {
      return this.put('/categories/' + id, data);
    },
    deleteCategory: function (id) {
      return this.delete('/categories/' + id);
    },

    // Concerns
    getConcerns: function () {
      return this.get('/concerns');
    },
    createConcern: function (data) {
      return this.post('/concerns', data);
    },
    updateConcern: function (id, data) {
      return this.put('/concerns/' + id, data);
    },
    deleteConcern: function (id) {
      return this.delete('/concerns/' + id);
    },

    // Gallery
    getGallery: function (params) {
      return this.get('/gallery', params);
    },
    createGalleryItem: function (data) {
      return this.post('/gallery', data);
    },
    updateGalleryItem: function (id, data) {
      return this.put('/gallery/' + id, data);
    },
    toggleGalleryStatus: function (id) {
      return this.patch('/gallery/' + id + '/toggle-status');
    },
    deleteGalleryItem: function (id) {
      return this.delete('/gallery/' + id);
    },

    // Before & After
    getBeforeAfter: function (params) {
      return this.get('/before-after', params);
    },
    createBeforeAfter: function (data) {
      return this.post('/before-after', data);
    },
    updateBeforeAfter: function (id, data) {
      return this.put('/before-after/' + id, data);
    },
    toggleBeforeAfterStatus: function (id) {
      return this.patch('/before-after/' + id + '/toggle-status');
    },
    deleteBeforeAfter: function (id) {
      return this.delete('/before-after/' + id);
    },

    // Settings
    getSettings: function () {
      return this.get('/settings');
    },
    updateSettings: function (data) {
      return this.post('/settings', data);
    },

    // Google Reviews
    getReviewStats: function () {
      return this.get('/reviews/stats');
    },
    updateReviewStats: function (data) {
      return this.post('/reviews/stats', data);
    },
    getReviews: function (params) {
      return this.get('/reviews', params);
    },
    getReview: function (id) {
      return this.get('/reviews/' + id);
    },
    createReview: function (data) {
      return this.post('/reviews', data);
    },
    updateReview: function (id, data) {
      return this.put('/reviews/' + id, data);
    },
    toggleReviewStatus: function (id) {
      return this.patch('/reviews/' + id + '/toggle-status');
    },
    deleteReview: function (id) {
      return this.delete('/reviews/' + id);
    },

    // Video Testimonials (Patient Stories)
    getTestimonials: function (params) {
      return this.get('/testimonials', params);
    },
    getTestimonial: function (id) {
      return this.get('/testimonials/' + id);
    },
    createTestimonial: function (data) {
      return this.post('/testimonials', data);
    },
    updateTestimonial: function (id, data) {
      return this.put('/testimonials/' + id, data);
    },
    toggleTestimonialStatus: function (id) {
      return this.patch('/testimonials/' + id + '/toggle-status');
    },
    deleteTestimonial: function (id) {
      return this.delete('/testimonials/' + id);
    }
  };

  window.API = API;
})(window, jQuery);
