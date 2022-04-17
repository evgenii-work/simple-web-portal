import { getNextItem } from "../utils";

class AppService {
  constructor() {
    this.languages = ["ru", "en"];
  }

  getLanguage() {
    let lang = localStorage.getItem("language");
    if (lang === null) {
      return "ru";
    }
    return lang;
  }

  saveLanguage(lang) {
    localStorage.setItem("language", lang);
  }

  getNextLanguage() {
    let lang = this.getLanguage();
    return getNextItem(this.languages, lang);
  }
}

export default new AppService();
