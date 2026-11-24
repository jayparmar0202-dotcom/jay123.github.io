
// TYPING ANIMATION

const words = [
    "College Student",
    "Developer",
    "Programmer",
    "Tech Enthusiast"
];

let wordIndex = 0;
let charIndex = 0;
let deleting = false;

function typeEffect() {
    const typing = document.getElementById("typing");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        typing.textContent = words[0];
        return;
    }

    const currentWord = words[wordIndex];

    if (!deleting) {
        typing.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;

        if (charIndex === currentWord.length) {
            deleting = true;
            setTimeout(typeEffect, 1200);
            return;
        }
    } else {
        typing.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
            deleting = false;
            wordIndex = (wordIndex + 1) % words.length;
        }
    }

    setTimeout(typeEffect, deleting ? 60 : 100);
}

typeEffect();

// MOBILE MENU

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("show");
});

document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("show");
    });
});

// THEME TOGGLE

const themeToggle = document.getElementById("themeToggle");

themeToggle.addEventListener("click", () => {
    const isLight = document.body.dataset.theme !== "light";
    document.body.dataset.theme = isLight ? "light" : "dark";
    themeToggle.setAttribute("aria-pressed", String(isLight));
    themeToggle.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
    themeToggle.textContent = isLight ? "🌙" : "☀️";
});

// SUBTLE POINTER EFFECT

const cursorGlow = document.getElementById("cursor-glow");

if (window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.addEventListener("pointermove", event => {
        cursorGlow.style.left = `${event.clientX}px`;
        cursorGlow.style.top = `${event.clientY}px`;
        cursorGlow.classList.add("visible");
    });

    document.addEventListener("pointerover", event => {
        cursorGlow.classList.toggle("over-link", Boolean(event.target.closest("a, button")));
    });

    document.addEventListener("pointerleave", () => {
        cursorGlow.classList.remove("visible");
    });
}

// PUBLIC GITHUB PROJECTS AND ACTIVITY

const githubRepos = document.getElementById("githubRepos");
const githubReposStatus = document.getElementById("githubReposStatus");
const githubActivity = document.getElementById("githubActivity");
const githubActivityStatus = document.getElementById("githubActivityStatus");
const githubUsername = "jayparmar0202-dotcom";

function createGitHubLink(url, label) {
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = label;
    return link;
}

async function loadGitHubRepositories() {
    try {
        const response = await fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=6`);
        if (!response.ok) {
            throw new Error(`GitHub returned HTTP ${response.status}`);
        }

        const repositories = await response.json();
        if (!repositories.length) {
            githubReposStatus.textContent = "No public repositories were found.";
            return;
        }

        repositories.forEach(repository => {
            const item = document.createElement("article");
            item.className = "github-item";
            item.append(createGitHubLink(repository.html_url, repository.name));

            if (repository.description) {
                const description = document.createElement("p");
                description.textContent = repository.description;
                item.append(description);
            }

            const details = document.createElement("p");
            details.className = "github-meta";
            details.textContent = [
                repository.language,
                `★ ${repository.stargazers_count}`,
                `Updated ${new Date(repository.updated_at).toLocaleDateString()}`
            ].filter(Boolean).join(" · ");
            item.append(details);
            githubRepos.append(item);
        });

        githubReposStatus.textContent = "";
    } catch (error) {
        githubReposStatus.textContent = `Could not load repositories: ${error.message}`;
    }
}

async function loadGitHubActivity() {
    try {
        const response = await fetch(`https://api.github.com/users/${githubUsername}/events/public?per_page=6`);
        if (!response.ok) {
            throw new Error(`GitHub returned HTTP ${response.status}`);
        }

        const events = await response.json();
        if (!events.length) {
            githubActivityStatus.textContent = "No recent public activity was found.";
            return;
        }

        events.forEach(event => {
            const item = document.createElement("article");
            item.className = "github-item";
            const activity = document.createElement("p");
            activity.textContent = `${event.type.replace("Event", "")} · ${event.repo.name}`;
            item.append(activity);

            const date = document.createElement("p");
            date.className = "github-meta";
            date.textContent = new Date(event.created_at).toLocaleDateString();
            item.append(date);
            githubActivity.append(item);
        });

        githubActivityStatus.textContent = "";
    } catch (error) {
        githubActivityStatus.textContent = `Could not load activity: ${error.message}`;
    }
}

loadGitHubRepositories();
loadGitHubActivity();

// SCROLL REVEAL ANIMATION

const revealElements = document.querySelectorAll(".reveal");

function revealOnScroll() {
    revealElements.forEach(element => {
        const position = element.getBoundingClientRect().top;
        const screenHeight = window.innerHeight;

        if (position < screenHeight - 100) {
            element.classList.add("active");
        }
    });
}

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);

// BACK TO TOP BUTTON

const topButton = document.getElementById("topButton");

window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
        topButton.style.display = "block";
    } else {
        topButton.style.display = "none";
    }
});

topButton.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

// AUTOMATIC COPYRIGHT YEAR

document.getElementById("year").textContent =
    new Date().getFullYear();