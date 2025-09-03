// * 사이드바 열기
$(document).ready(function () {
  $('.menu').on('click', function () {
    $('.container-wrap').toggleClass('toggle-opened');
    $('.nav-wrap').toggleClass('opened');
  });
});

//
// $(document).ready(function () {
//   $(".deps1-link").click(function(e) {
//     $(".deps1-link").removeClass("active"); // 모든 요소에서 active 제거
//     $(this).addClass("active"); // 클릭한 요소에 active 추가
//   });
//
// });
//
// $(document).ready(function() {
//   // 1, 2. deps1-link.multiple 클릭 시 토글
//   $('.deps1-link.multiple').click(function(e) {
//     e.preventDefault();
//
//     const $arrowIcon = $(this).find('.deps1-icon-arrow');
//     const $subMenu = $(this).next('.deps2');
//
//     if ($subMenu.css('display') === 'block') {
//       $subMenu.hide();
//       $arrowIcon.removeClass('icon-arrow-top').addClass('icon-arrow-bottom');
//     } else {
//       $subMenu.show();
//       $arrowIcon.removeClass('icon-arrow-bottom').addClass('icon-arrow-top');
//     }
//   });
//
// });


$(document).ready(function() {
  // 기본 .deps2 숨김 처리 (필요시)
  $('.deps2').hide();

  $('.deps1-link.multiple').click(function(e) {
    e.preventDefault();

    const $arrowIcon = $(this).find('.deps1-icon-arrow');
    const $subMenu = $(this).next('.deps2');

    // 토글 하위 메뉴 표시
    $subMenu.slideToggle(200);

    // 아이콘 토글 클래스
    if ($arrowIcon.hasClass('icon-arrow-bottom')) {
      $arrowIcon.removeClass('icon-arrow-bottom').addClass('icon-arrow-top');
    } else {
      $arrowIcon.removeClass('icon-arrow-top').addClass('icon-arrow-bottom');
    }
  });

  $('.deps2-link').click(function(e) {
    e.preventDefault();

    // 모든 활성화 초기화
    $('.deps1-link.active').removeClass('active');
    $('.deps2-link.active').removeClass('active');

    // 클릭한 deps2-link 활성화
    $(this).addClass('active');

    // 클릭한 deps2-link의 조상 deps2 바로 이전 형제 deps1-link에 active 추가
    const $deps2 = $(this).closest('.deps2');
    const $deps1Link = $deps2.prev('.deps1-link');
    if ($deps1Link.length) {
      $deps1Link.addClass('active');

      // 하위 메뉴가 닫혀있으면 열기 & 아이콘 토글
      if (!$deps2.is(':visible')) {
        $deps2.slideDown(200);
        const $arrowIcon = $deps1Link.find('.deps1-icon-arrow');
        $arrowIcon.removeClass('icon-arrow-bottom').addClass('icon-arrow-top');
      }
    }
  });

  // 만약 deps1-link.single 클릭 시 활성화 상태를 변경하려면 아래 추가 가능
  $('.deps1-link.single').click(function(e) {
    e.preventDefault();

    // 기존 활성화 모두 제거
    $('.deps1-link.active').removeClass('active');
    $('.deps2-link.active').removeClass('active');

    $(this).addClass('active');
  });
});







// * 사이드메뉴에서 메뉴 클릭했을때 탭 쌓이면서 컨텐츠 화면 전환
/*
$(function () {
  $('.deps1-link').on('click', function (e) {
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
  loadContent($('.deps1-link').first().data('url'));
});
*/
