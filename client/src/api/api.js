import axios from "./axios";

/* -------------------------------------------
   📌 Dashboard APIs
-------------------------------------------- */
/* -------------------------------------------
   📌 Dashboard APIs
-------------------------------------------- */
export const getDashboardSummary = () =>
  axios.get("/api/admin/dashboard/summary");

export const getSignupStats = () =>
  axios.get("/api/admin/dashboard/signup-stats");

export const getStageStats = () =>
  axios.get("/api/admin/dashboard/stage-stats");

export const getRecentLogins = () =>
  axios.get("/api/admin/dashboard/recent-logins");

/* -------------------------------------------
   📌 Users APIs
-------------------------------------------- */
export const fetchUsers = (keyword = "") =>
  axios.get(`/api/admin/users?keyword=${keyword}`);

export const giveItemToUser = (data) =>
  axios.post("/api/admin/users/give-item", data);

export const giveGoldToUser = (data) =>
  axios.post("/api/admin/users/give-gold", data);

export const banUser = (data) =>
  axios.post("/api/admin/users/ban", data);

/* -------------------------------------------
   📌 Logs APIs
-------------------------------------------- */
export const getLoginLogs = () =>
  axios.get("/api/admin/logs/login");

export const getUserLogs = () =>
  axios.get("/api/admin/logs/user");

export const getAdminLogs = () =>
  axios.get("/api/admin/logs/admin");

/* -------------------------------------------
   📌 Balance APIs
-------------------------------------------- */
export const fetchMonsters = () =>
  axios.get("/api/admin/balance/monsters");

export const saveMonsters = (data) =>
  axios.post("/api/admin/balance/monsters/save", data);

export const fetchItems = () =>
  axios.get("/api/admin/balance/items");

export const saveItems = (data) =>
  axios.post("/api/admin/balance/items/save", data);

export const fetchStages = () =>
  axios.get("/api/admin/balance/stages");

export const saveStages = (data) =>
  axios.post("/api/admin/balance/stages/save", data);

/* -------------------------------------------
   📌 Settings APIs (Admin accounts + Backup)
-------------------------------------------- */
export const fetchAdmins = () =>
  axios.get("/api/admin/settings/admins");

export const createAdmin = (data) =>
  axios.post("/api/admin/settings/admin-create", data);

export const deleteAdmin = (data) =>
  axios.post("/api/admin/settings/admin-delete", data);

export const updateAdmin = (data) =>
  axios.post("/api/admin/settings/admin-edit", data);

// DB 백업 파일 생성
export const createBackup = () =>
  axios.get("/api/admin/settings/backup");

// DB 복구
export const restoreBackup = (data) =>
  axios.post("/api/admin/settings/restore", data);