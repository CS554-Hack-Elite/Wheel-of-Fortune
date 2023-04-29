const setLocalToken = (tokenName, data) => {
  localStorage.setItem(tokenName, data);
};

const clearLocalTokens = (tokenName, data) => {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("businessAdminToken");
};

export { setLocalToken, clearLocalTokens };
