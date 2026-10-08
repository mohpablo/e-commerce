import { Search } from "lucide-react";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupButton,
} from "../ui/input-group";

type Props = {
  className?: string;
};

export function SearchForm({ className }: Props) {
  return (
    <form action="/products" role="search" className={className}>
      <InputGroup className="h-10 rounded-full bg-muted/60">
        <InputGroupInput
          name="q"
          type="search"
          placeholder="Search products"
          aria-label="Search products"
        />
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            type="submit"
            variant="secondary"
            className="rounded-full"
          >
            Search
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </form>
  );
}
