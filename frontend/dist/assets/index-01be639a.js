var A=Object.defineProperty;var N=(i,o,t)=>o in i?A(i,o,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[o]=t;var y=(i,o,t)=>(N(i,typeof o!="symbol"?o+"":o,t),t);import{r as h,b as T,a as D}from"./vendor-92c95717.js";import{f as _,d as b,o as $}from"./ui-f6150dad.js";import{B as O,R as W,a as x,N as P}from"./router-8ffee5cc.js";(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const a of n)if(a.type==="childList")for(const l of a.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&s(l)}).observe(document,{childList:!0,subtree:!0});function t(n){const a={};return n.integrity&&(a.integrity=n.integrity),n.referrerPolicy&&(a.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?a.credentials="include":n.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(n){if(n.ep)return;n.ep=!0;const a=t(n);fetch(n.href,a)}})();var S={exports:{}},f={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var U=h,H=Symbol.for("react.element"),Y=Symbol.for("react.fragment"),L=Object.prototype.hasOwnProperty,K=U.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,M={key:!0,ref:!0,__self:!0,__source:!0};function C(i,o,t){var s,n={},a=null,l=null;t!==void 0&&(a=""+t),o.key!==void 0&&(a=""+o.key),o.ref!==void 0&&(l=o.ref);for(s in o)L.call(o,s)&&!M.hasOwnProperty(s)&&(n[s]=o[s]);if(i&&i.defaultProps)for(s in o=i.defaultProps,o)n[s]===void 0&&(n[s]=o[s]);return{$$typeof:H,type:i,key:a,ref:l,props:n,_owner:K.current}}f.Fragment=Y;f.jsx=C;f.jsxs=C;S.exports=f;var e=S.exports,E={},j=T;E.createRoot=j.createRoot,E.hydrateRoot=j.hydrateRoot;const d={primary:{50:"#EEF2FF",100:"#E0E7FF",200:"#C7D2FE",300:"#A5B4FC",400:"#4F9CF9",500:"#2563EB",600:"#1D4ED8",700:"#1E40AF",800:"#1E3A8A",900:"#1E40AF",950:"#0B1426"},brand:{darkBlue:"#0B1426",primaryBlue:"#2563EB",lightBlue:"#3B82F6",navyBlue:"#1E293B",slate:"#334155",accent:"#4F9CF9"},gray:{50:"#F8FAFC",100:"#F1F5F9",200:"#E2E8F0",300:"#CBD5E1",400:"#94A3B8",500:"#64748B",600:"#475569",700:"#334155",800:"#1E293B",900:"#0F172A",950:"#020617"},success:{50:"#ECFDF5",100:"#D1FAE5",500:"#10B981",600:"#059669",700:"#047857",900:"#064E3B"},warning:{50:"#FFFBEB",100:"#FEF3C7",500:"#F59E0B",600:"#D97706",700:"#B45309"},error:{50:"#FEF2F2",100:"#FEE2E2",500:"#EF4444",600:"#DC2626",700:"#B91C1C",900:"#7F1D1D"},gradients:{primary:"linear-gradient(135deg, #0B1426 0%, #1E293B 60%, #334155 100%)",hero:"linear-gradient(90deg, #0B1426 0%, #1E293B 70%, rgba(30, 41, 59, 0.8) 100%)",card:"linear-gradient(145deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)",button:"linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",accent:"linear-gradient(135deg, #4F9CF9 0%, #2563EB 100%)",overlay:"linear-gradient(90deg, rgba(11, 20, 38, 0.95) 0%, rgba(30, 41, 59, 0.7) 70%, transparent 100%)"}},m={fontFamily:{primary:'"Inter", "Helvetica Neue", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',display:'"Inter", "Helvetica Neue", sans-serif',mono:'"JetBrains Mono", "Fira Code", "Monaco", "Consolas", monospace'},fontSize:{xs:"0.75rem",sm:"0.875rem",base:"1rem",lg:"1.125rem",xl:"1.25rem","2xl":"1.5rem","3xl":"1.875rem","4xl":"2.25rem","5xl":"3rem"},fontWeight:{light:300,normal:400,medium:500,semibold:600,bold:700},lineHeight:{none:1,tight:1.25,normal:1.5,relaxed:1.75}},q={px:"1px",.5:"0.125rem",1:"0.25rem",1.5:"0.375rem",2:"0.5rem",2.5:"0.625rem",3:"0.75rem",3.5:"0.875rem",4:"1rem",5:"1.25rem",6:"1.5rem",7:"1.75rem",8:"2rem",9:"2.25rem",10:"2.5rem",12:"3rem",16:"4rem",20:"5rem",24:"6rem",32:"8rem"},J={none:"0",sm:"0.125rem",base:"0.25rem",md:"0.375rem",lg:"0.5rem",xl:"0.75rem","2xl":"1rem","3xl":"1.5rem",full:"9999px"},v={sm:"0 1px 2px 0 rgb(0 0 0 / 0.05)",base:"0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",md:"0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",lg:"0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",xl:"0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)","2xl":"0 25px 50px -12px rgb(0 0 0 / 0.25)",inner:"inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",card:"0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)",button:"0 4px 8px rgba(79, 70, 229, 0.3)",focus:"0 0 0 3px rgba(99, 102, 241, 0.4)"},V={sm:"640px",md:"768px",lg:"1024px",xl:"1280px","2xl":"1536px"},G={fast:"150ms cubic-bezier(0.4, 0, 0.2, 1)",normal:"200ms cubic-bezier(0.4, 0, 0.2, 1)",slow:"300ms cubic-bezier(0.4, 0, 0.2, 1)"},Q={hide:-1,auto:"auto",base:0,docked:10,dropdown:1e3,sticky:1100,banner:1200,overlay:1300,modal:1400,popover:1500,skipLink:1600,toast:1700,tooltip:1800},X={button:{height:{sm:"32px",md:"40px",lg:"48px"},padding:{sm:"8px 12px",md:"12px 24px",lg:"16px 32px"}},input:{height:{sm:"36px",md:"44px",lg:"52px"},padding:"12px 16px"},card:{padding:{sm:"16px",md:"24px",lg:"32px"}}},Z={colors:d,typography:m,spacing:q,borderRadius:J,shadows:v,breakpoints:V,transitions:G,zIndex:Q,components:X},ee=_`
  /* Reset e base styles */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    height: 100%;
    scroll-behavior: smooth;
  }

  body {
    height: 100%;
    font-family: ${m.fontFamily.primary};
    font-size: ${m.fontSize.base};
    font-weight: ${m.fontWeight.normal};
    line-height: ${m.lineHeight.normal};
    background: ${d.gradients.primary};
    color: ${d.gray[100]};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }

  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  /* Links */
  a {
    color: ${d.primary[400]};
    text-decoration: none;
    transition: color 200ms ease;

    &:hover {
      color: ${d.primary[300]};
    }

    &:focus {
      outline: 2px solid ${d.primary[500]};
      outline-offset: 2px;
      border-radius: 2px;
    }
  }

  /* Inputs */
  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
  }

  /* Buttons */
  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    background: none;
    
    &:focus {
      outline: 2px solid ${d.primary[500]};
      outline-offset: 2px;
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }

  /* Scrollbar personalizada (BTG Style) */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${d.gray[800]};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background: ${d.gray[600]};
    border-radius: 4px;
    
    &:hover {
      background: ${d.gray[500]};
    }
  }

  /* Selection */
  ::selection {
    background: ${d.primary[600]};
    color: white;
  }

  /* Focus styles */
  .focus-visible {
    outline: 2px solid ${d.primary[500]};
    outline-offset: 2px;
  }

  /* Utility classes */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }

  /* Animation utilities */
  .fade-in {
    animation: fadeIn 0.3s ease-in-out;
  }

  .slide-up {
    animation: slideUp 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  @keyframes fadeIn {
    from { 
      opacity: 0;
    }
    to { 
      opacity: 1;
    }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* BTG Loading animation */
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  .pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  /* Responsive font sizes */
  @media (max-width: 768px) {
    body {
      font-size: ${m.fontSize.sm};
    }
  }

  /* Print styles */
  @media print {
    * {
      background: white !important;
      color: black !important;
      box-shadow: none !important;
    }
  }

  /* High contrast mode */
  @media (prefers-contrast: high) {
    * {
      border-color: currentColor;
    }
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
`;b.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;

  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;b.div`
  background: ${d.gradients.card};
  border: 1px solid ${d.gray[700]};
  border-radius: 12px;
  padding: 24px;
  box-shadow: ${v.card};
  transition: all 200ms ease;

  &:hover {
    border-color: ${d.gray[600]};
    box-shadow: ${v.lg};
  }
`;b.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;b.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;b.div`
  display: grid;
  grid-template-columns: repeat(${i=>i.columns||1}, 1fr);
  gap: ${i=>i.gap||"20px"};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;const te=()=>e.jsx("header",{style:{background:"rgba(255, 255, 255, 0.1)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255, 255, 255, 0.1)",padding:"16px 32px",position:"absolute",top:0,left:0,right:0,zIndex:100},children:e.jsxs("div",{style:{maxWidth:"1200px",margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px"},children:[e.jsx("div",{style:{width:"36px",height:"36px",background:"linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)",borderRadius:"8px",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:"bold",color:"white",fontSize:"16px"},children:"F"}),e.jsx("div",{children:e.jsx("div",{style:{color:"white",fontSize:"20px",fontWeight:"700",fontFamily:'"Inter", sans-serif',lineHeight:"1"},children:"FIAP Fintech"})})]}),e.jsx("div",{style:{display:"flex",gap:"12px",alignItems:"center"},children:e.jsx("button",{onClick:()=>window.location.href="/login",style:{background:"rgba(255, 255, 255, 0.15)",color:"white",border:"1px solid rgba(255, 255, 255, 0.2)",padding:"10px 18px",borderRadius:"25px",fontSize:"14px",fontWeight:"500",cursor:"pointer",display:"flex",alignItems:"center",gap:"6px",backdropFilter:"blur(10px)",transition:"all 0.3s ease"},onMouseEnter:i=>{i.currentTarget.style.background="rgba(255, 255, 255, 0.25)"},onMouseLeave:i=>{i.currentTarget.style.background="rgba(255, 255, 255, 0.15)"},children:"→ Iniciar sessão"})})]})}),oe=()=>e.jsx("section",{style:{background:"linear-gradient(135deg, #1E40AF 0%, #3B82F6 50%, #60A5FA 100%)",minHeight:"100vh",display:"flex",alignItems:"center",padding:"80px 32px",position:"relative",overflow:"hidden"},children:e.jsxs("div",{style:{maxWidth:"1200px",margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"80px",alignItems:"center",width:"100%"},children:[e.jsxs("div",{children:[e.jsxs("h1",{style:{fontSize:"52px",fontWeight:"800",color:"white",lineHeight:"1.1",marginBottom:"24px",fontFamily:'"Inter", sans-serif',letterSpacing:"-0.025em"},children:["A melhor solução",e.jsx("br",{}),"para uma vida"," ",e.jsx("span",{style:{background:"linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"},children:"financeira saudável"})]}),e.jsx("p",{style:{fontSize:"20px",color:"rgba(255, 255, 255, 0.8)",lineHeight:"1.6",marginBottom:"40px",maxWidth:"500px"},children:"Reúna todas as suas despesas em um único aplicativo e simplifique suas finanças com o nosso gerenciador."}),e.jsx("p",{style:{color:"rgba(255, 255, 255, 0.6)",fontSize:"14px",lineHeight:"1.5",maxWidth:"500px"},children:"* Sistema sujeito a análise. Desenvolvido exclusivamente para fins educacionais da FIAP por estudantes, totalmente gratuito para estudantes."})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",height:"600px",position:"relative"},children:[e.jsx("div",{style:{width:"280px",height:"500px",background:"linear-gradient(145deg, #1f2937 0%, #111827 100%)",borderRadius:"40px",position:"relative",boxShadow:"0 20px 40px rgba(0, 0, 0, 0.25)",transform:"rotate(-8deg)",overflow:"hidden",border:"6px solid transparent",backgroundImage:"linear-gradient(145deg, #1f2937 0%, #111827 100%), linear-gradient(135deg, #FBBF24 0%, #F59E0B 50%, #EF4444 100%)",backgroundOrigin:"border-box",backgroundClip:"padding-box, border-box"},children:e.jsxs("div",{style:{padding:"24px 18px",height:"100%",display:"flex",flexDirection:"column"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"14px",color:"white"},children:[e.jsx("div",{style:{fontSize:"18px",fontWeight:"600"},children:"FIAP Fintech"}),e.jsx("div",{style:{background:"linear-gradient(135deg, #10B981 0%, #059669 100%)",color:"white",fontSize:"11px",padding:"4px 10px",borderRadius:"12px",fontWeight:"600",boxShadow:"0 2px 8px rgba(16, 185, 129, 0.3)"},children:"ONLINE"})]}),e.jsxs("div",{style:{background:"linear-gradient(135deg, #4F9CF9 0%, #3B82F6 100%)",borderRadius:"18px",padding:"18px",marginBottom:"14px",marginTop:"24px",color:"white",boxShadow:"0 6px 16px rgba(79, 156, 249, 0.25)"},children:[e.jsx("div",{style:{fontSize:"12px",opacity:.9,marginBottom:"4px"},children:"Saldo Total"}),e.jsx("div",{style:{fontSize:"22px",fontWeight:"600"},children:"R$ 12.847,50"})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px"},children:[e.jsxs("div",{style:{background:"linear-gradient(135deg, rgba(251, 191, 36, 0.25) 0%, rgba(245, 158, 11, 0.25) 100%)",borderRadius:"14px",padding:"14px",color:"#FCD34D",border:"1px solid rgba(251, 191, 36, 0.4)",boxShadow:"0 3px 10px rgba(251, 191, 36, 0.15)"},children:[e.jsx("div",{style:{fontSize:"10px",opacity:.9,marginBottom:"4px"},children:"Receitas"}),e.jsx("div",{style:{fontSize:"14px",fontWeight:"600"},children:"R$ 8.500"})]}),e.jsxs("div",{style:{background:"linear-gradient(135deg, rgba(239, 68, 68, 0.25) 0%, rgba(220, 38, 38, 0.25) 100%)",borderRadius:"14px",padding:"14px",color:"#F87171",border:"1px solid rgba(239, 68, 68, 0.4)",boxShadow:"0 3px 10px rgba(239, 68, 68, 0.15)"},children:[e.jsx("div",{style:{fontSize:"10px",opacity:.9,marginBottom:"4px"},children:"Gastos"}),e.jsx("div",{style:{fontSize:"14px",fontWeight:"600"},children:"R$ 3.200"})]})]})]})}),e.jsxs("div",{style:{position:"absolute",top:"92px",right:"65px",background:"rgba(255, 255, 255, 0.15)",backdropFilter:"blur(10px)",color:"white",padding:"8px 16px",borderRadius:"25px",fontSize:"13px",fontWeight:"500",display:"flex",alignItems:"center",gap:"6px",transition:"all 0.3s ease",zIndex:20,whiteSpace:"nowrap"},children:[e.jsx("span",{style:{fontSize:"14px"},children:"💰"}),e.jsx("span",{children:"+R$ 2.500 hoje"})]}),e.jsx("div",{style:{position:"absolute",bottom:"80px",left:"40px",background:"#10B981",color:"white",padding:"10px 18px",borderRadius:"24px",fontSize:"14px",fontWeight:"600",boxShadow:"0 8px 25px rgba(16, 185, 129, 0.4)",zIndex:10},children:"✓ Meta: 78%"})]})]})}),re=()=>e.jsxs("div",{style:{minHeight:"100vh",background:"#0B1426"},children:[e.jsx(te,{}),e.jsx(oe,{})]}),F="http://localhost:8080";class ne{constructor(){y(this,"CURRENT_USER_KEY","fiap_fintech_current_user");y(this,"TOKEN_KEY","fiap_fintech_token")}async cadastrar(o){try{const t=await fetch(`${F}/api/usuarios/registrar`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)});return t.ok?{success:!0,message:"Cadastro realizado com sucesso!",usuario:await t.json()}:{success:!1,message:(await t.json()).erro||"Erro ao realizar cadastro. Verifique os dados e tente novamente."}}catch(t){return console.error("Erro na API de cadastro:",t),{success:!1,message:"Erro de conexão. Verifique sua internet e tente novamente."}}}async login(o,t){try{const s=await fetch(`${F}/api/usuarios/auth`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:o,senha:t})});if(s.ok){const a=(await s.json()).usuario,l=this.generateToken(a);return this.setCurrentUser(a),localStorage.setItem(this.TOKEN_KEY,l),{success:!0,message:"Login realizado com sucesso!",usuario:a,token:l}}else return{success:!1,message:(await s.json()).erro||"E-mail ou senha incorretos!"}}catch(s){return console.error("Erro na API de login:",s),{success:!1,message:"Erro de conexão. Verifique sua internet e tente novamente."}}}logout(){localStorage.removeItem(this.CURRENT_USER_KEY),localStorage.removeItem(this.TOKEN_KEY)}isAuthenticated(){const o=this.getCurrentUser(),t=this.getToken();return!!(o&&t)}getCurrentUser(){try{const o=localStorage.getItem(this.CURRENT_USER_KEY);return o?JSON.parse(o):null}catch{return null}}getToken(){return localStorage.getItem(this.TOKEN_KEY)}setCurrentUser(o){localStorage.setItem(this.CURRENT_USER_KEY,JSON.stringify(o))}generateToken(o){const t={id:o.idUsuario,email:o.email,exp:Date.now()+864e5};return btoa(JSON.stringify(t))}getStats(){var o;return{usuarioAtual:((o=this.getCurrentUser())==null?void 0:o.nomeCompleto)||"Nenhum",isAuthenticated:this.isAuthenticated()}}clearAllData(){localStorage.removeItem(this.CURRENT_USER_KEY),localStorage.removeItem(this.TOKEN_KEY)}}const w=new ne,ie=()=>{const[i,o]=h.useState("login"),[t,s]=h.useState({email:"",senha:"",nomeCompleto:"",dataNascimento:"",genero:"MASCULINO"}),[n,a]=h.useState(!1),[l,B]=h.useState(!1),g=r=>{const{name:p,value:c}=r.target;s(I=>({...I,[p]:c}))},R=async r=>{var p;if(r.preventDefault(),!t.email||!t.senha){alert("❌ Por favor, preencha e-mail e senha!");return}a(!0);try{const c=await w.login(t.email,t.senha);a(!1),c.success?(alert(`✅ ${c.message}

👋 Bem-vindo de volta, ${(p=c.usuario)==null?void 0:p.nomeCompleto}!`),window.location.href="/dashboard"):alert(`❌ ${c.message}`)}catch(c){a(!1),alert("❌ Erro interno. Tente novamente."),console.error("Erro no login:",c)}},z=async r=>{if(r.preventDefault(),!t.nomeCompleto||!t.email||!t.dataNascimento||!t.senha){alert("❌ Por favor, preencha todos os campos!");return}a(!0);try{const p=await w.cadastrar({nomeCompleto:t.nomeCompleto,email:t.email,dataNascimento:t.dataNascimento,genero:t.genero,senha:t.senha});a(!1),p.success?(alert(`🎉 Cadastro realizado com sucesso!

👤 ${t.nomeCompleto}
📧 ${t.email}

✅ Conta criada no FIAP Fintech!
🔐 Agora faça o login para acessar`),o("login"),s({email:t.email,senha:"",nomeCompleto:"",dataNascimento:"",genero:"MASCULINO"})):alert(`❌ ${p.message}`)}catch(p){a(!1),alert("❌ Erro interno. Tente novamente."),console.error("Erro no cadastro:",p)}};return e.jsxs("div",{style:{minHeight:"100vh",display:"flex",fontFamily:'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',background:"#ffffff"},children:[e.jsxs("div",{style:{flex:"1",background:"#ffffff",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden",minHeight:"100vh"},children:[e.jsx("div",{style:{position:"absolute",top:"15%",left:"10%",width:"200px",height:"200px",background:"linear-gradient(135deg, rgba(139, 69, 19, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)",borderRadius:"50%",transform:"translateY(0)",transition:"transform 2s ease-in-out",zIndex:1}}),e.jsx("div",{style:{position:"absolute",top:"60%",left:"20%",width:"150px",height:"150px",background:"linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(79, 156, 249, 0.05) 100%)",borderRadius:"50%",transform:"translateY(-10px)",transition:"transform 1.5s ease-in-out",zIndex:1}}),e.jsx("div",{style:{position:"absolute",top:"30%",right:"15%",width:"100px",height:"100px",background:"linear-gradient(135deg, rgba(139, 69, 19, 0.08) 0%, rgba(245, 158, 11, 0.03) 100%)",borderRadius:"50%",transform:"translateY(-5px)",transition:"transform 1.8s ease-in-out",zIndex:1}}),e.jsxs("div",{style:{position:"absolute",top:"40px",left:"40px",display:"flex",alignItems:"center",gap:"12px",zIndex:10},children:[e.jsx("div",{style:{width:"32px",height:"32px",background:"linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)",borderRadius:"8px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"16px",fontWeight:"bold",color:"white"},children:"F"}),e.jsx("div",{style:{fontSize:"16px",fontWeight:"700",color:"#1F2937",letterSpacing:"-0.3px"},children:"FIAP Fintech"})]}),e.jsxs("div",{style:{textAlign:"center",zIndex:5,maxWidth:"450px",padding:"0 40px"},children:[e.jsx("h1",{style:{fontSize:"42px",fontWeight:"700",color:"#1F2937",marginBottom:"24px",lineHeight:"1.1"},children:"Hora de transformar suas finanças."}),e.jsxs("div",{style:{margin:"40px auto",width:"300px",height:"220px",position:"relative",display:"flex",alignItems:"center",justifyContent:"center"},children:[e.jsxs("div",{style:{width:"90px",height:"160px",background:"linear-gradient(135deg, #2563EB 0%, #4F9CF9 100%)",borderRadius:"45px 45px 20px 20px",position:"relative",marginRight:"30px",transform:"translateY(-8px)",transition:"transform 2s ease-in-out",zIndex:3},children:[e.jsx("div",{style:{width:"55px",height:"55px",background:"#FDE68A",borderRadius:"50%",position:"absolute",top:"-27px",left:"17px"}}),e.jsx("div",{style:{width:"70px",height:"25px",background:"linear-gradient(135deg, #2563EB 0%, #4F9CF9 100%)",borderRadius:"12px",position:"absolute",right:"-60px",top:"45px",transform:"rotate(-15deg)",zIndex:2}})]}),e.jsxs("div",{style:{width:"140px",height:"90px",background:"linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)",borderRadius:"16px",position:"relative",boxShadow:"0 8px 32px rgba(0, 0, 0, 0.12)",border:"1px solid #E2E8F0",transform:"translateY(-12px)",transition:"transform 1.8s ease-in-out"},children:[e.jsx("div",{style:{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)",fontSize:"36px",fontWeight:"bold",color:"#2563EB"},children:"$"}),e.jsx("div",{style:{position:"absolute",top:"12px",left:"12px",width:"20px",height:"3px",background:"#CBD5E1",borderRadius:"2px"}}),e.jsx("div",{style:{position:"absolute",top:"20px",left:"12px",width:"30px",height:"3px",background:"#CBD5E1",borderRadius:"2px"}})]}),e.jsx("div",{style:{position:"absolute",bottom:"20px",left:"40px",width:"25px",height:"25px",background:"rgba(37, 99, 235, 0.2)",borderRadius:"50%",transform:"translateY(-6px)",transition:"transform 2.2s ease-in-out"}}),e.jsx("div",{style:{position:"absolute",bottom:"40px",right:"50px",width:"15px",height:"15px",background:"rgba(251, 191, 36, 0.3)",borderRadius:"50%",transform:"translateY(-4px)",transition:"transform 1.5s ease-in-out"}}),e.jsx("div",{style:{position:"absolute",top:"20px",right:"30px",width:"12px",height:"12px",background:"rgba(37, 99, 235, 0.15)",borderRadius:"50%",transform:"translateY(-3px)",transition:"transform 2.5s ease-in-out"}})]}),e.jsx("p",{style:{fontSize:"18px",color:"#6B7280",lineHeight:"1.6",marginBottom:"0"},children:"O caminho está à sua frente. Você já deu seu primeiro passo rumo à transformação financeira e nós te guiaremos nessa jornada."})]})]}),e.jsx("div",{style:{flex:"1",background:"#ffffff",display:"flex",alignItems:"center",justifyContent:"center",padding:"40px",minHeight:"100vh"},children:e.jsxs("div",{style:{width:"100%",maxWidth:"420px"},children:[e.jsxs("div",{style:{display:"flex",marginBottom:"40px",borderBottom:"1px solid #E5E7EB"},children:[e.jsx("button",{type:"button",onClick:()=>o("login"),style:{flex:1,padding:"16px 24px",background:"none",border:"none",borderBottom:i==="login"?"2px solid #2563EB":"2px solid transparent",color:i==="login"?"#2563EB":"#9CA3AF",fontSize:"16px",fontWeight:"600",cursor:"pointer",transition:"all 0.3s ease",marginBottom:"-1px"},children:"ENTRAR"}),e.jsx("button",{type:"button",onClick:()=>o("cadastro"),style:{flex:1,padding:"16px 24px",background:"none",border:"none",borderBottom:i==="cadastro"?"2px solid #2563EB":"2px solid transparent",color:i==="cadastro"?"#2563EB":"#9CA3AF",fontSize:"16px",fontWeight:"600",cursor:"pointer",transition:"all 0.3s ease",marginBottom:"-1px"},children:"CADASTRAR"})]}),i==="login"&&e.jsxs("form",{onSubmit:R,children:[e.jsx("div",{style:{marginBottom:"24px"},children:e.jsx("input",{type:"email",name:"email",value:t.email,onChange:g,placeholder:"Seu email",required:!0,style:{width:"100%",padding:"16px",background:"#ffffff",border:"none",borderBottom:"1px solid #E5E7EB",borderRadius:"0",color:"#1F2937",fontSize:"16px",outline:"none",transition:"border-color 0.2s",boxSizing:"border-box"},onFocus:r=>r.target.style.borderBottomColor="#2563EB",onBlur:r=>r.target.style.borderBottomColor="#E5E7EB"})}),e.jsxs("div",{style:{marginBottom:"24px",position:"relative"},children:[e.jsx("input",{type:l?"text":"password",name:"senha",value:t.senha,onChange:g,placeholder:"Senha",required:!0,style:{width:"100%",padding:"16px 50px 16px 16px",background:"#ffffff",border:"none",borderBottom:"1px solid #E5E7EB",borderRadius:"0",color:"#1F2937",fontSize:"16px",outline:"none",transition:"border-color 0.2s",boxSizing:"border-box"},onFocus:r=>r.target.style.borderBottomColor="#2563EB",onBlur:r=>r.target.style.borderBottomColor="#E5E7EB"}),e.jsx("button",{type:"button",onClick:()=>B(!l),style:{position:"absolute",right:"16px",top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#6B7280",fontSize:"16px",cursor:"pointer",padding:"4px"},children:l?"🙈":"👁️"})]}),e.jsx("button",{type:"submit",disabled:n,style:{width:"100%",padding:"16px",background:n?"#9CA3AF":"linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",color:"white",border:"none",borderRadius:"8px",fontSize:"16px",fontWeight:"600",cursor:n?"not-allowed":"pointer",marginBottom:"24px",transition:"all 0.2s",boxShadow:"0 4px 12px rgba(37, 99, 235, 0.3)"},children:n?"Entrando...":"ENTRAR"})]}),i==="cadastro"&&e.jsxs("form",{onSubmit:z,children:[e.jsx("div",{style:{marginBottom:"20px"},children:e.jsx("input",{type:"text",name:"nomeCompleto",value:t.nomeCompleto,onChange:g,placeholder:"Nome completo",required:!0,style:{width:"100%",padding:"16px",background:"#ffffff",border:"none",borderBottom:"1px solid #E5E7EB",borderRadius:"0",color:"#1F2937",fontSize:"16px",outline:"none",transition:"border-color 0.2s",boxSizing:"border-box"},onFocus:r=>r.target.style.borderBottomColor="#2563EB",onBlur:r=>r.target.style.borderBottomColor="#E5E7EB"})}),e.jsx("div",{style:{marginBottom:"20px"},children:e.jsx("input",{type:"email",name:"email",value:t.email,onChange:g,placeholder:"Email",required:!0,style:{width:"100%",padding:"16px",background:"#ffffff",border:"none",borderBottom:"1px solid #E5E7EB",borderRadius:"0",color:"#1F2937",fontSize:"16px",outline:"none",transition:"border-color 0.2s",boxSizing:"border-box"},onFocus:r=>r.target.style.borderBottomColor="#2563EB",onBlur:r=>r.target.style.borderBottomColor="#E5E7EB"})}),e.jsxs("div",{style:{display:"flex",gap:"12px",marginBottom:"20px"},children:[e.jsx("input",{type:"date",name:"dataNascimento",value:t.dataNascimento,onChange:g,required:!0,style:{flex:1,padding:"16px",background:"#ffffff",border:"none",borderBottom:"1px solid #E5E7EB",borderRadius:"0",color:"#1F2937",fontSize:"16px",outline:"none",transition:"border-color 0.2s",boxSizing:"border-box"},onFocus:r=>r.target.style.borderBottomColor="#2563EB",onBlur:r=>r.target.style.borderBottomColor="#E5E7EB"}),e.jsxs("select",{name:"genero",value:t.genero,onChange:g,required:!0,style:{flex:1,padding:"16px",background:"#ffffff",border:"none",borderBottom:"1px solid #E5E7EB",borderRadius:"0",color:"#1F2937",fontSize:"16px",outline:"none",transition:"border-color 0.2s",boxSizing:"border-box"},onFocus:r=>r.target.style.borderBottomColor="#2563EB",onBlur:r=>r.target.style.borderBottomColor="#E5E7EB",children:[e.jsx("option",{value:"MASCULINO",children:"Masculino"}),e.jsx("option",{value:"FEMININO",children:"Feminino"}),e.jsx("option",{value:"OUTRO",children:"Outro"})]})]}),e.jsxs("div",{style:{marginBottom:"24px",position:"relative"},children:[e.jsx("input",{type:l?"text":"password",name:"senha",value:t.senha,onChange:g,placeholder:"Senha",required:!0,style:{width:"100%",padding:"16px 50px 16px 16px",background:"#ffffff",border:"none",borderBottom:"1px solid #E5E7EB",borderRadius:"0",color:"#1F2937",fontSize:"16px",outline:"none",transition:"border-color 0.2s",boxSizing:"border-box"},onFocus:r=>r.target.style.borderBottomColor="#2563EB",onBlur:r=>r.target.style.borderBottomColor="#E5E7EB"}),e.jsx("button",{type:"button",onClick:()=>B(!l),style:{position:"absolute",right:"16px",top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#6B7280",fontSize:"16px",cursor:"pointer",padding:"4px"},children:l?"🙈":"👁️"})]}),e.jsx("button",{type:"submit",disabled:n,style:{width:"100%",padding:"16px",background:n?"#9CA3AF":"linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",color:"white",border:"none",borderRadius:"8px",fontSize:"16px",fontWeight:"600",cursor:n?"not-allowed":"pointer",marginBottom:"24px",transition:"all 0.2s",boxShadow:"0 4px 12px rgba(37, 99, 235, 0.3)"},children:n?"Criando conta...":"CADASTRAR"})]}),e.jsx("div",{style:{textAlign:"center",marginTop:"24px"},children:e.jsx("button",{type:"button",onClick:()=>window.location.href="/home",style:{color:"#2563EB",background:"none",border:"none",fontSize:"14px",cursor:"pointer",textDecoration:"underline"},children:"← Voltar para homepage"})})]})})]})},ae=()=>e.jsx("div",{style:{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(135deg, #0B1426 0%, #1E293B 100%)",color:"#1F2937",textAlign:"center"},children:e.jsxs("div",{children:[e.jsx("h1",{style:{color:"#EF4444",marginBottom:"1rem",fontSize:"48px"},children:"❌"}),e.jsx("h2",{style:{color:"white",marginBottom:"1rem"},children:"Página não encontrada"}),e.jsx("p",{style:{marginBottom:"2rem",opacity:.8},children:"A página que você procura não existe."}),e.jsx("button",{onClick:()=>window.location.href="/home",style:{background:"#2563EB",color:"white",border:"none",padding:"12px 24px",borderRadius:"8px",cursor:"pointer",fontSize:"16px",fontWeight:"600"},children:"🏠 Ir para Home"})]})}),u=({pageName:i})=>e.jsx("div",{style:{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#f8fafc",textAlign:"center"},children:e.jsxs("div",{children:[e.jsxs("h1",{children:["🚧 ",i]}),e.jsx("p",{children:"Esta página será extraída do main.tsx em breve..."}),e.jsx("button",{onClick:()=>window.location.href="/home",style:{background:"#2563EB",color:"white",border:"none",padding:"12px 24px",borderRadius:"8px",cursor:"pointer",fontSize:"16px",fontWeight:"600",marginTop:"16px"},children:"← Voltar para Home"})]})}),se=()=>e.jsx(O,{children:e.jsxs(W,{children:[e.jsx(x,{path:"/",element:e.jsx(P,{to:"/home",replace:!0})}),e.jsx(x,{path:"/home",element:e.jsx(re,{})}),e.jsx(x,{path:"/login",element:e.jsx(ie,{})}),e.jsx(x,{path:"/dashboard",element:e.jsx(u,{pageName:"Dashboard"})}),e.jsx(x,{path:"/transacoes",element:e.jsx(u,{pageName:"Transações"})}),e.jsx(x,{path:"/investimentos",element:e.jsx(u,{pageName:"Investimentos"})}),e.jsx(x,{path:"/metas",element:e.jsx(u,{pageName:"Metas"})}),e.jsx(x,{path:"/cadastro",element:e.jsx(u,{pageName:"Cadastro"})}),e.jsx(x,{path:"*",element:e.jsx(ae,{})})]})}),le=()=>e.jsxs($,{theme:Z,children:[e.jsx(ee,{}),e.jsx("div",{style:{minHeight:"100vh"},children:e.jsx(se,{})})]}),k=document.getElementById("root");if(!k)throw new Error("Root element não encontrado!");const de=E.createRoot(k);de.render(e.jsx(D.StrictMode,{children:e.jsx(le,{})}));
//# sourceMappingURL=index-01be639a.js.map
