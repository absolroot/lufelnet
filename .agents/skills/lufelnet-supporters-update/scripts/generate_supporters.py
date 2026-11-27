import argparse
import csv
import io
import re
import sys
import tempfile
from datetime import date
from decimal import Decimal
from pathlib import Path


ROOT = Path(__file__).resolve().parents[4]
PRIVATE_CSV = ROOT / "_private" / "supporters.csv"
PUBLIC_CSV = ROOT / "_data" / "supporters.csv"
FIELDS = (
    "name", "date", "amount", "currency", "source", "kind",
    "transaction_id", "public", "highlight",
)
# A fixed display rate keeps the ordering stable between updates.
KRW_PER_UNIT = {"USD": Decimal("1400"), "KRW": Decimal("1")}
HIGHLIGHTS = {"", "gold", "cream", "bronze"}


def read_supporters():
    totals = {}
    highlights = {}
    seen_transactions = set()
    with PRIVATE_CSV.open(encoding="utf-8", newline="") as source:
        reader = csv.DictReader(source, strict=True)
        if reader.fieldnames != list(FIELDS):
            raise ValueError("Unexpected private CSV header")
        for row in reader:
            line = reader.line_num
            if None in row or any(value is None for value in row.values()):
                raise ValueError(f"Wrong number of fields on line {line}")

            name = row["name"]
            if not name.strip() or name != name.strip() or any(ord(c) < 32 for c in name):
                raise ValueError(f"Invalid name on line {line}")
            payment_date = row["date"]
            if not re.fullmatch(r"\d{4}-\d{2}(?:-\d{2})?", payment_date):
                raise ValueError(f"Invalid date on line {line}")
            try:
                date.fromisoformat(payment_date if len(payment_date) == 10 else f"{payment_date}-01")
            except ValueError:
                raise ValueError(f"Invalid date on line {line}") from None
            if not re.fullmatch(r"[0-9]+(?:\.[0-9]{1,2})?", row["amount"]):
                raise ValueError(f"Invalid amount on line {line}")
            amount = Decimal(row["amount"])
            currency = row["currency"]
            if amount <= 0 or currency not in KRW_PER_UNIT:
                raise ValueError(f"Unsupported amount or currency on line {line}")
            if row["public"] not in {"yes", "no"} or row["highlight"] not in HIGHLIGHTS:
                raise ValueError(f"Invalid display setting on line {line}")

            transaction = row["source"], row["transaction_id"]
            if transaction[1]:
                if transaction in seen_transactions:
                    raise ValueError(f"Duplicate transaction on line {line}")
                seen_transactions.add(transaction)
            if row["public"] == "no":
                continue

            totals[name] = totals.get(name, Decimal(0)) + amount * KRW_PER_UNIT[currency]
            highlight = row["highlight"]
            if highlight:
                if name in highlights and highlights[name] != highlight:
                    raise ValueError(f"Conflicting supporter highlight on line {line}")
                highlights[name] = highlight

    return [(name, highlights.get(name, "")) for name in sorted(totals, key=totals.get, reverse=True)]


def main():
    parser = argparse.ArgumentParser(description="Generate the public About supporters CSV")
    parser.add_argument("--check", action="store_true", help="Verify the public CSV is current")
    args = parser.parse_args()
    try:
        supporters = read_supporters()
        with io.StringIO(newline="") as output:
            writer = csv.writer(output, lineterminator="\n")
            writer.writerow(("name", "highlight"))
            writer.writerows(supporters)
            public_data = output.getvalue().encode("utf-8")

        if args.check:
            if PUBLIC_CSV.read_bytes() != public_data:
                raise ValueError("Public CSV is out of date")
        else:
            with tempfile.NamedTemporaryFile(dir=PUBLIC_CSV.parent, delete=False) as output_file:
                temp_path = Path(output_file.name)
                try:
                    output_file.write(public_data)
                    output_file.close()
                    temp_path.replace(PUBLIC_CSV)
                finally:
                    temp_path.unlink(missing_ok=True)
    except (OSError, ValueError, csv.Error) as error:
        print(f"Supporters CSV: {error}", file=sys.stderr)
        return 1

    print(f"Public supporters: {len(supporters)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
