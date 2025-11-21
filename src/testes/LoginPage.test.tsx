import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import RightPanel from "../pages/Login";

// Cria mocks das dependências no topo
const mockLogin = vi.fn();
const mockToast = vi.fn();
const mockNavigate = vi.fn();

vi.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    login: mockLogin,
    profile: null,
  }),
}));

vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom"
  );
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("RightPanel (Login)", () => {
  it("renderiza o formulário de login", () => {
    render(
      <MemoryRouter>
        <RightPanel />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Senha/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Entrar/i })).toBeInTheDocument();
  });

  it("chama login com email e senha corretos", async () => {
    mockLogin.mockResolvedValueOnce({ success: true });

    render(
      <MemoryRouter>
        <RightPanel />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "user@test.com" },
    });
    fireEvent.change(screen.getByLabelText(/Senha/i), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Entrar/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("user@test.com", "123456");
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Login realizado com sucesso!",
        })
      );
    });
  });

  it("mostra erro quando login falha", async () => {
    mockLogin.mockResolvedValueOnce({ success: false });

    render(
      <MemoryRouter>
        <RightPanel />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "fail@test.com" },
    });
    fireEvent.change(screen.getByLabelText(/Senha/i), {
      target: { value: "wrong" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Entrar/i }));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Erro ao fazer login",
        })
      );
    });
  });
});