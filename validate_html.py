from html.parser import HTMLParser
import sys

class ValidatingParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.stack = []
        self.errors = []

    VOID_ELEMENTS = {
        'area', 'base', 'br', 'col', 'embed', 'hr', 'img',
        'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'
    }

    def handle_starttag(self, tag, attrs):
        if tag not in self.VOID_ELEMENTS:
            self.stack.append((tag, self.getpos()))

    def handle_endtag(self, tag):
        if not self.stack:
            self.errors.append(f"Unexpected closing tag </{tag}> at line {self.getpos()[0]}")
            return
        open_tag, pos = self.stack.pop()
        if open_tag != tag:
            self.errors.append(
                f"Mismatched tag: opened <{open_tag}> at line {pos[0]} but closed </{tag}> at line {self.getpos()[0]}"
            )

    def close(self):
        super().close()
        while self.stack:
            tag, pos = self.stack.pop()
            self.errors.append(f"Unclosed tag <{tag}> opened at line {pos[0]}")


def validate(filename: str) -> int:
    parser = ValidatingParser()
    try:
        with open(filename, 'r') as f:
            parser.feed(f.read())
        parser.close()
    except FileNotFoundError:
        print(f"{filename} not found.")
        return 1
    if parser.errors:
        print("Parse errors:")
        for err in parser.errors:
            print(" -", err)
        return 1
    else:
        print("No parse errors found.")
        return 0

if __name__ == "__main__":
    sys.exit(validate("index.html"))
