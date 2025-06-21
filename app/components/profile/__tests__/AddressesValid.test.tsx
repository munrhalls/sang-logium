import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import AddressForm from "../AddressForm";
import { correctAddresses } from "../__mocks__/AddressForm.mocks";

describe("Valid Addresses (Real API)", () => {
  beforeAll(() => {
    if (!process.env.CONFIRM_API_TESTS) {
      throw new Error("Set CONFIRM_API_TESTS=true to run real API tests");
    }
  });

  const fillAndSubmitForm = async (address: any) => {
    render(<AddressForm />);

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

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(
      () => {
        const message = screen.queryByText(/verified|not found|error/i);
        expect(message).toBeInTheDocument();
      },
      { timeout: 15000 }
    );
  };

  test("validates known good address (47 Battersea Rise, London)", async () => {
    const validAddress = correctAddresses[0]; // 47 Battersea Rise, SW11 2RJ, London

    await fillAndSubmitForm(validAddress);

    expect(
      screen.getByText("Address verified successfully!")
    ).toBeInTheDocument();
  });
});
