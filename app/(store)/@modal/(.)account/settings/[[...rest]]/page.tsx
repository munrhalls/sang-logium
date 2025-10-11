import { UserButton } from "@clerk/nextjs";
import { DotIcon } from "lucide-react";

export default function Header() {
  return (
    <div className="flex justify-end p-4">
      <UserButton>
        <UserButton.MenuItems>
          <UserButton.Action
            label="Open chat"
            labelIcon={<DotIcon />}
            onClick={() => alert("init chat")}
          />
        </UserButton.MenuItems>
      </UserButton>
    </div>
  );
}
