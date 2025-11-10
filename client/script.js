const API_BASE = "http://localhost:3000/api";

async function request(url, method = "GET", body = null) {
  const options = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (body) options.body = JSON.stringify(body);

  try {
    const res = await fetch(`${API_BASE}${url}`, options);
    const data = await res.json();
    document.getElementById("output").textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    document.getElementById("output").textContent = `❌ Error: ${err.message}`;
  }
}

/* 🎮 Player API */
function registerPlayer() {
  request("/player/register", "POST", { login_id: "tester", password: "1234" });
}

function saveResult() {
  request("/player/saveResult", "POST", {
    char_id: 1,
    hp: 120,
    atk: 30,
    def: 25,
    gold: 800,
    max_stage: 2,
  });
}

/* 🏆 Rank API */
function getGlobalRank() {
  request("/rank/global");
}

/* 🎒 Inventory API */
function getInventory() {
  request("/inventory/1"); // char_id = 1
}

function addItem() {
  request("/inventory/add", "POST", {
    char_id: 1,
    item_id: 2,
    quantity: 1,
  });
}

/* 💰 Auction API */
function getAuctionList() {
  request("/auction/list");
}

function registerAuction() {
  request("/auction/register", "POST", {
    inventory_id: 1,
    price: 1500,
    quantity: 1,
  });
}
