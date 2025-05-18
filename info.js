document.getElementById("nextBtn").addEventListener("click", function () {
  const phoneInput = document.getElementById("phone").value.trim();
  const errorMsg = document.getElementById("error-msg");

  // 하이픈 제거
  const phone = phoneInput.replace(/-/g, "");

  // 숫자만 있고, 11자리 (예: 01012345678)
  const phonePattern = /^010\d{8}$/;

  if (!phonePattern.test(phone)) {
    errorMsg.textContent = "연락처 형식이 올바르지 않습니다. 예: 01012345678 또는 010-1234-5678";
    return;
  }

  errorMsg.textContent = "";
  window.location.href = "gumi.html";
});
