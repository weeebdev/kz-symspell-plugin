replaceText(document.body);

async function replaceText(element) {
  if (element.hasChildNodes()) {
    element.childNodes.forEach(replaceText);
  } else if (element.nodeType === Text.TEXT_NODE) {
    if (element.textContent.trim() !== "") {
      let words = splitContent(element.textContent);
      const newElement = document.createElement("span");

      for (let word of words) {
        let wordRes = await checkWord(word);
        const wordElement = document.createElement("span");
        wordElement.textContent = word + " ";

        if (wordRes.length !== 0) {
          if (wordRes[0].split(", ")[1] !== "0") {
            wordElement.className = "wrongSpell";

            wordElement.onclick = (e) => {
              openForm(wordRes, wordElement);
            };
          }
        }

        newElement.appendChild(wordElement);
      }

      element.replaceWith(newElement);
    }
  }
}

function openForm(wordRes, wordElement) {
  const selectElement = document.createElement("select");
  selectElement.className = "form-opened";
  for (res of wordRes) {
    const optionElement = document.createElement("option");
    optionElement.setAttribute("value", res.split(", ")[0]);
    optionElement.textContent = res;
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
  newElement.textContent = word;
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
