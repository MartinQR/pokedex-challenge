import { describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { Pokemon } from "../../domain/entities/Pokemon";
import { useHomeViewModel } from "../hooks/useHomeViewModel";
import { HomeScreen } from "./HomeScreen";

const mockNavigate = jest.fn();
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: mockNavigate as unknown as (
      scene: string,
      params?: Record<string, unknown>,
    ) => void,
  }),
}));

jest.mock("../hooks/useHomeViewModel");
const mockedUseHomeViewModel = useHomeViewModel as jest.MockedFunction<
  typeof useHomeViewModel
>;

const mockAsyncFunction = jest.fn(() =>
  Promise.resolve(),
) as unknown as () => Promise<void>;

describe("<HomeScreen />", () => {
  const mockPokemons = [
    {
      id: 1,
      name: "bulbasaur",
      imageUrl: "https://fake.url/1.png",
      types: ["grass"],
    },
    {
      id: 4,
      name: "charmander",
      imageUrl: "https://fake.url/4.png",
      types: ["fire"],
    },
  ] as unknown as Pokemon[];

  it("should render the ActivityIndicator and loading state when isLoading is true", () => {
    mockedUseHomeViewModel.mockReturnValue({
      pokemons: [],
      isLoading: true,
      error: null,
      refetch: mockAsyncFunction,
      isFetchingMore: false,
      fetchNextPage: mockAsyncFunction,
    });

    render(<HomeScreen />);

    expect(screen.getByText(/Loading Pokedex.../i)).toBeTruthy();
  });

  it("should render the error message and call refetch when retry button is pressed", () => {
    const mockRefetch = jest.fn(() =>
      Promise.resolve(),
    ) as unknown as () => Promise<void>;

    mockedUseHomeViewModel.mockReturnValue({
      pokemons: [],
      isLoading: false,
      error: "Network Error",
      refetch: mockRefetch,
      isFetchingMore: false,
      fetchNextPage: mockAsyncFunction,
    });

    render(<HomeScreen />);

    expect(screen.getByText(/Network Error/i)).toBeTruthy();

    const retryButton = screen.getByText("Retry");
    fireEvent.press(retryButton);
    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  it("should render the Pokemon grid and handle navigation click correctly", () => {
    mockedUseHomeViewModel.mockReturnValue({
      pokemons: mockPokemons,
      isLoading: false,
      error: null,
      refetch: mockAsyncFunction,
      isFetchingMore: false,
      fetchNextPage: mockAsyncFunction,
    });

    render(<HomeScreen />);

    expect(screen.getByText(/Pokedex Challenge/i)).toBeTruthy();

    expect(screen.getByText("Bulbasaur")).toBeTruthy();
    expect(screen.getByText("Charmander")).toBeTruthy();

    const pokemonCard = screen.getByLabelText(/Pokémon number 1, bulbasaur/i);
    fireEvent.press(pokemonCard);

    expect(mockNavigate).toHaveBeenCalledWith("Detail", { pokemonId: 1 });
  });
});
