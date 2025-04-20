import numeral from "numeral";
import { formatDistanceToNowStrict } from 'date-fns'

export const formatNumber = (number) => {
  if(number < 1000) return number;
  return numeral(number).format("0.0a").toUpperCase();
}

export const formatDate = (date) => {
  return formatDistanceToNowStrict(new Date(date), {
    addSuffix: true,
    roundingMethod: "floor",
  }).replace(/^about\s/, '')
}

export const formatId = (id) => (/^[0-9a-fA-F]{24}$/.test(id))