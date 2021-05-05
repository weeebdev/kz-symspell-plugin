var regexP = /[а-яА-ЯәіңғүұққөӘІҢҒҮҰҚӨҺ]+/;

replaceText(document.body);

async function replaceText(element) {
  if (element.hasChildNodes()) {
    element.childNodes.forEach(replaceText);
  } else if (element.nodeType === Text.TEXT_NODE) {
    if (element.textContent.trim() !== "") {
      let words = splitContent(element.textContent);
      const newElement = document.createElement("span");

      let content = "";

      for (let i = 0; i < words.length; i++) {
        let wordCheck = words[i]?.match(regexP)?.[0];

        if (!wordCheck) {
          content += (i ? " " : "") + words[i];
          continue;
        }

        let wordRes = await checkWord(wordCheck);

        if (wordRes.length === 0) {
          content += (i ? " " : "") + words[i];
          continue;
        }

        if (wordRes[0].split(", ")[1] !== "0") {
          const contentElement = document.createElement("span");
          contentElement.textContent = content;
          content = "";
          newElement.appendChild(contentElement);

          const wordElement = document.createElement("span");
          wordElement.textContent = (i ? " " : "") + words[i];
          wordElement.className = "wrongSpell";

          wordElement.onclick = (e) => {
            openForm(wordRes, wordElement);
          };

          newElement.appendChild(wordElement);
        } else {
          content += (i ? " " : "") + words[i];
        }
      }

      element.replaceWith(newElement);
    }
  }
}

function openForm(wordRes, wordElement) {
  const selectElement = document.createElement("select");
  selectElement.className = "form-opened";
  wordRes = [`${wordElement.textContent}, `, ...wordRes];
  for (res of wordRes) {
    const optionElement = document.createElement("option");
    option = res.split(", ")[0];
    optionElement.setAttribute("value", option);
    optionElement.textContent = option;
    selectElement.appendChild(optionElement);
  }
  selectElement.onchange = (e) => {
    e.stopPropagation();
    wordElement.removeChild(selectElement);
    fixSpell(e.target.value, wordElement);
  };
  selectElement.onclick = (e) => {
    e.stopPropagation();
  };
  wordElement.appendChild(selectElement);
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
