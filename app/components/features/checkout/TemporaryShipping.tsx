import { useState } from "react";

// basic client validation
// at first, empty fields DO NOT trigger error messages
// once user types in a field, the field is basic validated
// if the field is left empty or fails basic length validation, it's marked as error until user types something that makes it valid
// form submission is disabled until all basic validation passes

export default function Shipping() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    streetNumber: 0,
    street: "",
    city: "",
    state: "",
    postalCode: "",
    regionCode: "PL",
  });

  const handleShipping = () => {
    setIsModalOpen(true);
  };

  const handleAddressValidation = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("/api/shipping", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await response.json();
    console.log(data, " --- ADDRESS VALIDATION RESPONSE");
    // if (data.verdict && data.verdict.possibleNextAction === "FIX") {
    //   setError(
    //     "This address cannot be found. Please make sure the address is correct and try again."
    //   );
    // }
  };

  // HoC - takes Input and enhances it with functionality:
  // if the input has not been touched, no validation
  // once touched, basic validation against Input's prop validation rules
  // Input - this component takes validation props and just returns input
  // const ValidatedInput = withValidation(Input)

  const withValidation = (InputComponent: React.FC<Node>) => {
    return function Validated({ value, ...props }) {
      const [touched, setTouched] = useState(false);
      const [value, setValue] = useState("");

      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        if (!touched) setTouched(true);
      };

      let errorMessage = "";
      if (touched) {
        if (props.required && value.trim() === "") {
          errorMessage = "This field is required.";
        } else if (props.minLength && value.length < props.minLength) {
          errorMessage = `Minimum length is ${props.minLength} characters.`;
        } else if (props.maxLength && value.length > props.maxLength) {
          errorMessage = `Maximum length is ${props.maxLength} characters.`;
        }
      }

      return (
        <div>
          <InputComponent {...props} value={value} onChange={handleChange} />
          {errorMessage && (
            <div className="text-sm text-red-500">{errorMessage}</div>
          )}
        </div>
      );
    };
  };

  return (
    <>
      <div>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="rounded bg-white p-4">
              <form>
                <h2 className="mb-4 text-lg font-bold">
                  Enter Shipping Address
                </h2>
                <p className="text-sm font-black tracking-wide">Country</p>
                <select
                  onChange={(e) =>
                    setForm({ ...form, regionCode: e.target.value })
                  }
                  className="mb-4 w-full border border-gray-300 p-2"
                >
                  <option value="PL">Poland</option>
                  <option value="EN">England</option>
                </select>
                <p className="text-sm font-black tracking-wide">Postal code</p>
                <input
                  onChange={(e) =>
                    setForm({ ...form, postalCode: e.target.value })
                  }
                  type="text"
                  placeholder="Postal Code"
                  className="mb-2 w-full border border-gray-300 p-2"
                />
                <div className="grid grid-cols-8 gap-2">
                  <div className="col-span-6">
                    <p className="text-sm font-black tracking-wide">Street</p>
                    <input
                      onChange={(e) =>
                        setForm({ ...form, street: e.target.value })
                      }
                      type="text"
                      placeholder="Street"
                      className="mb-2 w-full border border-gray-300 p-2"
                    />
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm font-black tracking-wide">Number</p>
                    <input
                      onChange={(e) =>
                        setForm({
                          ...form,
                          streetNumber: parseInt(e.target.value),
                        })
                      }
                      type="number"
                      placeholder="..."
                      className="mb-2 flex w-full items-center justify-center border border-gray-300 p-2"
                    />
                  </div>
                </div>
                <p className="text-sm font-black tracking-wide">City</p>
                <input
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  type="text"
                  placeholder="City"
                  className="mb-2 w-full border border-gray-300 p-2"
                />
                <button
                  onClick={handleAddressValidation}
                  type="submit"
                  className="w-full rounded bg-black px-4 py-2 text-white"
                >
                  Submit Address
                </button>
              </form>

              <button
                onClick={() => setIsModalOpen(false)}
                className="mt-4 rounded bg-black px-4 py-2 text-white"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={handleShipping}
        className="flex w-full items-center justify-center rounded-sm bg-black py-4 text-lg font-medium text-white transition-colors hover:bg-gray-800"
      >
        Shipping
      </button>
    </>
  );
}
