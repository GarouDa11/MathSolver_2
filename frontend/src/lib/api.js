export const post = (url, body) => fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
export const solveCalculus = async (op, v) => {
  const res = await post('/api/calculus', { op, ...v });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.result;
};
