// Global variables
let weatherData = [];
let currentUser = null;

const burger = document.querySelector(".burger");
const navLinks = document.querySelector(".nav-links");
const header = document.getElementById("header");
const scrollTopBtn = document.getElementById("scrollTop");
const contactForm = document.getElementById("contactForm");
const cookieNotification = document.getElementById("cookieNotification");

document.addEventListener("DOMContentLoaded", function () {
  initializeApp();
});

function initializeApp() {
  if (!localStorage.getItem("cookiesAccepted")) {
    showCookieNotification();
  }

  loadWeatherData();

  addScrollAnimations();

  loadUserData();
}

function showCookieNotification() {
  cookieNotification.classList.add("show");
}
// cookiebis menu
function acceptCookies() {
  localStorage.setItem("cookiesAccepted", "true");
  cookieNotification.classList.remove("show");
}

// Burger Menu
burger.addEventListener("click", function () {
  burger.classList.toggle("active");
  navLinks.classList.toggle("active");
});

// amindis data
window.addEventListener("scroll", function () {
  if (window.scrollY > 100) {
    header.classList.add("scrolled");
    scrollTopBtn.classList.add("visible");
  } else {
    header.classList.remove("scrolled");
    scrollTopBtn.classList.remove("visible");
  }
});
//smooth sqrolvistvis
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

// Form validation
function validateForm() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const password = document.getElementById("password").value;

  let isValid = true;

  // Name validation
  if (name.length < 2) {
    showError("nameError", "სახელი უნდა შეიცავდეს მინიმუმ 2 სიმბოლოს");
    isValid = false;
  } else {
    hideError("nameError");
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showError("emailError", "ელ-ფოსტა არასწორი ფორმატშია");
    isValid = false;
  } else {
    hideError("emailError");
  }

  // Phone validation
  const phoneRegex = /^[0-9]{9,15}$/;
  if (!phoneRegex.test(phone.replace(/\s/g, ""))) {
    showError("phoneError", "ტელეფონი უნდა შეიცავდეს 9-15 ციფრს");
    isValid = false;
  } else {
    hideError("phoneError");
  }

  // Password validation
  if (password.length < 8) {
    showError("passwordError", "პაროლი უნდა შეიცავდეს მინიმუმ 8 სიმბოლოს");
    isValid = false;
  } else {
    hideError("passwordError");
  }

  return isValid;
}

function showError(errorId, message) {
  const errorElement = document.getElementById(errorId);
  errorElement.textContent = message;
  errorElement.style.display = "block";
}

function hideError(errorId) {
  const errorElement = document.getElementById(errorId);
  errorElement.style.display = "none";
}

function togglePassword() {
  const passwordInput = document.getElementById("password");
  const toggleBtn = document.querySelector(".password-toggle");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    toggleBtn.textContent = "🙈";
  } else {
    passwordInput.type = "password";
    toggleBtn.textContent = "👁️";
  }
}

contactForm.addEventListener("submit", function (e) {
  e.preventDefault();

  if (validateForm()) {
    const formData = {
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      password: document.getElementById("password").value,
      message: document.getElementById("message").value.trim(),
      timestamp: new Date().toISOString(),
    };

    saveUserData(formData);

    alert("რეგისტრაცია წარმატებით დასრულდა!");
    contactForm.reset();
  }
});

function saveUserData(userData) {
  let users = JSON.parse(localStorage.getItem("travelBuddyUsers")) || [];
  users.push(userData);
  localStorage.setItem("travelBuddyUsers", JSON.stringify(users));
  currentUser = userData;
}

function loadUserData() {
  const users = JSON.parse(localStorage.getItem("travelBuddyUsers")) || [];
  if (users.length > 0) {
    currentUser = users[users.length - 1];
  }
}

