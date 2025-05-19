const cards = document.querySelectorAll(".card");
const slots = document.querySelectorAll(".slot");
const cardContainer = document.querySelector(".card-container");

let draggedCard = null;
let currentTouchTarget = null;
let lastTouchedCard = null;

// 🟢 카드 드래그 (PC)
cards.forEach((card) => {
  card.addEventListener("dragstart", () => {
    draggedCard = card;
    setTimeout(() => (card.style.display = "none"), 0);
  });

  card.addEventListener("dragend", () => {
    card.style.display = "block";
    draggedCard = null;
  });

  // 🟢 터치 시작 (모바일)
  card.addEventListener("touchstart", () => {
    draggedCard = card;
    card.style.opacity = "0.5";
    lastTouchedCard = card; // ✅ 슬롯 탭 시 참조되도록 저장
  });

  // 🔴 터치 끝 (모바일 드래그 후 슬롯 위에서 떼는 경우)
  card.addEventListener("touchend", () => {
    card.style.opacity = "1";
    const slot = currentTouchTarget?.closest(".slot");
    if (draggedCard && slot) {
      placeCardInSlot(slot, draggedCard);
    }
    draggedCard = null;
    currentTouchTarget = null;
  });
});

// 🔵 터치 이동 중 현재 위치 추적 (Mobile)
document.addEventListener("touchmove", (e) => {
  const touch = e.touches[0];
  currentTouchTarget = document.elementFromPoint(touch.clientX, touch.clientY);
});

// 🟣 슬롯에 카드 드롭 (PC)
slots.forEach((slot) => {
  slot.addEventListener("dragover", (e) => e.preventDefault());

  slot.addEventListener("drop", () => {
    if (draggedCard) {
      placeCardInSlot(slot, draggedCard);
    }
  });

  // ✅ 터치 후 슬롯 터치 시 동작 (모바일)
  slot.addEventListener("touchend", () => {
    if (lastTouchedCard) {
      placeCardInSlot(slot, lastTouchedCard);
      lastTouchedCard = null;
    }
  });

  // ✅ 보조: 클릭만으로도 동작
  slot.addEventListener("click", () => {
    if (lastTouchedCard) {
      placeCardInSlot(slot, lastTouchedCard);
      lastTouchedCard = null;
    }
  });
});

// ✅ 슬롯에 카드 넣기
function placeCardInSlot(slot, card) {
  slot.appendChild(card);

  card.style.position = "absolute";
  card.style.top = "0";
  card.style.left = "0";
  card.style.width = `${slot.clientWidth}px`;
  card.style.height = `${slot.clientHeight}px`;
  card.style.zIndex = "2";

  const img = card.querySelector("img");
  if (img) {
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "cover";
    img.style.borderRadius = "8px";
  }

  attachRemoveButton(slot, card);
}

// ❌ X 버튼 붙이기
function attachRemoveButton(slot, card) {
  removeRemoveButton(slot);
  const btn = document.createElement("button");
  btn.textContent = "×";
  btn.className = "x-btn";
  btn.onclick = () => moveCardBack(card, btn);
  slot.appendChild(btn);
}

// ❌ 기존 제거 버튼 삭제
function removeRemoveButton(slot) {
  const existingBtn = slot.querySelector(".x-btn");
  if (existingBtn) existingBtn.remove();
}

// 🔁 카드 원래 자리로 이동
function moveCardBack(card, btn) {
  card.removeAttribute("style");
  card.className = "card";
  card.setAttribute("draggable", "true");
  cardContainer.appendChild(card);
  btn.remove();
}

// 🔄 전체 리셋
document.querySelector(".reset-btn").addEventListener("click", () => {
  document.querySelectorAll(".slot .card").forEach((card) => {
    const btn = card.parentElement.querySelector(".x-btn");
    moveCardBack(card, btn);
  });
});

// 💾 저장 버튼
document.querySelector(".save-btn").addEventListener("click", () => {
  const slots = document.querySelectorAll(".slot");
  const cardOrder = [];
  slots.forEach((slot) => {
    const card = slot.querySelector(".card");
    if (card) {
      const alt = card.querySelector("img")?.getAttribute("alt") || "";
      const num = alt.replace("Card", "").replace("R", "1");
      cardOrder.push(num);
    } else {
      cardOrder.push("");
    }
  });

  fetch(
    "https://script.google.com/macros/s/AKfycbx9mEwSDeBFCFGyXSexbGYApYc6gu0gtvdG3LZSHPXh17B_ygt6A2VEyTftkrS2RM02/exec",
    {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cardOrder }),
    }
  )
    .then(() => alert("저장되었습니다!"))
    .catch(() => alert("저장 중 오류가 발생했습니다."));
});
