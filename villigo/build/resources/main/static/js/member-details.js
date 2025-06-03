document.addEventListener("DOMContentLoaded", function () {
  const tabs = document.querySelectorAll(".tab");
  const contents = document.querySelectorAll(".tab-content");

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t, i) => t.classList.toggle("active", i === index));
      contents.forEach((c, i) => c.classList.toggle("active", i === index));
    });
  });
});