// amindis API funqcionireba
async function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  const resultDiv = document.getElementById("weatherResult");

  if (!city) {
    alert("გთხოვთ შეიყვანოთ ქალაქის სახელი");
    return;
  }

  try {
    // vikeneb OpenWeatherMap API
    const API_KEY = "demo_key"; // In real app, use actual API key
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=ka`;

    // demo miznebistvis
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/posts/1"
    );
    const data = await response.json();

    const mockWeatherData = {
      city: city,
      temperature: Math.floor(Math.random() * 30) + 5,
      description: "მზიანი",
      humidity: Math.floor(Math.random() * 50) + 30,
      windSpeed: Math.floor(Math.random() * 10) + 3,
    };

    displayWeather(mockWeatherData);

    weatherData.push(mockWeatherData);
  } catch (error) {
    console.error("Error fetching weather:", error);
    resultDiv.innerHTML = `<p style="color: red;">ამინდის ინფორმაციის მიღება ვერ მოხერხდა</p>`;
    resultDiv.style.display = "block";
  }
}

function displayWeather(data) {
  const resultDiv = document.getElementById("weatherResult");
  resultDiv.innerHTML = `
                <h3>${data.city}</h3>
                <div style="display: flex; justify-content: space-between; margin-top: 1rem;">
                    <div>
                        <p><strong>ტემპერატურა:</strong> ${data.temperature}°C</p>
                        <p><strong>აღწერა:</strong> ${data.description}</p>
                    </div>
                    <div>
                        <p><strong>ტენიანობა:</strong> ${data.humidity}%</p>
                        <p><strong>ქარის სიჩქარე:</strong> ${data.windSpeed} მ/წმ</p>
                    </div>
                </div>
            `;
  resultDiv.style.display = "block";
}

// damatebiti data amindis API
async function loadWeatherData() {
  try {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/posts?_limit=5"
    );
    const posts = await response.json();

    const mockWeatherData = posts.map((post) => ({
      city: `ქალაქი ${post.id}`,
      temperature: Math.floor(Math.random() * 30) + 5,
      description: "მზიანი",
      humidity: Math.floor(Math.random() * 50) + 30,
      windSpeed: Math.floor(Math.random() * 10) + 3,
      id: post.id,
    }));

    weatherData = mockWeatherData;
    console.log("Weather data loaded:", weatherData);
  } catch (error) {
    console.error("Error loading weather data:", error);
  }
}

// Scroll animations
function addScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate__animated", "animate__fadeInUp");
      }
    });
  }, observerOptions);

  document.querySelectorAll(".fade-in").forEach((el) => {
    observer.observe(el);
  });
}
//damatebitad dropdown
function createDropdownMenu() {
  const navLinks = document.querySelector(".nav-links");
  const dropdown = document.createElement("li");
  dropdown.innerHTML = `
                <a href="#" class="dropdown-toggle">მეტი <span>▼</span></a>
                <ul class="dropdown-menu">
                    <li><a href="#about">ბლოგი</a></li>
                    <li><a href="#destinations">გალერეა</a></li>
                    <li><a href="#contact">მხარდაჭერა</a></li>
                </ul>
            `;
  navLinks.appendChild(dropdown);

  // Dropdown styles
  const style = document.createElement("style");
  style.textContent = `
                .dropdown-menu {
                    display: none;
                    position: absolute;
                    top: 100%;
                    left: 0;
                    background: white;
                    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
                    border-radius: 5px;
                    min-width: 150px;
                    z-index: 1000;
                }

                .dropdown-menu li {
                    list-style: none;
                }

                .dropdown-menu a {
                    padding: 0.5rem 1rem;
                    display: block;
                    color: #333;
                    text-decoration: none;
                    transition: background 0.3s ease;
                }

                .dropdown-menu a:hover {
                    background: #f8fafc;
                }

                li:hover .dropdown-menu {
                    display: block;
                }

                .dropdown-toggle {
                    position: relative;
                }
            `;
  document.head.appendChild(style);
}

function createTodoList() {
  const todoContainer = document.createElement("div");
  todoContainer.innerHTML = `
                <div style="background: white; padding: 2rem; border-radius: 15px; box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1); margin: 2rem 0;">
                    <h3 style="margin-bottom: 1rem; color: #2563eb;">მოგზაურობის დაგეგმვა</h3>
                    <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
                        <input type="text" id="todoInput" placeholder="ახალი დავალება..." style="flex: 1; padding: 0.5rem; border: 1px solid #ddd; border-radius: 5px;">
                        <button onclick="addTodo()" style="background: #2563eb; color: white; border: none; padding: 0.5rem 1rem; border-radius: 5px; cursor: pointer;">დამატება</button>
                    </div>
                    <ul id="todoList" style="list-style: none; padding: 0;"></ul>
                </div>
            `;

  const aboutSection = document.getElementById("about");
  aboutSection.appendChild(todoContainer);
}

function addTodo() {
  const input = document.getElementById("todoInput");
  const todoList = document.getElementById("todoList");
  const task = input.value.trim();

  if (task) {
    const li = document.createElement("li");
    li.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 1rem; padding: 0.5rem; border-bottom: 1px solid #eee;">
                        <input type="checkbox" onchange="toggleTodo(this)">
                        <span style="flex: 1;">${task}</span>
                        <button onclick="removeTodo(this)" style="background: #ef4444; color: white; border: none; padding: 0.25rem 0.5rem; border-radius: 3px; cursor: pointer;">წაშლა</button>
                    </div>
                `;
    todoList.appendChild(li);
    input.value = "";

    saveTodos();
  }
}

