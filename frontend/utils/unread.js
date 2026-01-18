export const getUnread = () => JSON.parse(localStorage.getItem("unreadMessages") || "[]");

export const addUnread = (id) => {
  const arr = getUnread();
  if (!arr.includes(id)) arr.push(id);
  localStorage.setItem("unreadMessages", JSON.stringify(arr));
};

export const removeUnread = (id) => {
  const arr = getUnread().filter(x => x !== id);
  localStorage.setItem("unreadMessages", JSON.stringify(arr));
};

export const clearAllUnread = () => {
  localStorage.removeItem("unreadMessages");
};
