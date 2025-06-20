import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import AddressForm from "../AddressForm";

const originalFetch = global.fetch;

describe("Production API Key Failures", () => {
  afterEach(() => {
    global.fetch = originalFetch;
    delete process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;
  });

  const fillForm = () => {
    render(<AddressForm />);
    fireEvent.change(screen.getByPlaceholderText("Postcode"), {
      target: { value: "SW1A 1AA" },
    });
    fireEvent.change(screen.getByPlaceholderText("Street"), {
      target: { value: "Test Street" },
    });
    fireEvent.change(screen.getByPlaceholderText("City"), {
      target: { value: "London" },
    });
    fireEvent.change(screen.getByPlaceholderText("House Number"), {
      target: { value: "1" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
  };

  test("PRODUCTION: forgot to set NEXT_PUBLIC_GEOAPIFY_API_KEY env var", async () => {
    delete process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    fillForm();
    await waitFor(() => {
      expect(
        screen.getByText(
          "Error verifying address due to server downtime. Please try again later."
        )
      ).toBeInTheDocument();
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      "API key in AddressForm.tsx not configured!"
    );
    consoleSpy.mockRestore();
  });
});
