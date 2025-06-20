import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import AddressForm from "../AddressForm";
import { completelyIncorrectAddresses } from "./AddressForm.mocks";

const TEST_COUNT = 1;

describe("Completely Wrong Addresses (Real API)", () => {
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
      { timeout: 10000 }
    );
  };

  completelyIncorrectAddresses
    .slice(0, TEST_COUNT)
    .forEach((address, index) => {
      test(`validates ${address.postcode} ${address.street} ${address.city} (completely wrong #${index + 1})`, async () => {
        await fillAndSubmitForm(address);
        expect(
          screen.getByText(
            "Address not found. Please check your details and try again."
          )
        ).toBeInTheDocument();
      });
    });
});
