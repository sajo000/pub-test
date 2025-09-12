// * 사이드메뉴 열기
$(document).ready(function () {
  $('.menu').on('click', function () {
    $('.container-wrap').toggleClass('toggle-opened');
    $('.nav-wrap').toggleClass('opened');
  });
});

// * 사이드메뉴 동작처리
$(document).ready(function () {
  // 기본 .deps2 숨김 처리 (필요시)
  $('.deps2').hide();

  $('.deps1-link.multiple').click(function (e) {
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

  $('.deps2-link').click(function (e) {
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
  $('.deps1-link.single').click(function (e) {
    e.preventDefault();

    // 기존 활성화 모두 제거
    $('.deps1-link.active').removeClass('active');
    $('.deps2-link.active').removeClass('active');

    $(this).addClass('active');
  });
});

// * 사이드메뉴에서 메뉴 클릭했을때 탭 쌓이면서 컨텐츠 화면 전환
$(function () {
  const $tabList = $('.tab-list');
  const $iframeContent = $('.iframe-content');

  // 메뉴 ID 별 URL 매핑
  const urlMap = {
    '대시보드': 'pages/dashboard/dashboard.html',
    'dashboard': 'pages/dashboard/dashboard.html',
    '상품관리': 'pages/product/product-management.html',
    // 필요한 다른 메뉴도 추가 가능
  };

  function getUrlByTabId(tabId) {
    return urlMap[tabId] || 'test1.html'; // 기본 URL은 test1.html
  }

  function initDashboardTab() {
    let $dashboardTab = $tabList.find('li[data-tab="dashboard"]');
    if ($dashboardTab.length === 0) {
      const $li = $(`
        <li class="nav-item" data-tab="dashboard">
          <a href="#" class="nav-link fixed-tab active">대시보드</a>
        </li>
      `);
      $tabList.prepend($li);
    }
    $tabList.find('.nav-link').removeClass('active');
    $tabList.find('li[data-tab="dashboard"] .nav-link').addClass('active');
    $iframeContent.html(`<iframe src="${urlMap['dashboard']}" width="100%" height="700" frameborder="0"></iframe>`);
  }

  initDashboardTab();

  function addOrActivateTab(tabId, title, url) {
    let existingTab = $tabList.find(`li[data-tab="${tabId}"]`);
    if (existingTab.length) {
      $tabList.find('.nav-link').removeClass('active');
      existingTab.find('.nav-link').addClass('active').trigger('click');
      $iframeContent.html(
          `<iframe src="${url}" width="100%" height="700" frameborder="0"></iframe>`
      );
      return;
    }

    const $li = $(`
      <li class="nav-item" data-tab="${tabId}">
        <a href="#" class="nav-link active">${title}
          <button type="button" class="tab-close-btn">&times;</button>
        </a>
      </li>
    `);

    $tabList.find('.nav-link').removeClass('active');

    $tabList.find('li').eq(0).after($li);

    $iframeContent.html(
        `<iframe src="${url}" width="100%" height="700" frameborder="0"></iframe>`
    );
  }

  $tabList.on('click', '.nav-link', function (e) {
    if ($(e.target).hasClass('tab-close-btn')) return;
    e.preventDefault();
    $tabList.find('.nav-link').removeClass('active');
    $(this).addClass('active');

    const tabId = $(this).closest('li').data('tab');
    const url = getUrlByTabId(tabId);

    $iframeContent.html(`<iframe src="${url}" width="100%" height="700" frameborder="0"></iframe>`);

    $('.deps1-link.active, .deps2-link.active').removeClass('active');

    if (tabId === '대시보드' || tabId === 'dashboard') {
      $('.deps1-link.single').each(function () {
        if ($(this).find('.deps1-title').text().trim() === '대시보드') {
          $(this).addClass('active');
        }
      });
    } else {
      $('.deps1-link, .deps2-link').each(function () {
        const text = $(this).text().trim();
        if (text === tabId) {
          $(this).addClass('active');

          if ($(this).hasClass('deps2-link')) {
            $(this).closest('.deps2').prev('.deps1-link').addClass('active');

            const $subMenu = $(this).closest('.deps2');
            if (!$subMenu.is(':visible')) {
              $subMenu.slideDown(200);
              const $arrowIcon = $subMenu.prev('.deps1-link').find('.deps1-icon-arrow');
              $arrowIcon.removeClass('icon-arrow-bottom').addClass('icon-arrow-top');
            }
          }
        }
      });
    }
  });

  $tabList.on('click', '.tab-close-btn', function (e) {
    e.stopPropagation();

    const $li = $(this).closest('li');
    const isActive = $li.find('.nav-link').hasClass('active');
    let $nextTab = $li.next();
    let $prevTab = $li.prev();

    $li.remove();

    if (isActive) {
      if ($nextTab.length) {
        $nextTab.find('.nav-link').addClass('active').trigger('click');
      } else if ($prevTab.length && $prevTab.data('tab') !== 'dashboard') {
        $prevTab.find('.nav-link').addClass('active').trigger('click');
      } else {
        const $dashboardTab = $tabList.find('li[data-tab="dashboard"]');
        if ($dashboardTab.length) {
          $dashboardTab.find('.nav-link').addClass('active').trigger('click');
        }
      }
    }
  });

  $('.deps1-link, .deps2-link').click(function (e) {
    e.preventDefault();

    if ($(this).hasClass('multiple') && $(this).next('.deps2').children().length > 0) {
      return;
    }

    const isDashboard = $(this).hasClass('single') && $(this).find('.deps1-title').text().trim() === '대시보드';

    if (isDashboard) {
      initDashboardTab();
      return;
    }

    const tabId = $(this).text().trim();
    const title = $(this).find('.deps1-title, .deps2-title').text() || tabId;
    const url = getUrlByTabId(tabId);
    addOrActivateTab(tabId, title, url);
  });
});


// * 헤더 스크롤러블 탭메뉴
$(function () {
  let tabIdx = 1;

  function updateArrows() {
    const $wrap = $('.tab-scroll-wrap');
    const $ul = $('.tab-list');
    const scrollLeft = $wrap.scrollLeft();
    const maxScroll = $wrap[0].scrollWidth - $wrap.width(); // scrollWidth로 변경

    $('.scroll-arrow.left').toggle(scrollLeft > 0);
    $('.scroll-arrow.right').toggle(
        scrollLeft < maxScroll - 1 && maxScroll > 0);
  }

  // 탭 추가 버튼
  $('#addTabBtn').on('click', function () {
    const tabTitle = '탭' + tabIdx++;
    const $li = $(`
      <li class="nav-item">
        <a class="nav-link${$('.tab-list .nav-link').length ? '' : ' active'}" href="#">
          ${tabTitle}<button class="tab-close-btn" title="닫기">&times;</button>
        </a>
      </li>
    `);
    $('.tab-list').append($li);
    if ($('.tab-list .nav-link.active').length === 0) {
      $li.find('.nav-link').addClass('active');
    }
    // requestAnimationFrame 사용해 렌더링 후 updateArrows 호출
    requestAnimationFrame(updateArrows);
  });

  // 탭 닫기
  $('.tab-list').on('click', '.tab-close-btn', function (e) {
    e.stopPropagation();
    const $tab = $(this).closest('.nav-item');
    const isActive = $tab.find('.nav-link').hasClass('active');
    $tab.remove();
    if (isActive) {
      $('.tab-list .nav-link').removeClass('active').eq(0).addClass('active');
    }
    updateArrows();
  });

  // 탭 클릭시 active
  $('.tab-list').on('click', '.nav-link', function (e) {
    e.preventDefault();
    $('.tab-list .nav-link').removeClass('active');
    $(this).addClass('active');
  });

  // 스크롤 감지
  $('.tab-scroll-wrap').on('scroll', updateArrows);

  // 화살표 클릭
  $('.scroll-arrow.left').on('click', function () {
    $('.tab-scroll-wrap').animate({scrollLeft: '-=200'}, 200, updateArrows);
  });
  $('.scroll-arrow.right').on('click', function () {
    $('.tab-scroll-wrap').animate({scrollLeft: '+=200'}, 200, updateArrows);
  });

  $(window).on('resize', updateArrows);

  // 초기 탭 3개 추가
  $('#addTabBtn').trigger('click').trigger('click').trigger('click');
});
