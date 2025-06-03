function previewAvatar(input) {
  const reader = new FileReader();
  reader.onload = function (e) {
    document.getElementById("avatarPreview").src = e.target.result;
  };
  if (input.files[0]) {
    reader.readAsDataURL(input.files[0]);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const regionSelect = document.getElementById("region-select");
  const regionDropdown = document.getElementById("region-dropdown");
  const regionText = document.getElementById("region-text");
  const regionHiddenInput = document.getElementById("region-hidden");

  const interestSelect = document.getElementById("interest-select");
  const interestDropdown = document.getElementById("interest-dropdown");
  const interestText = document.getElementById("interest-text");
  const themeIdHiddenInput = document.getElementById("theme-id-hidden");

  const passwordInput = document.getElementById("password");
  const togglePassword = document.querySelector(".toggle-password");

  const regions = [
    "서울", "부산", "대구", "인천", "광주", "대전", "울산", "세종",
    "경기", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"
  ];

  const interests = [
    { id: 1, theme: "자동차" },
    { id: 2, theme: "가방/백" },
     ];

  // 비밀번호 표시 토글
  if (togglePassword && passwordInput) {
    togglePassword.addEventListener("click", function () {
      passwordInput.type = passwordInput.type === "password" ? "text" : "password";
    });
  }

  // 지역 옵션 렌더링
  regions.forEach(region => {
    const div = document.createElement("div");
    div.classList.add("option");
    div.textContent = region;
    div.dataset.value = region;
    div.addEventListener("click", function () {
      regionText.textContent = region;
      regionHiddenInput.value = region;
      regionDropdown.style.display = "none";
    });
    regionDropdown.appendChild(div);
  });

  regionSelect.addEventListener("click", function () {
    regionDropdown.style.display = regionDropdown.style.display === "block" ? "none" : "block";
  });

  // 관심상품 옵션 렌더링
  interests.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("option");
    div.textContent = item.theme;
    div.dataset.value = item.theme;
    div.setAttribute("theme-id", item.id);
    div.addEventListener("click", function () {
      interestText.textContent = item.theme;
      themeIdHiddenInput.value = item.id;
      interestDropdown.style.display = "none";
    });
    interestDropdown.appendChild(div);
  });

  interestSelect.addEventListener("click", function () {
    interestDropdown.style.display = interestDropdown.style.display === "block" ? "none" : "block";
  });

  // 외부 클릭 시 드롭다운 닫기
  document.addEventListener("click", function (e) {
    if (!regionSelect.contains(e.target) && !regionDropdown.contains(e.target)) {
      regionDropdown.style.display = "none";
    }
    if (!interestSelect.contains(e.target) && !interestDropdown.contains(e.target)) {
      interestDropdown.style.display = "none";
    }
  });
});
