/**
 * Skinfinity Derma Admin Dashboard
 * Categories Module Controller
 */

$(document).ready(function () {
  'use strict';

  let dataTable = null;
  let categoriesData = [];

  // Dropzone trigger
  $('#categoryDropzone').on('click', function () {
    $('#categoryImageFile').trigger('click');
  });

  // Setup Image Preview
  window.App.setupImagePreview(
    '#categoryImageFile',
    '#categoryPreviewImg',
    '#btnRemoveCategoryImg',
    '#categoryThumbnailUrl'
  );

  // Auto generate slug from category name
  $('#categoryName').on('input', function () {
    if (!$('#categoryId').val()) {
      $('#categorySlug').val(window.App.slugify($(this).val()));
    }
  });

  // Load Categories
  function loadCategories() {
    window.API.getCategories()
      .done(function (res) {
        if (!res.success) return;
        categoriesData = res.data;
        renderTable(categoriesData);
      })
      .fail(function () {
        window.App.toast('error', 'Failed to fetch categories');
      });
  }

  function renderTable(data) {
    if (dataTable) {
      dataTable.destroy();
    }

    const $tbody = $('#categoriesTableBody');
    $tbody.empty();

    data.forEach(function (cat) {
      const thumb = cat.thumbnail ?
        `<img src="${cat.thumbnail}" alt="${cat.name}" style="width: 48px; height: 48px; object-fit: cover; border-radius: 6px; border: 1px solid var(--border);">` :
        `<div style="width: 48px; height: 48px; background: var(--accent-soft); border-radius: 6px; display: flex; align-items: center; justify-content: center; color: var(--secondary);"><i class="bi bi-folder2"></i></div>`;

      const statusBadge = cat.isActive ?
        '<span class="badge badge-active">Active</span>' :
        '<span class="badge badge-inactive">Inactive</span>';

      const treatmentCountBadge = cat.treatmentCount > 0 ?
        `<a href="treatments.html?category=${cat.id}" class="badge bg-primary-subtle text-primary border border-primary-subtle text-decoration-none"><i class="bi bi-capsule me-1"></i>${cat.treatmentCount} Treatments</a>` :
        `<span class="badge bg-light text-muted border">0 Treatments</span>`;

      const row = `
        <tr data-id="${cat.id}">
          <td class="fw-bold text-muted">${cat.displayOrder || 1}</td>
          <td>${thumb}</td>
          <td>
            <div class="fw-bold text-dark">${cat.name}</div>
            <div class="small text-muted text-truncate" style="max-width: 280px;">${cat.description || '—'}</div>
          </td>
          <td><code>/${cat.slug}</code></td>
          <td>${treatmentCountBadge}</td>
          <td>${statusBadge}</td>
          <td class="text-end">
            <div class="btn-group btn-group-sm">
              <button type="button" class="btn btn-outline-secondary btn-edit" title="Edit Category" data-id="${cat.id}">
                <i class="bi bi-pencil"></i>
              </button>
              <button type="button" class="btn btn-outline-danger btn-delete" title="Delete Category" data-id="${cat.id}">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
      $tbody.append(row);
    });

    dataTable = $('#categoriesTable').DataTable({
      responsive: true,
      order: [[0, 'asc']],
      pageLength: 10,
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Search categories..."
      }
    });
  }

  // Open Modal for New Category
  $('#btnOpenAddCategoryModal').on('click', function () {
    $('#categoryForm')[0].reset();
    $('#categoryId').val('');
    $('#categoryThumbnailUrl').val('');
    $('#categoryPreviewImg').attr('src', '');
    $('#categoryPreviewWrap').addClass('d-none');
    window.App.setCKData('categoryDescription', '');
    $('#categoryIsActive').prop('checked', true);
    $('#categoryOrder').val(categoriesData.length + 1);
    $('#categoryModalLabel').text('Add New Category');
    $('#categoryModal').modal('show');
  });

  // Edit Category
  $(document).on('click', '.btn-edit', function () {
    const id = $(this).data('id');
    const cat = categoriesData.find(c => c.id === id);
    if (!cat) return;

    $('#categoryId').val(cat.id);
    $('#categoryName').val(cat.name);
    $('#categorySlug').val(cat.slug);
    $('#categoryDescription').val(cat.description || '');
    window.App.setCKData('categoryDescription', cat.description || '');
    $('#categoryOrder').val(cat.displayOrder || 1);
    $('#categoryIsActive').prop('checked', cat.isActive);
    $('#categoryThumbnailUrl').val(cat.thumbnail || '');

    if (cat.thumbnail) {
      $('#categoryPreviewImg').attr('src', cat.thumbnail);
      $('#categoryPreviewWrap').removeClass('d-none');
    } else {
      $('#categoryPreviewImg').attr('src', '');
      $('#categoryPreviewWrap').addClass('d-none');
    }

    $('#categoryModalLabel').text('Edit Category: ' + cat.name);
    $('#categoryModal').modal('show');
  });

  // Save Category (Create or Update)
  $('#categoryForm').on('submit', function (e) {
    e.preventDefault();

    const id = $('#categoryId').val();
    const name = $('#categoryName').val().trim();
    const slug = $('#categorySlug').val().trim();

    if (!name || !slug) {
      window.App.toast('error', 'Name and URL slug are required');
      return;
    }

    const payload = {
      name: name,
      slug: slug,
      description: window.App.getCKData('categoryDescription') || $('#categoryDescription').val().trim(),
      thumbnail: $('#categoryThumbnailUrl').val(),
      displayOrder: parseInt($('#categoryOrder').val()) || 1,
      isActive: $('#categoryIsActive').is(':checked')
    };

    const $btn = $('#btnSaveCategory');
    $btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-1"></span>Saving...');

    const request = id ? window.API.updateCategory(id, payload) : window.API.createCategory(payload);

    request.done(function (res) {
      if (res.success) {
        $('#categoryModal').modal('hide');
        window.App.toast('success', res.message || 'Category saved successfully');
        loadCategories();
      }
    }).fail(function (xhr) {
      const msg = xhr.responseJSON ? xhr.responseJSON.message : 'Failed to save category';
      window.App.toast('error', msg);
    }).always(function () {
      $btn.prop('disabled', false).html('<i class="bi bi-check-lg me-1"></i> Save Category');
    });
  });

  // Delete Category with Relational Protection
  $(document).on('click', '.btn-delete', function () {
    const id = $(this).data('id');
    const cat = categoriesData.find(c => c.id === id);
    if (!cat) return;

    if (cat.treatmentCount > 0) {
      Swal.fire({
        icon: 'error',
        title: 'Cannot Delete Category',
        text: `"${cat.name}" is currently associated with ${cat.treatmentCount} treatment(s). Please reassign or delete the associated treatments before deleting this category.`,
        confirmButtonColor: '#124432'
      });
      return;
    }

    window.App.confirm(
      'Delete Category?',
      `Are you sure you want to permanently delete category "${cat.name}"?`,
      'Yes, Delete'
    ).then(function (result) {
      if (result.isConfirmed) {
        window.API.deleteCategory(id)
          .done(function (res) {
            if (res.success) {
              window.App.toast('success', 'Category deleted successfully');
              loadCategories();
            }
          })
          .fail(function (xhr) {
            const msg = xhr.responseJSON ? xhr.responseJSON.message : 'Error deleting category';
            Swal.fire({
              icon: 'error',
              title: 'Deletion Failed',
              text: msg,
              confirmButtonColor: '#124432'
            });
          });
      }
    });
  });

  // Reload button
  $('#btnReloadCategories').on('click', function () {
    loadCategories();
  });

  // Initial load
  window.App.initCKEditor('#categoryDescription');
  loadCategories();
});
