/**
 * Skinfinity Derma Admin Dashboard
 * Central API Service Layer (jQuery AJAX Client)
 */

(function (window, $) {
  'use strict';

  // Base API URL - auto-detects localhost vs production hostinger domain
  const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname === '[::1]'
  );
  const API_BASE_URL = window.SKINFINITY_API_URL
    ? window.SKINFINITY_API_URL
    : (isLocalhost ? (window.location.port === '4000' ? '/api' : 'http://127.0.0.1:4000/api') : '/api');

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

    // Centralized Image / Media URL Resolver
    resolveImageUrl: function (url, fallback) {
      const defaultFallback = fallback || 'assets/img/avatar-default.svg';
      if (!url || typeof url !== 'string') return defaultFallback;
      const trimmed = url.trim();
      if (!trimmed) return defaultFallback;
      if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
        return trimmed;
      }

      let normalizedPath = trimmed;
      if (trimmed.startsWith('/images/') || trimmed.startsWith('images/')) {
        normalizedPath = trimmed.startsWith('/') ? trimmed : '/' + trimmed;
      } else if (trimmed.startsWith('/uploads/') || trimmed.startsWith('uploads/')) {
        normalizedPath = trimmed.startsWith('/') ? trimmed : '/' + trimmed;
      } else {
        // Pure filename stored in DB (e.g. "banner-d-123.png")
        normalizedPath = '/uploads/' + trimmed.replace(/^\/+/, '');
      }

      // Handle running from non-backend origin (e.g. Next.js on port 3000)
      let backendOrigin = '';
      if (window.SKINFINITY_API_URL && window.SKINFINITY_API_URL.startsWith('http')) {
        try {
          const u = new URL(window.SKINFINITY_API_URL);
          backendOrigin = u.origin;
        } catch(e) {}
      } else if (isLocalhost && window.location.port !== '4000') {
        backendOrigin = 'http://127.0.0.1:4000';
      }

      if (backendOrigin && (normalizedPath.startsWith('/uploads') || normalizedPath.startsWith('/images'))) {
        return backendOrigin + normalizedPath;
      }

      return normalizedPath;
    },

    // File Upload (Single) - Guaranteed single file to prevent duplicate files
    uploadImage: function (file, folder) {
      const formData = new FormData();
      formData.append('file', file);
      const targetFolder = folder || 'general';
      const url = `/upload?folder=${encodeURIComponent(targetFolder)}`;
      return this.request({
        url: url,
        method: 'POST',
        data: formData,
        contentType: false
      });
    },

    // Universal File / FormData Upload
    uploadFile: function (fileOrFormData, folder) {
      let data = fileOrFormData;
      const targetFolder = folder || (fileOrFormData instanceof FormData ? fileOrFormData.get('folder') : null) || 'general';
      const url = `/upload?folder=${encodeURIComponent(targetFolder)}`;
      if (!(fileOrFormData instanceof FormData)) {
        data = new FormData();
        data.append('file', fileOrFormData);
      }
      return this.request({
        url: url,
        method: 'POST',
        data: data,
        contentType: false
      });
    },

    // Treatment Image Upload with Treatment ID and subfolder
    uploadTreatmentImage: function (file, treatmentId) {
      const formData = new FormData();
      formData.append('file', file);
      const url = treatmentId 
        ? `/upload?treatmentId=${encodeURIComponent(treatmentId)}&folder=treatments` 
        : '/upload?folder=treatments';
      return this.request({
        url: url,
        method: 'POST',
        data: formData,
        contentType: false
      });
    },

    // Delete Treatment Media File from disk folder & database
    deleteTreatmentMediaFile: function (filePath, treatmentId) {
      return this.post('/upload/delete', {
        url: filePath,
        treatmentId: treatmentId || undefined
      });
    },

    // Multiple Files Upload
    uploadMultipleImages: function (files, folder) {
      const formData = new FormData();
      const targetFolder = folder || 'treatments';
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
        formData.append('images', files[i]);
      }
      return this.request({
        url: `/upload/multiple?folder=${encodeURIComponent(targetFolder)}`,
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
    reorderBanners: function (orderList) {
      return this.post('/banners/reorder', { orderList: orderList });
    },
    deleteBanner: function (id) {
      return this.delete('/banners/' + id);
    },

    // Trust Badges (Below-Banner Ticker)
    getTrustBadges: function () {
      return this.get('/trust-badges');
    },
    createTrustBadge: function (data) {
      return this.post('/trust-badges', data);
    },
    updateTrustBadge: function (id, data) {
      return this.put('/trust-badges/' + id, data);
    },
    toggleTrustBadgeStatus: function (id) {
      return this.patch('/trust-badges/' + id + '/toggle-status');
    },
    reorderTrustBadges: function (orderList) {
      return this.post('/trust-badges/reorder', { orderList: orderList });
    },
    deleteTrustBadge: function (id) {
      return this.delete('/trust-badges/' + id);
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
    },

    // RBAC & Users
    getUsers: function () {
      return this.get('/users');
    },
    createUser: function (data) {
      return this.post('/users', data);
    },
    updateUser: function (id, data) {
      return this.put('/users/' + id, data);
    },
    toggleUser: function (id) {
      return this.patch('/users/' + id + '/toggle');
    },
    deleteUser: function (id) {
      return this.delete('/users/' + id);
    },
    getRoles: function () {
      return this.get('/users/roles');
    },

    // Appointments
    getAppointments: function (params) {
      return this.get('/appointments', params);
    },
    getAppointmentsCalendar: function (params) {
      return this.get('/appointments/calendar', params);
    },
    getAppointment: function (id) {
      return this.get('/appointments/' + id);
    },
    getSlots: function (params) {
      return this.get('/public/appointments/slots', params);
    },
    createAppointment: function (data) {
      return this.post('/appointments', data);
    },
    updateAppointment: function (id, data) {
      return this.put('/appointments/' + id, data);
    },
    rescheduleAppointment: function (id, data) {
      return this.put('/appointments/' + id + '/reschedule', data);
    },
    updateAppointmentStatus: function (id, status, notes) {
      return this.patch('/appointments/' + id + '/status', { status, notes });
    },
    deleteAppointment: function (id) {
      return this.delete('/appointments/' + id);
    },

    // Patients & Comprehensive Clinical CRM
    getPatients: function (params) {
      return this.get('/patients', params);
    },
    getPatient: function (id) {
      return this.get('/patients/' + id);
    },
    createPatient: function (data) {
      return this.post('/patients', data);
    },
    updatePatient: function (id, data) {
      return this.put('/patients/' + id, data);
    },
    deletePatient: function (id) {
      return this.delete('/patients/' + id);
    },
    addPatientConsultation: function (id, data) {
      return this.post('/patients/' + id + '/consultations', data);
    },
    addPatientSkinAssessment: function (id, data) {
      return this.post('/patients/' + id + '/skin-assessments', data);
    },
    addPatientPrescription: function (id, data) {
      return this.post('/patients/' + id + '/prescriptions', data);
    },
    getPrescriptionPrintData: function (rxId) {
      return this.get('/patients/prescription/' + rxId + '/print');
    },
    addPatientDocument: function (id, data) {
      return this.post('/patients/' + id + '/documents', data);
    },
    addPatientGallery: function (id, data) {
      return this.post('/patients/' + id + '/gallery', data);
    },
    addPatientPackage: function (id, data) {
      return this.post('/patients/' + id + '/packages', data);
    },
    usePackageSession: function (patientId, pkgId) {
      return this.post('/patients/' + patientId + '/packages/' + pkgId + '/use-session');
    },
    addPatientPayment: function (id, data) {
      return this.post('/patients/' + id + '/payments', data);
    },
    addPatientNote: function (id, note) {
      return this.post('/patients/' + id + '/notes', { note: note });
    },

    // Enquiries & CRM
    getEnquiries: function (params) {
      return this.get('/enquiries', params);
    },
    createEnquiry: function (data) {
      return this.post('/enquiries', data);
    },
    updateEnquiryStatus: function (id, status, note, followUpAt) {
      return this.patch('/enquiries/' + id + '/status', { status, note, followUpAt });
    },
    assignEnquiry: function (id, assignedTo) {
      return this.patch('/enquiries/' + id + '/assign', { assignedTo });
    },
    getEnquiryNotes: function (id) {
      return this.get('/enquiries/' + id + '/notes');
    },
    addEnquiryNote: function (id, note) {
      return this.post('/enquiries/' + id + '/notes', { note });
    },
    deleteEnquiry: function (id) {
      return this.delete('/enquiries/' + id);
    },

    // Roles & Permissions Matrix
    getRolesList: function () {
      return this.get('/roles');
    },
    getRole: function (id) {
      return this.get('/roles/' + id);
    },
    createRole: function (data) {
      return this.post('/roles', data);
    },
    updateRole: function (id, data) {
      return this.put('/roles/' + id, data);
    },
    deleteRole: function (id) {
      return this.delete('/roles/' + id);
    },
    getPermissionsList: function () {
      return this.get('/roles/permissions');
    },

    // Clinical Blogs & Articles
    getBlogs: function (params) {
      return this.get('/blogs', params);
    },
    getBlog: function (id) {
      return this.get('/blogs/' + id);
    },
    createBlog: function (data) {
      return this.post('/blogs', data);
    },
    updateBlog: function (id, data) {
      return this.put('/blogs/' + id, data);
    },
    deleteBlog: function (id) {
      return this.delete('/blogs/' + id);
    },

    // Media Manager
    getMediaList: function (params) {
      return this.get('/media', params);
    },
    uploadMediaFile: function (file, altText) {
      const formData = new FormData();
      formData.append('file', file);
      if (altText) formData.append('altText', altText);
      return this.request({
        url: '/media/upload',
        method: 'POST',
        data: formData,
        contentType: false
      });
    },
    updateMediaMeta: function (id, data) {
      return this.put('/media/' + id, data);
    },
    deleteMediaFile: function (id, force) {
      return this.delete('/media/' + id + (force ? '?force=true' : ''));
    },
    getStorageAudit: function () {
      return this.get('/media/storage-audit');
    },
    cleanupOrphans: function (filePaths) {
      return this.post('/media/cleanup-orphans', { filePaths: filePaths || [] });
    },

    // Notifications Center
    getNotifications: function () {
      return this.get('/notifications');
    },
    markNotificationRead: function (id) {
      return this.patch('/notifications/' + id + '/read');
    },
    markAllNotificationsRead: function () {
      return this.post('/notifications/mark-all-read');
    },

    // Coupons
    getCoupons: function () {
      return this.get('/coupons');
    },
    createCoupon: function (data) {
      return this.post('/coupons', data);
    },
    updateCoupon: function (id, data) {
      return this.put('/coupons/' + id, data);
    },
    toggleCoupon: function (id) {
      return this.patch('/coupons/' + id + '/toggle');
    },
    deleteCoupon: function (id) {
      return this.delete('/coupons/' + id);
    },

    // Seasonal / Monthly Offers (Best Offers this Month)
    getOffers: function () {
      return this.get('/offers');
    },
    getOffer: function (id) {
      return this.get('/offers/' + id);
    },
    createOffer: function (data) {
      return this.post('/offers', data);
    },
    updateOffer: function (id, data) {
      return this.put('/offers/' + id, data);
    },
    toggleOfferStatus: function (id) {
      return this.patch('/offers/' + id + '/toggle-status');
    },
    reorderOffers: function (order) {
      return this.post('/offers/reorder', { order: order });
    },
    deleteOffer: function (id) {
      return this.delete('/offers/' + id);
    },
    validateCoupon: function (data) {
      return this.post('/public/coupons/validate', data);
    },
    getMemberships: function () {
      return this.get('/memberships');
    },
    createMembership: function (data) {
      return this.post('/memberships', data);
    },
    updateMembership: function (id, data) {
      return this.put('/memberships/' + id, data);
    },
    deleteMembership: function (id) {
      return this.delete('/memberships/' + id);
    },

    // Homepage Section CMS
    getHomepageSections: function () {
      return this.get('/homepage');
    },
    updateHomepageSection: function (key, data) {
      return this.put('/homepage/' + key, data);
    },
    toggleHomepageSection: function (key) {
      return this.patch('/homepage/' + key + '/toggle');
    },
    addHomepageItem: function (key, data) {
      return this.post('/homepage/' + key + '/items', data);
    },
    updateHomepageItem: function (id, data) {
      return this.put('/homepage/items/' + id, data);
    },
    toggleHomepageItem: function (id) {
      return this.patch('/homepage/items/' + id + '/toggle');
    },
    deleteHomepageItem: function (id) {
      return this.delete('/homepage/items/' + id);
    },

    // Services
    getServicesList: function () {
      return this.get('/services');
    },
    createService: function (data) {
      return this.post('/services', data);
    },
    updateService: function (id, data) {
      return this.put('/services/' + id, data);
    },
    deleteService: function (id) {
      return this.delete('/services/' + id);
    },

    // Locations / Clinics
    getLocationsList: function () {
      return this.get('/locations');
    },
    createLocation: function (data) {
      return this.post('/locations', data);
    },
    updateLocation: function (id, data) {
      return this.put('/locations/' + id, data);
    },
    deleteLocation: function (id) {
      return this.delete('/locations/' + id);
    },

    // Dynamic Pages
    getPagesList: function () {
      return this.get('/pages');
    },
    createPage: function (data) {
      return this.post('/pages', data);
    },
    updatePage: function (id, data) {
      return this.put('/pages/' + id, data);
    },
    deletePage: function (id) {
      return this.delete('/pages/' + id);
    }
  };

  window.API = API;
})(window, jQuery);
