import { should } from 'chai';
import { tokenize, Token } from './utils/tokenize';

describe("Grammar", () => {
  before(() => { should(); });

  describe("Strings", () => {
    it("simple", () => {
      const input = `"hello"`;
      const tokens = tokenize(input)

      tokens.should.deep.equal([
        Token.Text.Start,
        Token.Text.String("hello"),
        Token.Text.End
      ]);
    });

    it("escaped", () => {
      const input = `"hello \\"world\\""`;
      const tokens = tokenize(input)

      tokens.should.deep.equal([
        Token.Text.Start,
        Token.Text.String("hello "),
        Token.Text.CharacterEscape,
        Token.Text.String("world"),
        Token.Text.CharacterEscape,
        Token.Text.End
      ]);
    });
  });
});
