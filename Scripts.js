const gif = "https://64.media.tumblr.com/tumblr_m971zpBbAF1rbgzizo1_640.gif";
const url = "https://catfact.ninja/";
const repoUrl = "https://api.github.com/users/Noyyu/repos";
LoadCV();
SecretArea();
SecretText();
FetchFact();
FetchRepos(repoUrl);

async function SecretArea() {
  //SECRET AREA
  const easterEggElement = document.getElementById("secret-area");
  const navbutton = document.getElementById("minimize");

  easterEggElement.addEventListener("click", () => {
    navbutton.style.backgroundImage = "url('" + gif + "')";
    navbutton.style.backgroundSize = "cover";
    navbutton.style.backgroundPosition = "center";
  });
}
async function SecretText() {
  //SECRET TEXT
  let input = "";
  const secretWord = "rickroll";
  const gifModal = document.getElementById("secret-gif-modal");
  const gifmodalimage = document.getElementById("modal-gif-image");

  document.addEventListener("keydown", (event) => {
    input += event.key.toLocaleLowerCase(); //Lägger till bokstäverna som användaren skriver i vår input.
    input = input.slice(-secretWord.length); //Sparar bara längden av ordet i bokstäver i variabeln.

    if (input === secretWord) //Poppar upp fönstret om kombinationen är rätt
    {
      gifmodalimage.src = gif;
      gifModal.style.display = "flex";
    }
    if (
      input !== secretWord
    ) //Tar bort fönstret om man trycker på något annat på tangentbordet
    {
      gifModal.style.display = "none";
    }
  });
}
async function LoadCV() {
  // en funktion som väntar medans filen laddas
  const response = await fetch("CVData.json"); //Hämtar filen. Den blir en hög med text.
  const data = await response.json(); //Datan görs om till en json filtyp så att java fattar hur man använder den.

  const experienceList = document.getElementById("experience-list"); //Hämtar hela min HTML-sida och letar efter ID:t
  const educationList = document.getElementById("education-list");
  const skillsList = document.getElementById("skills-list");

  // ERFARENHETER
  if (experienceList) //Kollar så att den finns
  {
    data.erfarenheter.forEach((jobb) => {
      // Hämtar datan objektet med namnet "erfarenheter" i json och cyklar igenom den (I detta fallet 3 gånger)
      const li = document.createElement("li"); //Skapar en <li></li>
      //Skriver in texten med en thicc font. InnerHTML låter mig se och ändra i min HTML fil
      li.innerHTML = `
        <strong>${jobb.roll}</strong> - <em class = date >${jobb.period} </em>
        <br>
        <em>${jobb.företag}</em>
        <p>${jobb.beskrivning}</p>
        `;
      experienceList.appendChild(li); // Lägger den färdiga listan (<li></li>) i <ul> elementet "experience-list"
    });
  }

  // UTBILDNING
  if (educationList) {
    data.utbildning.forEach((skola) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${skola.skola}</strong> - <em class = date> ${skola.period} </em>
        <br>
        <p>${skola.examen}</p>
        `;
      educationList.appendChild(li);
    });
  }

  // SKILLS
  if (skillsList) {
    data.skills.forEach((skill) => {
      const li = document.createElement("li");
      li.innerHTML = ` <p> ${skill.namn}</p>`;
      skillsList.appendChild(li);
    });
  }
}
async function FetchFact() {
  const response = await fetch(`${url}fact`);

  if (!response.ok) {
    console.log("Helvete");
    return;
  }
  const data = await response.json();
  console.log(data);
}
async function FetchFacts(maxLegnth, limit) {
  const response = await fetch(
    `${url}facts?max_legnth=${maxLegnth}$limit=${limit}`,
  );

  if (!response.ok) {
    console.log("Helvete");
    return;
  }

  const data = await response.json();
  console.log(data.data);
}
async function WritePortfolio(repos) {
  const portfolioContent = document.getElementById("Portfolio-items");
  //SKRIV UT
  if (!portfolioContent) {
    //Om vi inte är inne på fortfolio sidan
    return;
  }
  portfolioContent.innerHTML = "";
  repos.forEach((repo) => {
    const descriptionText =
      repo.description || "No description for this project";
    const modalId = `modal-${repo.id}`;
    const repoCard = document.createElement("div");
    repoCard.className = "repo-card";

    repoCard.innerHTML = `
        <h4><strong>/* ${repo.name} */</strong></h4>
        
        <p><a href="#${modalId}" class="open-btn">Read More</a></p>

        <div id="${modalId}" class="modal">
            <div class="modal-content">
                <a href="#" class="close-btn">&times;</a>
                <h4>${repo.name}</h4>
                <p>
                ${descriptionText} 
                Publiched: ${repo.created_at}
                Last update: ${repo.updated_at}
                <a href="${repo.html_url}" >View on GitHub</a>
                </p>
                
            </div>
        </div>
    `;
    portfolioContent.appendChild(repoCard);
  });
}
async function FetchRepos(url) {
  document.body.classList.add("is-loading");
  //HÄMTA
  try {
    const response = await fetch(url); //"Klickar" på url:en
    if (!response.ok) {
      //Kollar så att skiten funkar
      throw new error(`Helvete: ${response.status}`);
      return; //Annars struntar vi i resten av koden
    }
    const data = await response.json();
    console.log(data.length, " repos were found"); //Skriver ut antalet repos som hittades
    document.body.classList.remove("is-loading");
    WritePortfolio(data);
  } catch (error) {
    //Om nätet eller url:en gick fel
    console.error("Helvete:", error);
    
  } 

}

