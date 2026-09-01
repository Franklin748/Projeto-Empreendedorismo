import React, { useState } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const [step, setStep] = useState('login');
  const [twoFactorCode, setTwoFactorCode] = useState(['', '', '', '', '', '']);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Por favor, preencha todos os campos.');
      return;
    }
    setStep('2fa');
  };

  const handle2FAChange = (element, index) => {
    if (isNaN(element.value)) return false;

    const newCode = [...twoFactorCode];
    newCode[index] = element.value;
    setTwoFactorCode(newCode);

    if (element.value !== '' && element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handle2FASubmit = (e) => {
    e.preventDefault();
    const fullCode = twoFactorCode.join('');
    
    if (fullCode.length < 6) {
      alert('Digite o código completo de 6 dígitos.');
      return;
    }

    const fakeJwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.sD5f8_token_exemplo';
    
    localStorage.setItem('token', fakeJwtToken);
    if (rememberMe) {
      localStorage.setItem('userEmail', email);
    }

    alert('Autenticação realizada com sucesso!');
  };

  // Função para resetar e voltar com segurança para o login
  const handleBackToLogin = (e) => {
    e.preventDefault();
    setTwoFactorCode(['', '', '', '', '', '']);
    setStep('login');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0F1C2C] p-8 md:p-16 font-sans">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 md:p-8 shadow-2xl">
        
        {/* Logo Principal */}
        <div className="mb-6 flex justify-center">
          <img 
            src="/logo-topo.png" 
            alt="Nix Core Logo" 
            className="w-full max-w-[320px] h-auto object-contain"
          />
        </div>

        {/* Caixa de Login Cinza */}
        <div className="flex flex-col md:flex-row items-center justify-between rounded-xl bg-[#D9D9D9] p-6 md:p-8 gap-6">
          
          <div className="w-full md:w-1/2">
            {step === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-3">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg bg-white p-2.5 text-sm text-gray-700 outline-none transition-all border-2 border-transparent focus:border-blue-400 focus:bg-[#f0f0f0]"
                  required
                />
                
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg bg-white p-2.5 text-sm text-gray-700 outline-none transition-all border-2 border-transparent focus:border-blue-400 focus:bg-[#f0f0f0]"
                  required
                />

                <div className="flex items-center gap-3 text-[10px] md:text-xs text-gray-600">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="accent-[#0F1C2C]"
                      checked={showPassword}
                      onChange={() => setShowPassword(!showPassword)}
                    />
                    Mostrar senha
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="accent-[#0F1C2C]"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    Manter login
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-[#0F1C2C] p-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 cursor-pointer"
                >
                  Entrar
                </button>

                <div className="pt-2 text-center text-[10px] md:text-xs">
                  <a href="#" className="block hover:underline">Criar conta</a>
                  <a href="#" className="block hover:underline">Não consegue fazer login?</a>
                </div>
              </form>
            ) : (
              <form onSubmit={handle2FASubmit} className="space-y-3">
                <div className="text-center md:text-left">
                  <h3 className="text-sm font-bold text-gray-800">Verificação em 2 Etapas (2FA)</h3>
                  <p className="text-[10px] text-gray-600">Digite o código de 6 dígitos enviado:</p>
                </div>

                <div className="flex justify-between gap-1">
                  {twoFactorCode.map((data, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      value={data}
                      onChange={(e) => handle2FAChange(e.target, index)}
                      onFocus={(e) => e.target.select()}
                      className="h-9 w-9 text-center rounded-lg bg-white text-xs font-bold text-gray-800 outline-none transition-all border-2 border-transparent focus:border-blue-400 focus:bg-[#f0f0f0]"
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-[#0F1C2C] p-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 cursor-pointer"
                >
                  Confirmar Código
                </button>

                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className="w-full text-center text-[11px] text-gray-700 font-medium hover:underline cursor-pointer pt-1 block"
                >
                  ← Voltar para o Login
                </button>
              </form>
            )}
          </div>

          {/* Lado Direito: Logo de Login */}
          <div className="hidden md:flex w-full md:w-1/2 justify-center items-center p-2">
            <img 
             src="/logo-login.png" 
             alt="Login Icon" 
            className="w-full max-w-[220px] h-auto object-contain transition-all"/>
         </div>
        </div>
      </div>
    </div>
  );
};

export default Login;