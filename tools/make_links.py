#!/usr/bin/env python3
"""
make_links.py — Generate personalized wedding invitation links.

Every invitee gets a unique URL carrying their name. When they open it,
the invitation greets them by name and pre-fills the RSVP form.

Usage
-----
  # names as arguments
  python3 tools/make_links.py --base https://your-site.netlify.app "សុខ រតនា" "Sokha Vandy"

  # names from a file (one per line, blank lines ignored)
  python3 tools/make_links.py --base https://your-site.netlify.app --file guests.txt

  # pretty URLs  https://your-site.com/to/Name  (needs a rewrite rule — see README)
  python3 tools/make_links.py --base https://your-site.netlify.app --file guests.txt --pretty

  # also print ready-to-send WhatsApp share links (very handy for group chats)
  python3 tools/make_links.py --base https://your-site.netlify.app --file guests.txt --whatsapp

  # change the parameter name (default: to)
  python3 tools/make_links.py --base https://your-site.com --file guests.txt --param guest

Output
------
  Name  →  https://your-site.com/?to=%E1%9E%9F%E1%9E%BB%E1%9E%81%20%E1%9E%9A%E1%9E%93%E1%9E%B6
"""
import argparse
import sys
from urllib.parse import quote


def build_link(base: str, param: str, name: str, pretty: bool) -> str:
    base = base.rstrip("/")
    encoded = quote(name, safe="")
    if pretty:
        return f"{base}/to/{encoded}"
    return f"{base}/?{param}={encoded}"


def whatsapp_link(name: str, invitation_link: str) -> str:
    message = (
        f"សូមគោរពអញ្ជើញ {name} ចូលរួមជាអធិបតីក្នុងពិធីមង្គលការរបស់យើងខ្ញុំ 🌸\n"
        f"សូមចុចមើលលិខិតអញ្ជើញ៖ {invitation_link}"
    )
    return "https://wa.me/?text=" + quote(message, safe="")


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate personalized invitation links.")
    parser.add_argument("--base", required=True, help="Your published site URL, e.g. https://your-site.netlify.app")
    parser.add_argument("--file", help="Text file with one guest name per line")
    parser.add_argument("--param", default="to", help="Query parameter name (default: to)")
    parser.add_argument("--pretty", action="store_true", help="Emit /to/Name links instead of ?to=Name")
    parser.add_argument("--whatsapp", action="store_true", help="Also print WhatsApp share links")
    parser.add_argument("--csv", action="store_true", help="Output CSV: name,link")
    parser.add_argument("names", nargs="*", help="Guest names (alternative to --file)")
    args = parser.parse_args()

    names = list(args.names)
    if args.file:
        try:
            with open(args.file, encoding="utf-8") as fh:
                names += [line.strip() for line in fh if line.strip()]
        except OSError as exc:
            print(f"Cannot read {args.file}: {exc}", file=sys.stderr)
            return 1

    if not names:
        parser.error("No guest names given. Pass names as arguments or use --file guests.txt")

    for name in names:
        link = build_link(args.base, args.param, name, args.pretty)
        if args.csv:
            print(f'"{name}",{link}')
            continue
        print(f"{name}")
        print(f"  {link}")
        if args.whatsapp:
            print(f"  WhatsApp: {whatsapp_link(name, link)}")
        print()

    print(f"— {len(names)} link(s) generated.", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
