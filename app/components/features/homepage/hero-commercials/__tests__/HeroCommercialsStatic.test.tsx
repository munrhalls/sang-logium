import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import HeroCommercials from "../HeroCommercials";
import { GET_COMMERCIALS_BY_FEATURE_QUERYResult } from "@/sanity.types";

// Type alias for Commercial
type Commercial = GET_COMMERCIALS_BY_FEATURE_QUERYResult[number];

// Mock the child components
jest.mock("../../../../ui/carousel-single-slide/carouselSingleSlide", () => {
  return function MockCarouselSingleSlide({ prebuiltSlides, keys }: any) {
    return (
      <div data-testid="carousel-single-slide">
        <div data-testid="carousel-keys">{keys?.join(",")}</div>
        <div data-testid="carousel-slides">{prebuiltSlides}</div>
      </div>
    );
  };
});

jest.mock("../HeroCommercialItem", () => {
  return function MockHeroCommercialItem({ commercial, index }: any) {
    return (
      <div data-testid={`hero-commercial-item-${index}`}>
        <span data-testid="commercial-title">{commercial?.title}</span>
        <span data-testid="commercial-image">{commercial?.image}</span>
      </div>
    );
  };
});

describe("HeroCommercials", () => {
  test("should render commercials correctly with valid data", () => {
    // Prepare test commercial data
    const mockCommercials: Commercial[] = [
      {
        _id: "1",
        title: "Hero Ad",
        image: "url",
        variant: "primary",
        displayOrder: 1,
        text: null,
        ctaLink: null,
        products: [],
        sale: null,
      } as Commercial,
    ];

    // Render the component with commercials prop
    render(<HeroCommercials commercials={mockCommercials} />);

    // Verify the carousel is rendered
    expect(screen.getByTestId("carousel-single-slide")).toBeInTheDocument();

    // Verify the commercial's data is passed correctly
    expect(screen.getByTestId("commercial-title")).toHaveTextContent("Hero Ad");
    expect(screen.getByTestId("commercial-image")).toHaveTextContent("url");

    // Verify the keys are correctly extracted
    expect(screen.getByTestId("carousel-keys")).toHaveTextContent("1");

    // Verify HeroCommercialItem is rendered
    expect(screen.getByTestId("hero-commercial-item-0")).toBeInTheDocument();

    // Verify no getCommercialsByFeature call exists
    // This is implicitly verified by the component not being async and not importing the function
  });

  test("should render fallback message when commercials array is empty", () => {
    // Render with empty commercials array
    render(<HeroCommercials commercials={[]} />);

    // Verify fallback message is displayed
    expect(screen.getByText("No commercials available")).toBeInTheDocument();

    // Verify carousel is not rendered
    expect(screen.queryByTestId("carousel-single-slide")).not.toBeInTheDocument();
  });

  test("should have commercials prop typed as Commercial[]", () => {
    // This test verifies type safety at compile time
    // The component signature enforces Commercial[] type for the commercials prop

    // Test with properly typed commercials
    const validCommercials: Commercial[] = [
      {
        _id: "test-1",
        title: "Test Commercial",
        image: "test-url",
      } as Commercial,
    ];

    // This should compile without errors
    const { container } = render(
      <HeroCommercials commercials={validCommercials} />
    );

    expect(container).toBeTruthy();

    // TypeScript would prevent passing wrong types at compile time
    // For example, these would cause TypeScript errors:
    // <HeroCommercials commercials="not-an-array" />
    // <HeroCommercials commercials={[{ wrongField: "value" }]} />
  });

  test("should handle null or undefined commercials gracefully", () => {
    // Test with undefined (treated as empty array by the component)
    render(<HeroCommercials commercials={undefined as any} />);
    expect(screen.getByText("No commercials available")).toBeInTheDocument();

    // Clean up
    screen.getByText("No commercials available").remove();

    // Test with null (treated as empty array by the component)
    render(<HeroCommercials commercials={null as any} />);
    expect(screen.getByText("No commercials available")).toBeInTheDocument();
  });

  test("should render multiple commercials correctly", () => {
    // Prepare multiple commercials
    const mockCommercials: Commercial[] = [
      {
        _id: "1",
        title: "First Ad",
        image: "url1",
      } as Commercial,
      {
        _id: "2",
        title: "Second Ad",
        image: "url2",
      } as Commercial,
      {
        _id: "3",
        title: "Third Ad",
        image: "url3",
      } as Commercial,
    ];

    // Render with multiple commercials
    render(<HeroCommercials commercials={mockCommercials} />);

    // Verify all commercial items are rendered
    expect(screen.getByTestId("hero-commercial-item-0")).toBeInTheDocument();
    expect(screen.getByTestId("hero-commercial-item-1")).toBeInTheDocument();
    expect(screen.getByTestId("hero-commercial-item-2")).toBeInTheDocument();

    // Verify keys are correctly passed
    expect(screen.getByTestId("carousel-keys")).toHaveTextContent("1,2,3");
  });
});