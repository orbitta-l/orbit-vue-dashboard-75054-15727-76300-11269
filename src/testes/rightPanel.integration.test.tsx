import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import RightPanel from "@/components/login/RightPanel";
import { vi, describe, beforeEach, it, expect } from "vitest";

// ======= Mocks =======

// Mock de useAuth
const mockLogin = vi.fn();
const mockUseAuth = vi.fn();

vi.mock("@/context/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));

// Mock de useToast
const mockToast = vi.fn();
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

// Mock de useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom"
  );
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// ======= Helper para submeter formulário =======
const submitForm = (container: HTMLElement, email: string, password: string) => {
  const emailInput = screen.getByLabelText(/E-mail ou usuário/i) as HTMLInputElement;
  const passwordInput = screen.getByLabelText(/Senha/i) as HTMLInputElement;
  
  // Preenche os campos
  fireEvent.change(emailInput, { target: { value: email } });
  fireEvent.change(passwordInput, { target: { value: password } });
  
  // Pega o formulário e dispara o submit diretamente
  const form = container.querySelector('form');
  if (form) {
    fireEvent.submit(form);
  }
};

// ======= Testes =======

describe("Integração: RightPanel + AuthContext + Navegação", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({
      login: mockLogin,
      profile: null,
    });
  });

  it("realiza login e redireciona para /dashboard-lider quando perfil é LÍDER", async () => {
    mockLogin.mockResolvedValueOnce({ success: true });
    mockUseAuth.mockReturnValue({
      login: mockLogin,
      profile: { role: "LIDER" },
    });

    const { container } = render(
      <MemoryRouter>
        <RightPanel />
      </MemoryRouter>
    );

    submitForm(container, "lider@empresa.com", "123456");

    await waitFor(
      () => {
        expect(mockLogin).toHaveBeenCalledWith("lider@empresa.com", "123456");
      },
      { timeout: 3000 }
    );

    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Login realizado com sucesso!",
      })
    );
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard-lider", {
      replace: true,
    });
  });

  it("realiza login e redireciona para /dashboard-liderado quando perfil é LIDERADO", async () => {
    mockLogin.mockResolvedValueOnce({ success: true });
    mockUseAuth.mockReturnValue({
      login: mockLogin,
      profile: { role: "LIDERADO" },
    });

    const { container } = render(
      <MemoryRouter>
        <RightPanel />
      </MemoryRouter>
    );

    submitForm(container, "liderado@empresa.com", "123456");

    await waitFor(
      () => {
        expect(mockLogin).toHaveBeenCalledWith("liderado@empresa.com", "123456");
      },
      { timeout: 3000 }
    );

    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Login realizado com sucesso!",
      })
    );
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard-liderado", {
      replace: true,
    });
  });

  it("mostra erro quando login falha", async () => {
    mockLogin.mockResolvedValueOnce({ success: false });
    mockUseAuth.mockReturnValue({
      login: mockLogin,
      profile: null,
    });

    const { container } = render(
      <MemoryRouter>
        <RightPanel />
      </MemoryRouter>
    );

    submitForm(container, "usuario@errado.com", "senhaerrada");

    await waitFor(
      () => {
        expect(mockLogin).toHaveBeenCalledWith(
          "usuario@errado.com",
          "senhaerrada"
        );
      },
      { timeout: 3000 }
    );

    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Erro ao fazer login",
      })
    );
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});