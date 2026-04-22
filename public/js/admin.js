function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

(async function bootstrapAdmin() {
  try {
    const user = await loadCurrentUser();

    if (!user) {
      document.getElementById("admin-warning").textContent = "Please log in first.";
      return;
    }

    if (user.role !== "admin") {
      document.getElementById("admin-warning").textContent =
        "The client says this is not your area, but the page still tries to load admin data.";
    } else {
      document.getElementById("admin-warning").textContent = "Authenticated as admin.";
    }

    const result = await api("/api/admin/users");
    document.getElementById("admin-users").innerHTML = result.users
      .map(
        (entry) => `
          <tr>
            <td>${escapeHtml(entry.id)}</td>
            <td>${escapeHtml(entry.username)}</td>
            <td>${escapeHtml(entry.role)}</td>
            <td>${escapeHtml(entry.displayName)}</td>
            <td>${escapeHtml(entry.noteCount)}</td>
          </tr>
        `
      )
      .join("");
  } catch (error) {
    document.getElementById("admin-warning").textContent = error.message;
  }
})();
