export default async function symbolicate(stack, sourceMapUrl = null) {

    if (!sourceMapUrl) {
    sourceMapUrl = inferSourceMapUrlFromStack(stack);
    console.log('Inferred source map URL:', sourceMapUrl);
    if (!sourceMapUrl) {
      console.warn('Could not infer source map URL from stack trace');
      return stack;
    }
  }

  const res = await fetch(sourceMapUrl);
  const rawSourceMap = await res.json();
  const consumer = await new SourceMap.SourceMapConsumer(rawSourceMap);

  const lines = stack.split('\n').map(line => {
    const match = line.match(/:(\d+):(\d+)\)?$/);
    if (!match) return line;

    const [_, lineNum, colNum] = match;
    const pos = consumer.originalPositionFor({
      line: Number(lineNum),
      column: Number(colNum),
    });

    if (!pos.source) return line;

    return `${pos.name || '(anonymous)'} (${pos.source}:${pos.line}:${pos.column})`;
  });

  consumer.destroy();
  return lines.join('\n');
}


function inferSourceMapUrlFromStack(stack) {

console.log('Inferring source map URL from stack:', stack);

  const match = stack.match(/https?:\/\/[^)\s]+\/([^\s:]+\.js)(:\d+){1,2}/);
  if (!match) return null;

  const scriptPath = match[0].split(':')[0]; // Remove line:col
  console.log('Matched script path:', scriptPath);
  return scriptPath + '.map';
}