import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import AddressForm from "../AddressForm";

const fillForm = (address: unknown) => {
  fireEvent.change(screen.getByPlaceholderText("Postcode"), {
    target: { value: address.postcode },
  });
  fireEvent.change(screen.getByPlaceholderText("City"), {
    target: { value: address.city },
  });
  fireEvent.change(screen.getByPlaceholderText("Street"), {
    target: { value: address.street },
  });
  fireEvent.change(screen.getByPlaceholderText("House Number"), {
    target: { value: address.houseNumber },
  });
};

describe("Address Validation", () => {
  afterEach(() => {
    cleanup();
    jest.restoreAllMocks();
  });

  test("should verify a valid UK address", async () => {
    // Mock successful validation with all components confirmed
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          result: {
            address: {
              addressComponents: [
                {
                  confirmationLevel: "CONFIRMED",
                  componentType: "street_number",
                },
                { confirmationLevel: "CONFIRMED", componentType: "route" },
                {
                  confirmationLevel: "CONFIRMED",
                  componentType: "postal_town",
                },
                {
                  confirmationLevel: "CONFIRMED",
                  componentType: "postal_code",
                },
              ],
              postalCode: "SW1A 1AA",
            },
          },
        }),
    });

    render(<AddressForm />);
    fillForm({
      postcode: "SW1A 1AA",
      city: "London",
      street: "Buckingham Palace Road",
      houseNumber: "1",
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() =>
      expect(
        screen.getByText("Address verified successfully!"),
      ).toBeInTheDocument(),
    );
  });

  test("should reject a partially invalid address with component details", async () => {
    // Mock response with some unconfirmed components
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          result: {
            address: {
              addressComponents: [
                {
                  confirmationLevel: "CONFIRMED",
                  componentType: "postal_code",
                },
                { confirmationLevel: "PLAUSIBLE", componentType: "route" },
                {
                  confirmationLevel: "UNCONFIRMED",
                  componentType: "street_number",
                },
              ],
              postalCode: "SW1A 1AA",
            },
          },
        }),
    });

    render(<AddressForm />);
    fillForm({
      postcode: "SW1A 1AA",
      street: "Nonexistent Street",
      houseNumber: "999",
      city: "London",
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() =>
      expect(
        screen.getByText(/Address validation failed.*Unconfirmed components/i),
      ).toBeInTheDocument(),
    );
  });

  test("should reject a completely fake address", async () => {
    // Mock response with no valid components
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          result: {
            address: {
              addressComponents: [],
            },
          },
        }),
    });

    render(<AddressForm />);
    fillForm({
      postcode: "XX1 1XX",
      street: "Fake Street",
      houseNumber: "999",
      city: "Nowhere",
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() =>
      expect(
        screen.getByText(
          /Address validation failed.*No valid address components found/i,
        ),
      ).toBeInTheDocument(),
    );
  });

  test("should handle API errors gracefully", async () => {
    // Mock API error
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });

    render(<AddressForm />);
    fillForm({
      postcode: "SW1A 1AA",
      city: "London",
      street: "Buckingham Palace Road",
      houseNumber: "1",
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() =>
      expect(
        screen.getByText("Error verifying address. Please try again."),
      ).toBeInTheDocument(),
    );
  });
});
