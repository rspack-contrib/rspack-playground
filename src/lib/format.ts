export async function format(code: string): Promise<string> {
  const prettier = await import("prettier");
  // @ts-expect-error
  const parserBabel = (await import("prettier/esm/parser-babel.mjs")).default;
  const pluginEstree = (await import("prettier/plugins/estree")).default;
  return prettier.format(code, {
    parser: "babel",
    plugins: [parserBabel, pluginEstree],
  });
}
