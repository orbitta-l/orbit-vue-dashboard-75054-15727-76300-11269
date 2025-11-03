import { useState } from "react";

export default function Loginto() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [msg, setMsg] = useState("");

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:3230/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha })
      });

      if (!res.ok) {
        const text = await res.text();
        setMsg(text);
        return;
      }

      const data = await res.json();
      setMsg(`Bem-vindo, ${data.nome}!`);
    } catch (err) {
      setMsg("Erro de conexão com a API");
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
      <input placeholder="Senha" type="password" value={senha} onChange={e => setSenha(e.target.value)} />
      <button onClick={handleLogin}>Entrar</button>
      <p>{msg}</p>
    </div>
  );
}