import { defineEventHandler, getQuery } from 'h3';

export default defineEventHandler((event) => {
  const q = getQuery(event);

  return {
    message: `Hello Visitor!`,
  };
});
