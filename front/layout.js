// 사이드바 연결
fetch("../pages/layout/sidebar.html")
.then((response) => response.text())
.then((data) => {
  document.querySelector("#sidebar").innerHTML = data;

  // fetch 후에 아이콘 상태를 맞춰주는 함수 호출!
  setSidebarIconState();
});

// 아이콘 상태 맞추는 함수
function setSidebarIconState() {
  const $leftSide = document.querySelector('.left-side');
  const $icon = document.querySelector(
      '.btn-sidebar-toggle .icon-sidebar-toggle');
  const currentPage = window.location.pathname.split('/').pop();

  if (!$icon || !$leftSide) {
    return;
  }

  if (currentPage === 'dashBoard.html') {
    // 대시보드면 펼침 + 왼쪽 아이콘
    $leftSide.classList.remove('collapsed');
    $icon.classList.remove('icon-sidebar-arrow-right');
    $icon.classList.add('icon-sidebar-arrow-left');
  } else {
    // 그 외엔 닫힘 + 오른쪽 아이콘
    $leftSide.classList.add('collapsed');
    $icon.classList.remove('icon-sidebar-arrow-left');
    $icon.classList.add('icon-sidebar-arrow-right');
  }
}
