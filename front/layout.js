// * 사이드바 연결
// fetch("../pages/layout/sidebar.html")
// .then((response) => response.text())
// .then((data) => {
//   document.querySelector("#sidebar").innerHTML = data;
//
//   // fetch 후에 아이콘 상태를 맞춰주는 함수 호출!
//   // setSidebarIconState();
// });

// * 사이드바 접기, 펼치기 아이콘 상태 맞추는 함수
// function setSidebarIconState() {
//   const $leftSide = document.querySelector('.left-side');
//   const $icon = document.querySelector(
//       '.btn-sidebar-toggle .icon-sidebar-toggle');
//   const currentPage = window.location.pathname.split('/').pop();
//
//   if (!$icon || !$leftSide) {
//     return;
//   }
//
//   if (currentPage === 'dashBoard.html') {
//     // 대시보드면 펼침 + 왼쪽 아이콘
//     $leftSide.classList.remove('collapsed');
//     $icon.classList.remove('icon-sidebar-arrow-right');
//     $icon.classList.add('icon-sidebar-arrow-left');
//   } else {
//     // 그 외엔 닫힘 + 오른쪽 아이콘
//     $leftSide.classList.add('collapsed');
//     $icon.classList.remove('icon-sidebar-arrow-left');
//     $icon.classList.add('icon-sidebar-arrow-right');
//   }
// }

// * 사이드바 열기
$(document).ready(function () {
  $('.menu').on('click', function () {
    $('.container-wrap').toggleClass('toggle-opened');
    $('.nav-wrap').toggleClass('opened');
  });
});

// * 사이드메뉴에서 메뉴 클릭했을때 탭 쌓이면서 컨텐츠 화면 전환
$(function () {
  $('.menu-item').on('click', function (e) {
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
          $('.iframe-content').html('<div class="p-3 text-muted">화면을 선택해주세요</div>');
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
      $('.iframe-content').html('<div class="p-3 text-danger">화면을 불러오는데 실패했어요😢</div>');
    });
  }

  // ✅ 초기 화면 로딩
  loadContent($('.menu-item').first().data('url'));
});


// * 사이드메뉴에서 탭 클릭했을때 탭 쌓이면서 iframe 화면 전환
// $(function () {
//   $('.menu-item').on('click', function (e) {
//     e.preventDefault();
//
//     const menuName = $(this).text().trim();
//     const menuUrl = $(this).data('url');
//     const tabId = 'tab-' + menuName.replace(/\s+/g, '-').toLowerCase();
//
//     // ✅ 이미 탭이 존재하면 중복 추가 없이 그냥 활성화
//     const $existingTab = $('#' + tabId);
//     if ($existingTab.length) {
//       $('.nav-tabs .nav-link').removeClass('active');
//       $existingTab.addClass('active');
//       updateIframe($existingTab.data('url'));
//       return;
//     }
//
//     // ✅ 새 탭 li 생성 (+ id 부여!)
//     const $newTab = $(`
//     <li class="nav-item">
//       <a class="nav-link active d-flex align-items-center" id="${tabId}" href="#" data-url="${menuUrl}">
//         ${menuName}
//         <button type="button" class="btn-close ms-2" aria-label="Close"></button>
//       </a>
//     </li>
//   `);
//
//     // 기존 탭 active 제거
//     $('.nav-tabs .nav-link').removeClass('active');
//
//     // 탭에 추가
//     $('.nav-tabs').append($newTab);
//
//     // iframe 변경
//     updateIframe(menuUrl);
//
//     // 탭 클릭 이벤트 (직접 생성하니까 여기 등록!)
//     $newTab.find('.nav-link').on('click', function (e) {
//       e.preventDefault();
//
//       $('.nav-tabs .nav-link').removeClass('active');
//       $(this).addClass('active');
//       updateIframe($(this).data('url'));
//     });
//
//     // ❌ 탭 닫기 처리
//     $newTab.find('.btn-close').on('click', function (e) {
//       e.stopPropagation();
//
//       const $tab = $(this).closest('.nav-link');
//       const wasActive = $tab.hasClass('active');
//       const $li = $(this).closest('li');
//
//       $li.remove();
//
//       if (wasActive) {
//         const $first = $('.nav-tabs .nav-link').first();
//         if ($first.length) {
//           $first.addClass('active');
//           updateIframe($first.data('url'));
//         } else {
//           $('.iframe-content').empty();
//         }
//       }
//     });
//   });
//
//   // 초기 탭 클릭 이벤트
//   $('.nav-tabs .nav-link').on('click', function (e) {
//     e.preventDefault();
//
//     $('.nav-tabs .nav-link').removeClass('active');
//     $(this).addClass('active');
//     updateIframe($(this).data('url'));
//   });
//
//   function updateIframe(url) {
//     if (!url || url === 'undefined') {
//       $('.iframe-content').html('<div class="p-3 text-muted">화면을 선택해주세요</div>');
//       return;
//     }
//     $('.iframe-content').html(`<iframe src="${url}" width="100%" height="600" frameborder="0"></iframe>`);
//   }
//
//   // 초기 iframe 세팅 (대시보드)
//   updateIframe($('.menu-item').first().data('url'));
// });