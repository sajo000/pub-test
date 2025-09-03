// * 사이드바 열기
$(document).ready(function () {
  $('.menu').on('click', function () {
    $('.container-wrap').toggleClass('toggle-opened');
    $('.nav-wrap').toggleClass('opened');
  });
});

// * 사이드메뉴에서 메뉴 클릭했을때 탭 쌓이면서 컨텐츠 화면 전환
$(function () {
  $('.nav-link-deps1').on('click', function (e) {
    e.preventDefault();

    const menuName = $(this).text().trim();
    const menuUrl = $(this).data('url');
    const tabId = 'tab-' + menuName.replace(/\s+/g, '-').toLowerCase();

    const $existingTab = $('#' + tabId);
    if ($existingTab.length) {
      $('.nav-tabs .nav-link').removeClass('active');
      $existingTab.addClass('active');
      loadContent($existingTab.data('url'));
      return;
    }

    const $newTab = $(`
      <li class="nav-item">
        <a class="nav-link active d-flex align-items-center" id="${tabId}" href="#" data-url="${menuUrl}">
          ${menuName}
          <button type="button" class="btn-close ms-2" aria-label="Close"></button>
        </a>
      </li>
    `);

    $('.nav-tabs .nav-link').removeClass('active');
    $('.nav-tabs').append($newTab);

    loadContent(menuUrl);

    $newTab.find('.nav-link').on('click', function (e) {
      e.preventDefault();
      $('.nav-tabs .nav-link').removeClass('active');
      $(this).addClass('active');
      loadContent($(this).data('url'));
    });

    $newTab.find('.btn-close').on('click', function (e) {
      e.stopPropagation();
      const $tab = $(this).closest('.nav-link');
      const wasActive = $tab.hasClass('active');
      const $li = $(this).closest('li');
      $li.remove();

      if (wasActive) {
        const $first = $('.nav-tabs .nav-link').first();
        if ($first.length) {
          $first.addClass('active');
          loadContent($first.data('url'));
        } else {
          $('.iframe-content').html(
              '<div class="p-3 text-muted">화면을 선택해주세요</div>');
        }
      }
    });
  });

  $('.nav-tabs .nav-link').on('click', function (e) {
    e.preventDefault();
    $('.nav-tabs .nav-link').removeClass('active');
    $(this).addClass('active');
    loadContent($(this).data('url'));
  });

  // ✅ HTML을 Ajax로 로딩하는 함수
  function loadContent(url) {
    if (!url || url === 'undefined') {
      $('.iframe-content').html('<div class="p-3 text-muted">화면을 선택해주세요</div>');
      return;
    }

    $.get(url)
    .done(function (html) {
      $('.iframe-content').html(html);
    })
    .fail(function () {
      $('.iframe-content').html(
          '<div class="p-3 text-danger">화면을 불러오는데 실패했어요😢</div>');
    });
  }

  // ✅ 초기 화면 로딩
  loadContent($('.nav-link-deps1').first().data('url'));
});