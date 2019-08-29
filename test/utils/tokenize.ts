// adapted from https://github.com/dotnet/csharp-tmLanguage/blob/master/test/utils/tokenize.ts

import { StackElement, Registry } from 'vscode-textmate';

export interface Token {
  text: string;
  type: string;
}

function createToken(text: string, type: string) {
  return { text, type };
}

export namespace Token {
  export namespace Comment {
    export namespace SingleLine {
      export const Start = createToken('--', 'punctuation.definition.comment.unison')
      export const Text = (text: string) => createToken(text, 'comment.line.double-dash.unison')
    }
  }
}

interface Span {
  startLine: number;
  startIndex: number;
  endLine: number;
  endIndex: number;
}

export class Input {
  private constructor(
    public lines: string[],
    public span: Span
  ) {}

  public static FromText(text: string) {
    text = text.replace('\r\n', '\n');
    let lines = text.split('\n');
    return new Input(lines, {
      startLine: 0,
      startIndex: 0,
      endLine: lines.length - 1,
      endIndex: lines[lines.length - 1].length
    })
  }
}

const registry = new Registry();
const grammar = registry.loadGrammarFromPathSync('grammars/unison.tmLanguage');

export function tokenize(input: string | Input): Token[] {
  if (typeof(input) === "string") {
    input = Input.FromText(input)
  }

  console.log(input);

  let tokens: Token[] = []
  let previousStack: StackElement = null;

  for (let lineIndex = 0; lineIndex < input.lines.length; lineIndex++) {
    const line = input.lines[lineIndex];

    let lineResult = grammar.tokenizeLine(line, previousStack);
    previousStack = lineResult.ruleStack

    if (lineIndex < input.span.startLine || lineIndex > input.span.endLine) {
      continue;
    }

    for (const token of lineResult.tokens) {
      if ((lineIndex === input.span.startLine && token.startIndex < input.span.startIndex) ||
        (lineIndex === input.span.endLine && token.endIndex > input.span.endIndex)) {
          continue;
        }

      const text = line.substring(token.startIndex, token.endIndex);
      const type = token.scopes[token.scopes.length - 1];

      tokens.push(createToken(text, type));
    }
  }
  return tokens;
}