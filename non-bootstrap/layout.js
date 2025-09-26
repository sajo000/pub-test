// * 사이드메뉴 열기
$(document).ready(function () {
  $('.btn-header-menu').on('click', function () {
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
$(document).ready(function () {
  const $tabList = $('.header-tab-bar-ul');
  const $iframeContent = $('.iframe-content');

  // 메뉴별 url 매핑
  const urlMap = {
    '대시보드': 'pages/dashboard/dashboard.html',
    'dashboard': 'pages/dashboard/dashboard.html',
    '상품관리': 'pages/product/product-management.html',
    '재고관리': 'pages/inventory/stock-management.html',
    '연동상품관리': 'pages/product/linked-products.html.html',
    // ... 추가 메뉴
  };

  // iframe HTML 템플릿
  const iframeTpl = (url) => `<iframe src="${url}" width="100%" height="700"></iframe>`;

  // 탭 id로 url 반환 (없으면 test1.html)
  function getUrlByTabId(tabId) {
    return urlMap[tabId] || 'test1.html';
  }

  // 탭 활성화 + iframe 내용 갱신
  function setActiveTab($li, url) {
    $tabList.find('.nav-item').removeClass('active');
    $li.addClass('active');
    $iframeContent.html(iframeTpl(url));
    showOrHideCloseBtn();
  }

  // 닫기 버튼 노출 제어 (대시보드 탭은 제외)
  function showOrHideCloseBtn() {
    $tabList.find('li[data-tab="dashboard"] .tab-close-btn').remove();
    $tabList.find('.tab-close-btn').show();
  }

  // 최초 실행 시 대시보드 탭을 생성 (한 번만) 및 활성화
  function initDashboardTab() {
    let $dashboard = $tabList.find('li[data-tab="dashboard"]');
    if (!$dashboard.length) {
      const $li = $(`
        <li class="nav-item active" data-tab="dashboard">
          <a href="#" class="nav-link fixed-tab">대시보드</a>
        </li>
      `);
      $tabList.prepend($li);
      $dashboard = $li;
    }
    setActiveTab($dashboard, urlMap['dashboard']);
  }
  initDashboardTab();

  // 신규 탭 추가 또는 기존 탭 활성화
  function addOrActivateTab(tabId, title, url) {
    let $existing = $tabList.find(`li[data-tab="${tabId}"]`);
    if ($existing.length) {
      setActiveTab($existing, url);
      return;
    }

    const $li = $(`
      <li class="nav-item active" data-tab="${tabId}">
        <a href="#" class="nav-link">${title}
          <button type="button" class="tab-close-btn" style="display:none;">&times;</button>
        </a>
      </li>
    `);
    // 대시보드 오른쪽에 삽입
    $tabList.find('li').eq(0).after($li);
    setActiveTab($li, url);
  }

  // 탭 클릭 시: 해당 탭 활성화 + iframe 교체
  $tabList.on('click', '.nav-item', function (e) {
    if ($(e.target).hasClass('tab-close-btn')) return; // 닫기 버튼은 제외
    e.preventDefault();
    const $li = $(this);
    const tabId = $li.data('tab');
    setActiveTab($li, getUrlByTabId(tabId));
  });

  // 닫기 버튼 클릭 시: 탭 제거 + 옆 탭으로 이동
  $tabList.on('click', '.tab-close-btn', function (e) {
    e.stopPropagation();
    const $li = $(this).closest('li');
    const isActive = $li.hasClass('active');
    let $toActivate;

    // 닫은 탭이 활성 상태라면 옆 탭을 찾아서 활성화
    if (isActive) {
      $toActivate = $li.nextAll('li.nav-item').first();
      if (!$toActivate.length) {
        $toActivate = $li.prevAll('li.nav-item:not([data-tab="dashboard"])').first();
      }
    }
    $li.remove();

    if (isActive) {
      if ($toActivate && $toActivate.length) {
        $toActivate.trigger('click');
      } else {
        // 대체 탭이 없을 경우 대시보드로 복귀
        $tabList.find('li[data-tab="dashboard"]').trigger('click');
      }
    } else {
      showOrHideCloseBtn();
    }
  });

  // 메뉴 클릭 시: 탭 생성 또는 활성화
  $('.deps1-link, .deps2-link').click(function (e) {
    e.preventDefault();
    const $this = $(this);

    // multiple 메뉴 클릭은 확장만 하고 탭 생성 안 함
    if ($this.hasClass('multiple') && $this.next('.deps2').children().length > 0) {
      return;
    }

    // 대시보드 메뉴인 경우 특별 처리
    const isDashboard = $this.hasClass('single') && $this.find('.deps1-title').text().trim() === '대시보드';
    if (isDashboard) {
      initDashboardTab();
      return;
    }

    // 일반 메뉴는 탭 아이디, 제목, url 가져와 생성
    const tabId = $this.text().trim();
    const title = $this.find('.deps1-title, .deps2-title').text() || tabId;
    addOrActivateTab(tabId, title, getUrlByTabId(tabId));
  });
});

// * 헤더 탭 메뉴 좌, 우, 닫기 버튼 툴팁
function headerScrollArrowLeft(node) {
  dhx.tooltip("왼쪽 스크롤", {node: node});
}

function headerScrollArrowRight(node) {
  dhx.tooltip("오른쪽 스크롤", {node: node});
}

function headerScrollAllclose(node) {
  dhx.tooltip("전체탭 닫기", {node: node});
}

// * 헤더 탭 메뉴 이전, 다음, 전체 닫기 버튼
$(document).ready(function () {
  const $tabList = $('.header-tab-bar-ul');
  if ($tabList.length === 0) {
    console.error('탭 ul (.header-tab-bar-ul) 요소를 찾을 수 없습니다.');
    return;
  }
  const $iframeContent = $('.iframe-content');
  const $btnPrev = $('.scroll-arrow.left');
  const $btnNext = $('.scroll-arrow.right');
  const $btnCloseAll = $('.scroll-arrow.close');
  const container = $('.header-tab-bar-container')[0];

  const urlMap = {
    '대시보드': 'pages/dashboard/dashboard.html',
    'dashboard': 'pages/dashboard/dashboard.html',
    '상품관리': 'pages/product/product-management.html',
    '재고관리': 'pages/inventory/stock-management.html',
    '연동상품관리': 'pages/product/linked-products.html.html',
  };

  const iframeTpl = (url) => `<iframe src="${url}" width="100%" height="700"></iframe>`;

  function getUrlByTabId(tabId) {
    return urlMap[tabId] || 'test1.html';
  }

  function setActiveTab($li, url) {
    $tabList.find('.nav-item').removeClass('active');
    $li.addClass('active');
    $iframeContent.html(iframeTpl(url));
    updateTabControls();
  }

  function showOrHideCloseBtn(){
    // 대시보드 탭은 닫기 버튼 제거
    $tabList.find('li[data-tab="dashboard"] .tab-close-btn').remove();
    $tabList.find('.tab-close-btn').show();
  }

  // 전체 닫기 버튼 및 이전/다음 버튼 상태 제어 함수
  function updateTabControls() {
    if (!container) return;

    // 로그로 체크용
    console.log('scrollLeft:', container.scrollLeft);
    console.log('scrollWidth:', container.scrollWidth);
    console.log('clientWidth:', container.clientWidth);

    const $tabs = $tabList.find('li.nav-item');
    const $dashboardTab = $tabs.filter('[data-tab="dashboard"]');
    const activeTabs = $tabs.filter('.active');
    const tabCount = $tabs.length;

    // 대시보드만 있으면 전체 버튼 숨김
    const onlyDashboardActive = (tabCount === 1 && activeTabs.is($dashboardTab));
    if (onlyDashboardActive) {
      $btnPrev.hide();
      $btnNext.hide();
      $btnCloseAll.hide();
      showOrHideCloseBtn();
      return;
    }
    // 탭 추가 시 전체 닫기 버튼 노출
    $btnCloseAll.toggle(tabCount > 0);

    const scrollLeft = container.scrollLeft;
    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;

    if (scrollWidth > clientWidth) {
      if (scrollLeft === 0) {
        $btnPrev.hide();
        $btnNext.show();
      } else if (scrollLeft + clientWidth >= scrollWidth - 1) {
        $btnPrev.show();
        $btnNext.hide();
      } else {
        $btnPrev.show();
        $btnNext.show();
      }
    } else {
      $btnPrev.hide();
      $btnNext.hide();
    }
    showOrHideCloseBtn();
  }

  // 전체 닫기 버튼 클릭 시 대시보드를 제외한 모든 탭 닫기
  function onHeaderScrollAllCloseClick() {
    $tabList.find('li.nav-item').not('[data-tab="dashboard"]').remove();
    const $dashboardTab = $tabList.find('li[data-tab="dashboard"]');
    if($dashboardTab.length) {
      setActiveTab($dashboardTab, getUrlByTabId('dashboard'));
    }
    updateTabControls();
  }

  // 좌우 스크롤 버튼 클릭 시 container 스크롤 이동 (100px씩)
  function onHeaderScrollArrowLeftClick() {
    container.scrollBy({ left: -150, behavior: 'smooth' });
    setTimeout(updateTabControls, 300);
  }

  function onHeaderScrollArrowRightClick() {
    container.scrollBy({ left: 150, behavior: 'smooth' });
    setTimeout(updateTabControls, 300);
  }

  // 초기 대시보드 탭 생성 및 활성화
  function initDashboardTab() {
    let $dashboard = $tabList.find('li[data-tab="dashboard"]');
    if(!$dashboard.length) {
      const $li = $(`
        <li class="nav-item active" data-tab="dashboard">
          <a href="#" class="nav-link fixed-tab">대시보드</a>
        </li>
      `);
      $tabList.prepend($li);
      $dashboard = $li;
    }
    setActiveTab($dashboard, urlMap['dashboard']);
  }
  initDashboardTab();

  // 탭 추가 또는 활성화
  function addOrActivateTab(tabId, title, url) {
    let $existing = $tabList.find(`li[data-tab="${tabId}"]`);
    if($existing.length) {
      setActiveTab($existing, url);
      return;
    }
    const $li = $(`
      <li class="nav-item active" data-tab="${tabId}">
        <a href="#" class="nav-link">${title}
          <button type="button" class="tab-close-btn" style="display:none;">&times;</button>
        </a>
      </li>
    `);
    $tabList.find('li').eq(0).after($li);
    setActiveTab($li, url);
  }

  // 탭 클릭 활성화 처리
  $tabList.on('click', '.nav-item', function(e) {
    if($(e.target).hasClass('tab-close-btn')) return;
    e.preventDefault();
    const $li = $(this);
    const tabId = $li.data('tab');
    setActiveTab($li, getUrlByTabId(tabId));
  });

  // 닫기 버튼 클릭 시 탭 삭제 및 새 탭 활성화
  $tabList.on('click', '.tab-close-btn', function(e) {
    e.stopPropagation();
    const $li = $(this).closest('li');
    const isActive = $li.hasClass('active');
    let $toActivate;

    if(isActive) {
      $toActivate = $li.nextAll('li.nav-item').first();
      if(!$toActivate.length) {
        $toActivate = $li.prevAll('li.nav-item:not([data-tab="dashboard"])').first();
      }
    }
    $li.remove();

    if(isActive) {
      if($toActivate && $toActivate.length) {
        $toActivate.trigger('click');
      } else {
        $tabList.find('li[data-tab="dashboard"]').trigger('click');
      }
    } else {
      updateTabControls();
    }
  });

  // 메뉴 클릭 시 탭 생성 또는 활성화
  $('.deps1-link, .deps2-link').click(function(e) {
    e.preventDefault();
    const $this = $(this);
    if($this.hasClass('multiple') && $this.next('.deps2').children().length > 0) {
      return;
    }
    const isDashboard = $this.hasClass('single') && $this.find('.deps1-title').text().trim() === '대시보드';
    if(isDashboard) {
      initDashboardTab();
      return;
    }
    const tabId = $this.text().trim();
    const title = $this.find('.deps1-title, .deps2-title').text() || tabId;
    addOrActivateTab(tabId, title, getUrlByTabId(tabId));
  });

  // 버튼 이벤트 연결
  $btnPrev.on('click', onHeaderScrollArrowLeftClick);
  $btnNext.on('click', onHeaderScrollArrowRightClick);
  $btnCloseAll.on('click', onHeaderScrollAllCloseClick);

  // container 스크롤 시 버튼 상태 업데이트
  $('.header-tab-bar-container').on('scroll', updateTabControls);

  // 초기 버튼 상태 갱신
  updateTabControls();
});

