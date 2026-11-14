// ==========================================
// LAS NOCHES — PASSWORD REIATSU ANALYZER
// ==========================================


// 1. Find HTML elements

const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

const strengthFill = document.querySelector(".strength-fill");
const strengthText = document.querySelector(".strength-text");

const recommendation = document.getElementById("recommendation");
const generatePassword = document.getElementById("generatePassword");
const suggestedPassword = document.getElementById("suggestedPassword");
const copyPassword = document.getElementById("copyPassword");
const copyStatus = document.getElementById("copyStatus");

const recommendationText = document.getElementById("recommendationText");
const recommendationHints = document.getElementById("recommendationHints");


// 2. Common password database

const commonPasswords = [
    "password",
    "password123",
    "password1",
    "123456",
    "12345678",
    "123456789",
    "qwerty",
    "qwerty123",
    "admin",
    "admin123",
    "welcome",
    "welcome123",
    "letmein",
    "iloveyou",
    "abc123",
    "monkey",
    "dragon",
    "football"
];


// 3. Secure random number generator

function randomIndex(max) {

    const limit = Math.floor(4294967296 / max) * max;

    const randomValues = new Uint32Array(1);

    do {
        crypto.getRandomValues(randomValues);
    } while (randomValues[0] >= limit);

    return randomValues[0] % max;
}


// 4. Generate a strong password

function createStrongPassword() {

    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()-_=+";

    const allCharacters =
        uppercase + lowercase + numbers + symbols;

    const passwordCharacters = [];

    // Guarantee different character types

    passwordCharacters.push(
        uppercase[randomIndex(uppercase.length)]
    );

    passwordCharacters.push(
        lowercase[randomIndex(lowercase.length)]
    );

    passwordCharacters.push(
        numbers[randomIndex(numbers.length)]
    );

    passwordCharacters.push(
        symbols[randomIndex(symbols.length)]
    );

    // Add 16 more random characters

    for (let i = 0; i < 16; i++) {

        passwordCharacters.push(
            allCharacters[randomIndex(allCharacters.length)]
        );

    }

    // Shuffle the password characters

    for (let i = passwordCharacters.length - 1; i > 0; i--) {

        const j = randomIndex(i + 1);

        [passwordCharacters[i], passwordCharacters[j]] =
            [passwordCharacters[j], passwordCharacters[i]];

    }

    return passwordCharacters.join("");
}


// 5. Reset the interface

function resetAnalyzer() {

    strengthText.textContent = "AWAITING REIATSU...";

    strengthFill.style.width = "0%";
    strengthFill.style.backgroundColor = "";

    recommendation.hidden = true;
    generatePassword.hidden = true;

    suggestedPassword.hidden = true;
    copyPassword.hidden = true;

    suggestedPassword.textContent = "";
    copyStatus.textContent = "";

    recommendationText.textContent = "";
    recommendationHints.textContent = "";

}


// 6. Analyze password changes

passwordInput.addEventListener("input", function () {

    const password = passwordInput.value;

    let score = 0;

    // Hide previous generated password

    suggestedPassword.hidden = true;
    copyPassword.hidden = true;
    copyStatus.textContent = "";

    // Handle empty input

    if (password.length === 0) {

        resetAnalyzer();
        return;

    }

    // Detect common passwords

    const normalizedPassword = password
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");

    const isCommonPassword =
        commonPasswords.includes(normalizedPassword);

    // Detect repeated characters

    const hasRepeatedCharacters =
        /(.)\1{2,}/.test(password);

    // Detect sequential numbers

    const hasSequentialNumbers =
        /0123|1234|2345|3456|4567|5678|6789|9876|8765|7654|6543|5432|4321/.test(password);

    // Detect sequential letters

    const hasSequentialLetters =
        /abcd|bcde|cdef|defg|efgh|fghi|ghij|hijk|ijkl|jklm|klmn|lmno|mnop|nopq|opqr|pqrs|qrst|rstu|stuv|tuvw|uvwx|vwxy|wxyz/i.test(password);

    // Detect common keyboard patterns

    const hasKeyboardPattern =
        /qwerty|asdf|zxcv|qazwsx/i.test(password);

    // Calculate password score

    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    // Detect weak or predictable passwords

    const isWeak =
        score <= 2 ||
        password.length < 8 ||
        isCommonPassword ||
        hasRepeatedCharacters ||
        hasSequentialNumbers ||
        hasSequentialLetters ||
        hasKeyboardPattern;

    const isModerate =
        !isWeak &&
        (score === 3 || (score === 4 && password.length < 12));

    // Display password strength

    if (isWeak) {

        strengthText.textContent = "WEAK";
        strengthFill.style.width = "25%";
        strengthFill.style.backgroundColor = "#ff4545";

    } else if (isModerate) {

        strengthText.textContent = "MODERATE";
        strengthFill.style.width = "50%";
        strengthFill.style.backgroundColor = "#e6b84c";

    } else if (score === 4) {

        strengthText.textContent = "STRONG";
        strengthFill.style.width = "75%";
        strengthFill.style.backgroundColor = "#63d68a";

    } else {

        strengthText.textContent = "VERY STRONG";
        strengthFill.style.width = "100%";
        strengthFill.style.backgroundColor = "#36ff9b";

    }

    // Display recommendations

    recommendation.hidden = !(isWeak || isModerate);

    if (isWeak) {

        recommendationText.textContent =
            "YOUR REIATSU IS TOO WEAK!";

        recommendationHints.textContent =
            "Try using a longer, unique password with a mix of character types.";

        generatePassword.hidden = false;

    } else if (isModerate) {

        recommendationText.textContent =
            "YOUR REIATSU NEEDS MORE POWER!";

        recommendationHints.textContent =
            "Try using at least 12 characters and adding more variety.";

        generatePassword.hidden = true;

    }

});


// 7. Generate a password

generatePassword.addEventListener("click", function () {

    const newPassword = createStrongPassword();

    suggestedPassword.textContent = newPassword;

    suggestedPassword.hidden = false;
    copyPassword.hidden = false;

    copyStatus.textContent = "";

});


// 8. Show / Hide password

togglePassword.addEventListener("click", function () {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";
        togglePassword.textContent = "HIDE";

    } else {

        passwordInput.type = "password";
        togglePassword.textContent = "SHOW";

    }

});


// 9. Copy generated password

copyPassword.addEventListener("click", async function () {

    const generatedPassword = suggestedPassword.textContent;

    if (!generatedPassword) {
        return;
    }

    try {

        await navigator.clipboard.writeText(generatedPassword);

        copyStatus.textContent = "PASSWORD COPIED!";
        copyStatus.style.color = "#36ff9b";

    } catch (error) {

        copyStatus.textContent = "COPY FAILED. TRY AGAIN.";
        copyStatus.style.color = "#ff4545";

    }

});