const cards = document.querySelectorAll(".card");
const slots = document.querySelectorAll(".slot");
const cardContainer = document.querySelector(".card-container");

let draggedCard = null;

cards.forEach((card) => {
  card.addEventListener("dragstart", () => {
    draggedCard = card;
    setTimeout(() => (card.style.display = "none"), 0);
  });

  card.addEventListener("dragend", () => {
    card.style.display = "block";
    draggedCard = null;
  });

  card.addEventListener("touchstart", () => {
    draggedCard = card;
    card.style.opacity = "0.5";
  });

  card.addEventListener("touchend", () => {
    card.style.opacity = "1";
    draggedCard = null;
  });
});

slots.forEach((slot) => {
  slot.addEventListener("dragover", (e) => e.preventDefault());

  slot.addEventListener("drop", () => {
    if (draggedCard && !slot.querySelector("img")) {
      slot.appendChild(draggedCard);
      draggedCard.style.position = "absolute";
      draggedCard.style.top = 0;
      draggedCard.style.left = 0;
      draggedCard.style.width = "100%";
      draggedCard.style.height = "100%";
      attachRemoveButton(slot, draggedCard);
    }
  });

  slot.addEventListener("touchend", () => {
    if (draggedCard && !slot.querySelector("img")) {
      slot.appendChild(draggedCard);
      draggedCard.style.position = "absolute";
      draggedCard.style.top = 0;
      draggedCard.style.left = 0;
      draggedCard.style.width = "100%";
      draggedCard.style.height = "100%";
      attachRemoveButton(slot, draggedCard);
    }
  });
});

function attachRemoveButton(slot, card) {
  removeRemoveButton(slot);
  const btn = document.createElement("button");
  btn.textContent = "×";
  btn.className = "x-btn";
  btn.onclick = () => moveCardBack(card, btn);
  slot.appendChild(btn);
}

function removeRemoveButton(slot) {
  const existingBtn = slot.querySelector(".x-btn");
  if (existingBtn) existingBtn.remove();
}

function moveCardBack(card, btn) {
  card.removeAttribute("style");
  card.className = "card";
  card.setAttribute("draggable", "true");
  cardContainer.appendChild(card);
  btn.remove();
}

document.querySelector(".reset-btn").addEventListener("click", () => {
  document.querySelectorAll(".slot .card").forEach((card) => {
    const btn = card.parentElement.querySelector(".x-btn");
    moveCardBack(card, btn);
  });
});

document.querySelector(".save-btn").addEventListener("click", () => {
  const slotImages = document.querySelectorAll(".slot img");
  const cardOrder = [];

  slotImages.forEach((img) => {
    const alt = img?.getAttribute("alt") || "";
    if (alt.startsWith("Card")) {
      cardOrder.push(alt.replace("Card", ""));
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
    .then(() => {
      alert("저장되었습니다!");
    })
    .catch(() => {
      alert("저장 중 오류가 발생했습니다.");
    });
});
