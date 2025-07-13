
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const mascoteImg = '/kai-register.png';

const Auth = () => {
  const navigate = useNavigate();
  const { signUp, signIn } = useAuth();

  // Controle de abas
  const [tab, setTab] = useState<'login' | 'register'>('register');
  // Etapa do cadastro: 1 = dados básicos, 2 = dados complementares
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Login
  const [login, setLogin] = useState({
    email: '',
    password: '',
  });

  // Cadastro - Etapa 1
  const [basic, setBasic] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  // Cadastro - Etapa 2
  const [profile, setProfile] = useState({
    height: '',
    weight: '',
    age: '',
    gender: '',
    experience: '',
    goal: '',
  });

  // Handlers
  const handleLoginChange = (field: string, value: string) => {
    setLogin((prev) => ({ ...prev, [field]: value }));
  };
  const handleBasicChange = (field: string, value: string) => {
    setBasic((prev) => ({ ...prev, [field]: value }));
  };
  const handleProfileChange = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  // Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(login.email, login.password);
    setLoading(false);
    if (error) {
      alert('Erro ao entrar: ' + error.message);
      return;
    }
    navigate('/');
  };

  // Cadastro - Etapa 1
  const handleBasicSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (basic.password !== basic.confirmPassword) {
      alert('Erro no cadastro. As senhas não coincidem.');
      return;
    }
    setLoading(true);
    
    try {
      const { error } = await signUp(basic.email, basic.password, basic.name);
      
      if (error) {
        // Se for erro de usuário já existente
        if (error.message.includes('already registered') || error.message.includes('User already registered')) {
          alert('Este e-mail já está cadastrado. Tente fazer login ou use outro e-mail.');
        } else {
          alert('Erro ao criar conta: ' + error.message);
        }
        setLoading(false);
        return;
      }

      // Usuario criado com sucesso - sempre pedir para confirmar email
      alert('Cadastro realizado! Por favor, confirme seu e-mail antes de continuar. Após a confirmação, faça login normalmente.');
      setTab('login');
      
    } catch (err) {
      console.error('Erro no cadastro:', err);
      alert('Erro inesperado ao criar conta. Tente novamente.');
    }
    
    setLoading(false);
  };

  // Cadastro - Etapa 2
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      alert('Usuário não encontrado.');
      return;
    }
    setLoading(true);
    // Atualizar tabela profiles
    const { error } = await supabase.from('profiles').update({
      full_name: basic.name,
      age: profile.age ? Number(profile.age) : null,
      height: profile.height ? Number(profile.height) : null,
      weight: profile.weight ? Number(profile.weight) : null,
      gender: profile.gender,
      experience: profile.experience,
      goal: profile.goal,
    }).eq('id', userId);
    setLoading(false);
    if (error) {
      alert('Erro ao salvar dados do perfil: ' + error.message);
      return;
    }
    navigate('/');
  };

  // Resetar etapas ao trocar de aba
  const handleTabChange = (value: string) => {
    setTab(value as 'login' | 'register');
    setStep(1);
    setLoading(false);
    setUserId(null);
    setBasic({ name: '', email: '', password: '', confirmPassword: '' });
    setProfile({ height: '', weight: '', age: '', gender: '', experience: '', goal: '' });
    setLogin({ email: '', password: '' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-400 p-4">
      <div className="flex flex-col md:flex-row items-center gap-12 w-full max-w-5xl bg-gray-700 rounded-2xl shadow-2xl p-8 relative">
        {/* Mascote + Balão */}
        <div className="flex flex-col items-center relative w-full md:w-1/2">
          {/* Balão de fala */}
          <div className="absolute -top-20 right-0 md:-top-16 md:right-[-40px] bg-white text-gray-900 rounded-2xl shadow-lg px-6 py-4 text-lg font-medium max-w-xs border border-gray-200 z-20 before:content-[''] before:absolute before:bottom-[-18px] before:left-16 before:w-0 before:h-0 before:border-t-[18px] before:border-t-white before:border-x-[18px] before:border-x-transparent before:border-solid">
            {tab === 'login'
              ? 'Bem-vindo de volta! Faça login para acessar sua conta.'
              : step === 1
                ? 'Vamos começar! Preencha seus dados básicos para criar sua conta.'
                : 'Agora, conte um pouco mais sobre você para personalizarmos sua experiência.'}
          </div>
          <img src={mascoteImg} alt="Mascote Guepardo" className="w-96 h-auto drop-shadow-xl z-10" />
        </div>
        {/* Tabs de Login/Cadastro */}
        <div className="w-full md:w-1/2">
          <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-800/50 backdrop-blur-sm border border-gray-700">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="register">Criar Conta</TabsTrigger>
            </TabsList>
            {/* Login */}
            <TabsContent value="login">
              <form onSubmit={handleLoginSubmit} className="bg-gray-800 rounded-xl p-8 flex flex-col gap-6 shadow-lg">
                <div className="flex flex-col gap-4">
                  <div>
                    <Label htmlFor="login-email" className="text-gray-100">E-mail</Label>
                    <Input id="login-email" type="email" placeholder="seu@email.com" value={login.email} onChange={e => handleLoginChange('email', e.target.value)} className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400" required />
                  </div>
                  <div>
                    <Label htmlFor="login-password" className="text-gray-100">Senha</Label>
                    <Input id="login-password" type="password" placeholder="Sua senha" value={login.password} onChange={e => handleLoginChange('password', e.target.value)} className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400" required />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg text-lg mt-2" disabled={loading}>
                  {loading ? 'Entrando...' : 'Entrar'}
                </Button>
                <Button type="button" variant="outline" className="w-full mt-2" onClick={() => setTab('register')}>Criar nova conta</Button>
              </form>
            </TabsContent>
            {/* Cadastro em duas etapas */}
            <TabsContent value="register">
              {step === 1 ? (
                <form onSubmit={handleBasicSubmit} className="bg-gray-800 rounded-xl p-8 flex flex-col gap-6 shadow-lg">
                  <div className="flex flex-col gap-4">
                    <div>
                      <Label htmlFor="name" className="text-gray-100">Nome</Label>
                      <Input id="name" type="text" placeholder="Seu nome" value={basic.name} onChange={e => handleBasicChange('name', e.target.value)} className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400" required />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-gray-100">E-mail</Label>
                      <Input id="email" type="email" placeholder="seu@email.com" value={basic.email} onChange={e => handleBasicChange('email', e.target.value)} className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400" required />
                    </div>
                    <div>
                      <Label htmlFor="password" className="text-gray-100">Senha</Label>
                      <Input id="password" type="password" placeholder="Sua senha" value={basic.password} onChange={e => handleBasicChange('password', e.target.value)} className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400" required minLength={6} />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword" className="text-gray-100">Confirmar senha</Label>
                      <Input id="confirmPassword" type="password" placeholder="Confirme sua senha" value={basic.confirmPassword} onChange={e => handleBasicChange('confirmPassword', e.target.value)} className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400" required minLength={6} />
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg text-lg mt-2" disabled={loading}>
                    {loading ? 'Criando conta...' : 'Continuar'}
                  </Button>
                  <Button type="button" variant="outline" className="w-full mt-2" onClick={() => setTab('login')}>Já possuo conta</Button>
                </form>
              ) : (
                <form onSubmit={handleProfileSubmit} className="bg-gray-800 rounded-xl p-8 flex flex-col gap-6 shadow-lg">
                  <div className="flex flex-col gap-4">
                    <div>
                      <Label htmlFor="height" className="text-gray-100">Altura (cm)</Label>
                      <Input id="height" type="number" placeholder="Ex: 175" value={profile.height} onChange={e => handleProfileChange('height', e.target.value)} className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400" required />
                    </div>
                    <div>
                      <Label htmlFor="weight" className="text-gray-100">Peso (kg)</Label>
                      <Input id="weight" type="number" placeholder="Ex: 70" value={profile.weight} onChange={e => handleProfileChange('weight', e.target.value)} className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400" required />
                    </div>
                    <div>
                      <Label htmlFor="age" className="text-gray-100">Idade</Label>
                      <Input id="age" type="number" placeholder="Ex: 30" value={profile.age} onChange={e => handleProfileChange('age', e.target.value)} className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400" required />
                    </div>
                    <div>
                      <Label htmlFor="gender" className="text-gray-100">Gênero</Label>
                      <Select value={profile.gender} onValueChange={value => handleProfileChange('gender', value)}>
                        <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-300 text-gray-900">
                          <SelectItem value="male">Masculino</SelectItem>
                          <SelectItem value="female">Feminino</SelectItem>
                          <SelectItem value="other">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="experience" className="text-gray-100">Nível de experiência</Label>
                      <Select value={profile.experience} onValueChange={value => handleProfileChange('experience', value)}>
                        <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-300 text-gray-900">
                          <SelectItem value="beginner">Iniciante</SelectItem>
                          <SelectItem value="intermediate">Intermediário</SelectItem>
                          <SelectItem value="advanced">Avançado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="goal" className="text-gray-100">Objetivo</Label>
                      <Select value={profile.goal} onValueChange={value => handleProfileChange('goal', value)}>
                        <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-300 text-gray-900">
                          <SelectItem value="weight-loss">Perder peso</SelectItem>
                          <SelectItem value="endurance">Melhorar resistência</SelectItem>
                          <SelectItem value="speed">Aumentar velocidade</SelectItem>
                          <SelectItem value="general">Saúde geral</SelectItem>
                          <SelectItem value="competition">Competição</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg text-lg mt-2" disabled={loading}>
                    {loading ? 'Salvando...' : 'Finalizar cadastro'}
                  </Button>
                </form>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Auth;
