export const loader = () => {
  const content = `
    User-agent: *
    Disallow:
    Sitemap: https://www.algobreath.com/sitemap.xml
  `;

  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
      "encoding": "UTF-8"
    }
  });
};
