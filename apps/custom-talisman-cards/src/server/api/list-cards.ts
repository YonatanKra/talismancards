import { defineEventHandler } from "h3";
import { getListOfCards } from "./list-user-details";
import { getCard } from "./get-card";

export default defineEventHandler(async (event) => {
  const data = await getListOfCards()

  const listOfCards =  data.map(file => file.Key.split('/').pop());
  return Promise.all(listOfCards.map(async (fileName) => {
    const svg = (await getCard(fileName));
    const title = svg.match(/<title[^>]*>([\s\S]*?)<\/title>/)[1];    
    return {
      fileName,
      title
    }
  }));
});