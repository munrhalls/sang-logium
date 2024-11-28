// components/__tests__/Header.test.tsx
import { render, screen } from "@testing-library/react";
import Header from "../Header";
import "@testing-library/jest-dom";
import { useUser } from "@clerk/nextjs";

jest.mock("@clerk/nextjs", () => ({
  useUser: jest.fn(),
  ClerkLoaded: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  UserButton: () => <div>UserButton</div>,
  SignInButton: () => <div>SignInButton</div>,
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => <img {...props} alt={props.alt || "image"} />,
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

describe("Header", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows loading spinner when not loaded", () => {
    (useUser as jest.Mock).mockReturnValue({
      isLoaded: false,
      user: null,
      isSignedIn: false,
    });

    render(<Header />);

    const spinner = screen.getByTestId("loading-spinner");
    expect(spinner).toBeInTheDocument();
  });

  it("shows content when loaded", () => {
    (useUser as jest.Mock).mockReturnValue({
      isLoaded: true,
      user: null,
      isSignedIn: false,
    });

    render(<Header />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });
});
