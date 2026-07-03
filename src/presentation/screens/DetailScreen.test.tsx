import { describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { Pokemon } from "../../domain/entities/Pokemon";
import { useDetailViewModel } from "../hooks/useDetailViewModel";
import { DetailScreen } from "./DetailScreen";

const mockGoBack = jest.fn();
jest.mock("@react-navigation/native", () => ({
  useRoute: () => ({
    params: { pokemonId: 1 },
  }),
  useNavigation: () => ({
    goBack: mockGoBack,
  }),
}));

jest.mock("../hooks/useDetailViewModel");
const mockedUseDetailViewModel = useDetailViewModel as jest.MockedFunction<
  typeof useDetailViewModel
>;

const mockRefetch = jest.fn(() =>
  Promise.resolve(),
) as unknown as () => Promise<void>;

describe("<DetailScreen />", () => {
  const mockPokemonData = {
    id: 1,
    name: "bulbasaur",
    imageUrl: "https://fake.url/bulbasaur.png",
    height: 7,
    weight: 69,
    baseExperience: 64,
    types: ["grass", "poison"],
    abilities: ["overgrow", "chlorophyll"],
    stats: [
      { name: "hp", value: 45 },
      { name: "attack", value: 49 },
    ],
  } as unknown as Pokemon;

  it("should render the ActivityIndicator and loading state when isLoading is true", () => {
    mockedUseDetailViewModel.mockReturnValue({
      pokemon: null,
      isLoading: true,
      error: null,
      refetch: mockRefetch,
    });

    render(<DetailScreen />);

    expect(screen.getByText(/Loading details.../i)).toBeTruthy();
  });

  it("should render the error state and handle the retry callback interaction", () => {
    mockedUseDetailViewModel.mockReturnValue({
      pokemon: null,
      isLoading: false,
      error: "Could not fetch details",
      refetch: mockRefetch,
    });

    render(<DetailScreen />);

    expect(screen.getByText(/Could not fetch details/i)).toBeTruthy();

    const retryButton = screen.getByText("Retry");
    fireEvent.press(retryButton);
    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  it("should render full stats, types, and respond to the back button press", () => {
    mockedUseDetailViewModel.mockReturnValue({
      pokemon: mockPokemonData,
      isLoading: false,
      error: null,
      refetch: mockRefetch,
    });

    render(<DetailScreen />);

    expect(screen.getByText(/GRASS/i)).toBeTruthy();
    expect(screen.getByText(/BULBASAUR/i)).toBeTruthy();

    expect(screen.getByText("0.7 m")).toBeTruthy();
    expect(screen.getByText("6.9 kg")).toBeTruthy();

    expect(screen.getByText(/POISON/i)).toBeTruthy();
    expect(screen.getByText("Overgrow")).toBeTruthy();

    const backButton = screen.getByLabelText(/Return to the Pokémon list/i);
    fireEvent.press(backButton);
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });
});
