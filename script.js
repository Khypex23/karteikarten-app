let data = {};
let selectedCategory = null;
let selectedSubcategory = null;
let currentQuestions = [];
let currentIndex = 0;

fetch("karten.json")
    .then(res => res.json())
    .then(json => {
        data = json;
        renderCategories();
    });

function openCategoryModal() {
    document.getElementById("categoryModal").classList.remove("hidden");
}

function closeCategoryModal() {
    document.getElementById("categoryModal").classList.add("hidden");
}

function renderCategories() {
    const list = document.getElementById("categoryList");
    list.innerHTML = "";

    for (let category in data) {
        const div = document.createElement("div");
        div.className = "categoryItem";
        div.innerHTML = `<span onclick="toggleSub('${category}')">➕</span> ${category}`;
        
        div.onclick = (e) => {
            if (e.target.tagName !== "SPAN") {
                chooseCategory(category);
            }
        };

        list.appendChild(div);

        const subDiv = document.createElement("div");
        subDiv.id = "sub_" + category;
        subDiv.classList.add("hidden");

        for (let sub in data[category]) {
            const subItem = document.createElement("div");
            subItem.className = "categoryItem subcategory";
            subItem.textContent = sub;
            subItem.onclick = () => chooseSubcategory(category, sub);
            subDiv.appendChild(subItem);
        }

        list.appendChild(subDiv);
    }
}

function toggleSub(category) {
    const el = document.getElementById("sub_" + category);
    el.classList.toggle("hidden");
}

function chooseCategory(category) {
    selectedCategory = category;
    selectedSubcategory = null;
    document.getElementById("selectedCategory").textContent = category;
    document.getElementById("startButton").classList.remove("hidden");
    closeCategoryModal();
}

function chooseSubcategory(category, sub) {
    selectedCategory = category;
    selectedSubcategory = sub;
    document.getElementById("selectedCategory").textContent = sub;
    document.getElementById("startButton").classList.remove("hidden");
    closeCategoryModal();
}

function startLearning() {
    if (selectedSubcategory) {
        currentQuestions = data[selectedCategory][selectedSubcategory];
    } else {
        currentQuestions = [];
        for (let sub in data[selectedCategory]) {
            currentQuestions = currentQuestions.concat(data[selectedCategory][sub]);
        }
    }

    currentIndex = 0;

    document.getElementById("mainScreen").classList.add("hidden");
    document.getElementById("learningScreen").classList.remove("hidden");

    showCurrentQuestion();
}

function showCurrentQuestion() {
    const q = currentQuestions[currentIndex];
    document.getElementById("questionText").textContent = q.question;
    document.getElementById("answerText").textContent = q.answer;
    document.getElementById("answerText").classList.add("hidden");
    MathJax.typeset();
}

function showAnswer() {
    document.getElementById("answerText").classList.remove("hidden");
    MathJax.typeset();
}

function nextQuestion() {
    currentIndex++;
    if (currentIndex >= currentQuestions.length) {
        alert("Fertig!");
        location.reload();
    } else {
        showCurrentQuestion();
    }
}