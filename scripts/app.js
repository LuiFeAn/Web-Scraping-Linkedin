const path = require("path");
const puppeteer = require("puppeteer");
const readline =  require("readline");

const put = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})
const Reload = ()=>{
    put.question("Qual vaga deseja pesquisar? \n > " ,(input)=>{
        Start(encodeURI(input));
    })
}
Reload();
const Start = async (resp) => {
    const Browser = await puppeteer.launch({
        headless: true,
    });

    const Page = await Browser.newPage();
    await Page.goto(`https://br.linkedin.com/jobs/search?keywords=${resp}&location=Brasil&geoId=106057199&trk=public_jobs_jobs-search-bar_search-submit&position=1&pageNum=0`);

    const search = await Page.evaluate(()=>{
       const txt = document.querySelectorAll(".base-card__full-link .screen-reader-text");
       const alert = document.querySelector(".core-section-container__main-title")
       const props = [...txt]; 
       
       if(!alert)
       {
        return props.map(({innerText})=>innerText);
       }
       else
       {
           return "Não encontramos nada"
       }
       
    })
    await Page.screenshot({
        path:`${resp}.jpg`,
        fullPage: true,
    });
    console.log("Obtive os seguintes resultados:");
    console.log(search);
    Reload();
}