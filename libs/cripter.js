class Cripter {
    constructor(firstProp='') {
        this.firstProp = firstProp
    }
    encript = (strWord) => {
        strWord = strWord.trim();
        strWord = btoa(strWord);
        console.log(strWord)
        console.log(strWord.length);
        let strNWord = "";
        for(let i=strWord.length-1;i>0;i--){
            strNWord+=strWord[i];
            console.log()
        }
        strNWord = strNWord.replaceAll("=","")
        // console.log("asi quedo",strNWord);
        return strNWord;
    }
        
}

// let obj = new Cripter();
// let pass = obj.encript("Holahola12345");
// console.log(pass);
module.exports = Cripter;