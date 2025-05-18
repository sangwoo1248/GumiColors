const cards = document.querySelectorAll(".card");
const slots = document.querySelectorAll(".slot");
const cardContainer = document.querySelector(".card-container");

let draggedCard = null;
let selectedCard = null;

// 카드 드래그 설정
cards.forEach((card) => {
  card.setAttribute("draggable", "true");
  card.addEventListener("dragstart", handleDragStart);
  card.addEventListener("dragend", handleDragEnd);
});

// 슬롯 드래그 이벤트
slots.forEach((slot) => {
  slot.addEventListener("dragover", (e) => e.preventDefault());
  slot.addEventListener("dragenter", handleDragEnter);
  slot.addEventListener("dragleave", handleDragLeave);
  slot.addEventListener("drop", handleDrop);
});

// 카드 클릭 선택
cards.forEach((card) => {
  card.addEventListener("click", () => {
    if (selectedCard) selectedCard.classList.remove("selected");
    selectedCard = card;
    selectedCard.classList.add("selected");
  });
});

// 슬롯 클릭 시 카드 배치
slots.forEach((slot) => {
  slot.addEventListener("click", () => {
    if (!selectedCard) return;
    if (slot.querySelector(".card")) return;

    slot.appendChild(selectedCard);
    selectedCard.style.position = "absolute";
    selectedCard.style.top = "0";
    selectedCard.style.left = "0";
    selectedCard.style.width = "100%";
    selectedCard.style.height = "100%";

    attachRemoveButton(slot, selectedCard);
    selectedCard.classList.remove("selected");
    selectedCard = null;
  });
});

function handleDragStart() {
  draggedCard = this;
  setTimeout(() => (this.style.display = "none"), 0);
}

function handleDragEnd() {
  this.style.display = "flex";
  draggedCard = null;
}

function handleDragEnter() {
  this.style.backgroundColor = "#d0f0ff";
}

function handleDragLeave() {
  this.style.backgroundColor = "";
}

function handleDrop() {
  if (!draggedCard) return;
  if (this.querySelector(".card")) {
    this.style.backgroundColor = "";
    return;
  }

  this.appendChild(draggedCard);
  this.style.backgroundColor = "";
  draggedCard.style.position = "absolute";
  draggedCard.style.top = "0";
  draggedCard.style.left = "0";
  draggedCard.style.width = "100%";
  draggedCard.style.height = "100%";

  attachRemoveButton(this, draggedCard);
}

// X 버튼 추가
function attachRemoveButton(slot, card) {
  removeRemoveButton(slot);

  const btn = document.createElement("button");
  btn.textContent = "×";
  btn.className = "x-btn";
  btn.onclick = () => moveCardBack(card, btn);

  slot.appendChild(btn);
}

// 기존 X 버튼 제거
function removeRemoveButton(slot) {
  const existingBtn = slot.querySelector(".x-btn");
  if (existingBtn) existingBtn.remove();
}

// 카드 원래 위치로 이동
function moveCardBack(card, btn) {
  card.removeAttribute("style");
  card.className = "card";
  card.setAttribute("draggable", "true");
  cardContainer.appendChild(card);
  if (btn) btn.remove();
}

// 전체 초기화
function resetAll() {
  document.querySelectorAll(".slot .card").forEach((card) => {
    const btn = card.parentElement.querySelector(".x-btn");
    moveCardBack(card, btn);
  });
}

// 저장 기능
function saveToSheet(cardOrder) {
  fetch(
    "https://script.google.com/macros/s/AKfycbwo21FVrPJ9pvSDFksN8muVJuxkW-W4bUZkSyW4BejHs7ZPr-Tm59RsJ_de-W-A4KCi/exec",
    {
      // <-- 실제 Google Apps Script URL로 대체 필요
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cardOrder: cardOrder,
      }),
    }
  )
    .then(() => {
      alert("저장되었습니다!");
    })
    .catch((error) => {
      console.error("저장 오류:", error);
      alert("저장 중 오류가 발생했습니다.");
    });
}

// 슬롯에 있는 카드 alt로 순서 저장
function handleSave() {
  const slots = document.querySelectorAll(".slot");
  const cardOrder = [];

  slots.forEach((slot) => {
    const card = slot.querySelector(".card img");
    if (card) {
      const alt = card.getAttribute("alt") || "";
      if (alt.startsWith("Card")) {
        cardOrder.push(alt.replace("Card", ""));
      } else {
        cardOrder.push(alt);
      }
    } else {
      cardOrder.push("");
    }
  });

  saveToSheet(cardOrder);
}

document.querySelector(".save-btn").addEventListener("click", handleSave);