function toggleTodo(checkbox) {
  const span = checkbox.nextElementSibling;
  if (checkbox.checked) {
    span.style.textDecoration = "line-through";
    span.style.color = "#999";
  } else {
    span.style.textDecoration = "none";
    span.style.color = "#333";
  }
  saveTodos();
}

function removeTodo(button) {
  button.parentElement.parentElement.remove();
  saveTodos();
}

function saveTodos() {
  const todos = [];
  document.querySelectorAll("#todoList li").forEach((li) => {
    const checkbox = li.querySelector('input[type="checkbox"]');
    const text = li.querySelector("span").textContent;
    todos.push({
      text: text,
      completed: checkbox.checked,
    });
  });
  localStorage.setItem("travelBuddyTodos", JSON.stringify(todos));
}

function loadTodos() {
  const todos = JSON.parse(localStorage.getItem("travelBuddyTodos")) || [];
  todos.forEach((todo) => {
    const todoList = document.getElementById("todoList");
    const li = document.createElement("li");
    li.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 1rem; padding: 0.5rem; border-bottom: 1px solid #eee;">
                        <input type="checkbox" ${
                          todo.completed ? "checked" : ""
                        } onchange="toggleTodo(this)">
                        <span style="flex: 1; ${
                          todo.completed
                            ? "text-decoration: line-through; color: #999;"
                            : ""
                        }">${todo.text}</span>
                        <button onclick="removeTodo(this)" style="background: #ef4444; color: white; border: none; padding: 0.25rem 0.5rem; border-radius: 3px; cursor: pointer;">წაშლა</button>
                    </div>
                `;
    todoList.appendChild(li);
  });
}

setTimeout(() => {
  createDropdownMenu();
  createTodoList();
  loadTodos();
}, 1000);

function createMultiSelect() {
  const destinationsGrid = document.getElementById("destinationsGrid");

  const selectAllBtn = document.createElement("button");
  selectAllBtn.textContent = "ყველას მონიშვნა";
  selectAllBtn.style.cssText = `
                background: #2563eb;
                color: white;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 5px;
                cursor: pointer;
                margin-bottom: 1rem;
            `;
  selectAllBtn.onclick = selectAllDestinations;

  destinationsGrid.parentElement.insertBefore(selectAllBtn, destinationsGrid);

  document.querySelectorAll(".destination-card").forEach((card) => {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.style.cssText = `
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    width: 20px;
                    height: 20px;
                    cursor: pointer;
                `;
    card.style.position = "relative";
    card.appendChild(checkbox);
  });
}

function selectAllDestinations() {
  const checkboxes = document.querySelectorAll(
    '.destination-card input[type="checkbox"]'
  );
  const allSelected = Array.from(checkboxes).every((cb) => cb.checked);

  checkboxes.forEach((checkbox) => {
    checkbox.checked = !allSelected;
  });
}

setTimeout(() => {
  createMultiSelect();
}, 1500);

function saveSessionData() {
  const sessionData = {
    currentPage: window.location.hash || "#home",
    timestamp: new Date().toISOString(),
    weatherSearches: weatherData.length,
  };
  sessionStorage.setItem("travelBuddySession", JSON.stringify(sessionData));
}

window.addEventListener("beforeunload", saveSessionData);

function loadSessionData() {
  const sessionData = JSON.parse(sessionStorage.getItem("travelBuddySession"));
  if (sessionData) {
    console.log("Session data loaded:", sessionData);
  }
}

// gamodzaxeba load session data
loadSessionData();
