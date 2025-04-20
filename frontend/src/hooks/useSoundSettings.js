import { atom } from "recoil";

const soundSettings = atom({
  key: "soundOnOff",
  default: true
});

export default soundSettings