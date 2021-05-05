var regexP = /[а-яА-ЯәіңғүұққөӘІҢҒҮҰҚӨҺ]+/;

replaceText(document.body);

async function replaceText(element) {
  if (element.hasChildNodes()) {
    element.childNodes.forEach(replaceText);
  } else if (element.nodeType === Text.TEXT_NODE) {
    if (element.textContent.trim() !== "") {
      let words = splitContent(element.textContent);
      const newElement = document.createElement("span");

      for (let i = 0; i < words.length; i++) {
        let wordCheck = words[i]?.match(regexP)?.[0];

        if (!wordCheck) {
          words[i] = (i ? " " : "") + words[i];
          continue;
        }

        let wordRes = await checkWord(wordCheck);

        if (wordRes.length === 0) {
          words[i] = (i ? " " : "") + words[i];
          continue;
        }

        if (wordRes[0].split(", ")[1] !== "0") {
          const wordElement = document.createElement("span");
          wordElement.textContent = words[i];
          wordElement.className = "wrongSpell";

          wordElement.onclick = (e) => {
            openForm(wordRes, wordElement);
          };

          words[i] = wordElement;
        } else {
          words[i] = (i ? " " : "") + words[i];
        }
      }

      let contentElement = document.createElement("span");
      for (let i = 0; i < words.length; i++) {
        if (typeof words[i] === "string") {
          contentElement.textContent += words[i];
        } else {
          if (contentElement.textContent !== "") {
            contentElement.textContent += " ";
            newElement.appendChild(contentElement);
            contentElement = document.createElement("span");
            contentElement.textContent = " ";
          }

          if (i > 0) {
            if (typeof words[i - 1] !== "string") {
              contentElement.textContent += " ";
              newElement.appendChild(contentElement);
              contentElement = document.createElement("span");
            }
          }
          newElement.appendChild(words[i]);
        }
      }
      if (contentElement.textContent !== "") {
        newElement.appendChild(contentElement);
      }
      element.replaceWith(newElement);
    }
  }
}

function openForm(wordRes, wordElement) {
  const containerElement = document.createElement("div");
  containerElement.className = "form-opened";
  const btnElement = document.createElement("button");
  btnElement.textContent = "X";
  btnElement.onclick = (e) => {
    e.stopPropagation();
    containerElement.className = "form-closed";
  };
  containerElement.appendChild(btnElement);
  const selectElement = document.createElement("select");
  selectElement.selectedIndex = -1;
  selectElement.innerHTML =
    "<option value='' disabled selected style='display:none;'></option>";
  for (res of wordRes) {
    const optionElement = document.createElement("option");
    option = res.split(", ")[0];
    optionElement.setAttribute("value", option);
    optionElement.textContent = option;
    selectElement.appendChild(optionElement);
  }
  selectElement.onchange = (e) => {
    e.stopPropagation();
    wordElement.removeChild(containerElement);
    fixSpell(e.target.value, wordElement);
  };
  selectElement.onclick = (e) => {
    e.stopPropagation();
  };
  containerElement.appendChild(selectElement);
  wordElement.appendChild(containerElement);
}

function fixSpell(word, wordElement) {
  const newElement = document.createElement("span");
  newElement.textContent = wordElement.textContent.replace(regexP, word);
  wordElement.replaceWith(newElement);
}

function splitContent(content) {
  return content.split(/\s/);
}

function checkWord(word) {
  return fetch("http://localhost:5000/lookup", {
    method: "POST",
    body: JSON.stringify({
      word: word,
    }),
  })
    .then((res) => res.json())
    .then((res) => res.result);
}
