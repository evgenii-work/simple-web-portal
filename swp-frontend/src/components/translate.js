import { useContext } from "react";
import AppContext from "../app-context";
import * as lang_ru from "../languages/ru.json";
import * as lang_en from "../languages/en.json";

let languages = { ru: lang_ru, en: lang_en };

export const translate = (language, text) => {
  // return the translated text or the original text
  if (Object.keys(languages).includes(language)) {
    return languages[language][text] || text;
  }

  return text;
};

const Translate = ({ children }) => {
  const { language } = useContext(AppContext);
  return translate(language, children);
};

export default Translate;
