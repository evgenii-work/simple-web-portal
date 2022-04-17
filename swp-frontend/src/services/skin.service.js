import { SunIcon } from "@chakra-ui/icons";
import { MoonIcon } from "@chakra-ui/icons";
import { StarIcon } from "@chakra-ui/icons";

import { getNextItem } from "../utils";

class SkinService {
  constructor() {
    this.skins = [];
    this.skins["1"] = {
      id: "1",
      colorScheme: "blue",
      icon: <SunIcon />,
      colors: {
        background: {
          100: "#7EBDC2",
          200: "#FDFFFC",
          300: "#7CA5B8",
          400: "#FFFFFF",
          500: "#38369A",
        },
        border: {
          100: "#020887",
        },
        text: {
          100: "#FFFFFF",
          200: "#38369A",
          300: "#000000",
        },
      },
    };
    this.skins["2"] = {
      id: "2",
      colorScheme: "teal",
      icon: <StarIcon />,
      colors: {
        background: {
          100: "#D7EBBA",
          200: "#EBD494",
          300: "#41683C",
          400: "#FFFFFF",
          500: "#FF8966",
        },
        border: {
          100: "#562C2C",
        },
        text: {
          100: "#FFFFFF",
          200: "#FF8966",
          300: "#000000",
        },
      },
    };
    this.skins["3"] = {
      id: "3",
      colorScheme: "pink",
      icon: <MoonIcon />,
      colors: {
        background: {
          100: "#C08497",
          200: "#F8F4E3",
          300: "#E5446D",
          400: "#FFFFFF",
          500: "#011627",
        },
        border: {
          100: "#706C61",
        },
        text: {
          100: "#FFFFFF",
          200: "#2B303A",
          300: "#000000",
        },
      },
    };
  }

  getSkin() {
    let skinId = localStorage.getItem("skin");
    if (skinId === null) {
      skinId = "1";
    }
    return this.skins[skinId];
  }

  saveSkin(skinId) {
    localStorage.setItem("skin", skinId);
  }

  getNextSkin() {
    let skin = this.getSkin();
    return getNextItem(this.skins, skin);
  }
}

export default new SkinService();
