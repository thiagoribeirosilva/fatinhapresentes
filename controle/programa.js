// programa.js

// @problema: função não interpreta objetos corretamente
function registrarProblema(problema = null) {
  const mensagem = JSON.stringify({ problema })
  console.error(mensagem)
}

const CACHE = {
  pessoas: [],
  eventos: [],
  clientes: [],
  parcelas: [],
  pagamentos: [],
  saldo: 0
}

// @problema: não escreve nem lê informações do navegador
// @problema: não verifica existência de window, documento e outros
// itens exclusivos de navegador

window.addEventListener("error", function tratarProblema(evento) {
  if (typeof evento !== "object") {
    console.error({ problema: "evento do navegador inválido ou ausente" + " - " + JSON.stringify({ evento }) })
  }
  evento.preventDefault()
  const {
      message: mensagem = null,
      source = null,
      lineno = null,
      calno = null,
      error: {
        stack: pilhaDeChamada = [],
      } = {},
  } = evento
  if (typeof mensagem !== "string") {
    console.error({ problema: "mensagem de problema inválida ou ausente" + " - " + JSON.stringify({ mensagem, pilhaDeChamada }) })
  }
  console.error(JSON.stringify({ problema: mensagem, pilhaDeChamada }))
})

// @problema: função não propriamente extraida
function mostrarDialogo(opcoes) {
  const {
    mensagem = null,
    usarTelaCheia = false,
    duracao = null,
    acoes = [],
  } = opcoes ?? {}
  let {
    corpo: elementoCorpo = null
  } = opcoes ?? {}
  if (acoes !== null && elementoCorpo !== null) {
    throw "função mostrarDialogo chamada com corpo e ação; só pode ser usado um destes"
  }
  if ((acoes ?? []).length > 0) {
    throw "opção de passar ações não implementada para função mostrarDialogo"
  }
  const elementoModal = document.getElementById("modal") ?? null
  if (elementoModal === null) {
    throw "elemento modal não encontrado"
  }
  const elementoDialogo = document.getElementById("dialogo") ?? null
  if (elementoDialogo === null) {
    throw "elemento dialogo não encontrado"
  }
  if (typeof mensagem === "string" && mensagem.length !== 0) {
    const elementoMensagem = document.createElement("p")
    elementoMensagem.textContent = mensagem
    elementoDialogo.append(elementoMensagem)
  }
  const elementoBotaoFechar = document.createElement("button")
  elementoBotaoFechar.id = "fechar_dialogo"
  function fechar() {
    if (usarTelaCheia === true) {
      elementoModal.hidden = false
    }
    elementoDialogo.hidden = true
  }
  elementoBotaoFechar.addEventListener("click", acaoAoCancelar ?? function acaoAoCancelar() {
    fechar()
  })
  elementoDialogo.append(elementoBotaoFechar)
  if (elementoCorpo === null) {
    elementoCorpo = document.createElement("div")
  }
  const elementoContainerAcoes = document.createElement("div")
  elementoCorpo.append(elementoContainerAcoes)
  if (elementoCorpo.nodeType === 1) {
    elementoDialogo.append(elementoCorpo)
  }
  else {
    const elementoBotaoConfirmar = document.createElement("button")
    elementoBotaoConfirmar.classList.add("confirmar")
    elementoBotaoConfirmar.textContent = "OK"
    // @problema: botão confirmar tem ação idêntica ao botão fechar
    elementoBotaoConfirmar.addEventListener("click", fechar)
  }
  const elementoBotaoConfirmar = document.createElement("button")
  elementoBotaoConfirmar.classList.add("confirmar")
  elementoBotaoConfirmar.textConent = "OK"
  elementoBotaoConfirmar.addEventListener("click", acaoAoConfirmar ?? function acaoAoConfirmar() {
    fechar()
  })

  if (acoes.length > 0) {
    for (const acao of acoes) {
      if (acao === null) {
        throw "ação de dialogo inválida"
      }
    }
    const elementoContainerAcoes = document.createElement("div")
    elementoContainerAcoes.append(elementoBotaoConfirmar)
    elementoDialogo.append(elementoContainerAcoes)
  }

  elementoDialogo.hidden = false

}

let clienteDoSupabase = null

// const enderecoDoSupabase = window.ENDERECO_DO_SUPABASE ?? null
// const chaveDoSupabase = window.CHAVE_DO_SUPABASE ?? null
const enderecoDoSupabase = "https://tjfzpgfgawfbjudsljok.supabase.co"
const chaveDoSupabase = "sb_publishable_55cd6W3pSpDvMgNZv0xUqQ_SNjdbdnl"
if (typeof enderecoDoSupabase !== "string") {
  throw "endereço de conexão ao banco de dados inválido ou ausente"
}
if (typeof chaveDoSupabase !== "string") {
  throw "chave do banco de dados inválida ou ausente"
}

clienteDoSupabase = supabase.createClient(enderecoDoSupabase, chaveDoSupabase) ?? null
if (typeof clienteDoSupabase !== 'object') {
  throw "cliente do banco não criado"
}  
  
async function autenticarComSenha() {

  const email = "thribsilva@gmail.com"
  let senha = null
  const campoSenha = document.getElementById("senha") ?? null
  if (campoSenha === null) {
    throw "campo de senha não encontrado"
  }
  senha = campoSenha.value

  const {
    data: resposta = null,
    error: problema = null
  } = await clienteDoSupabase.auth.signInWithPassword({
    email,
    password: senha
  })

  if (resposta === null) {
    throw "falha ao autenticar no Supabase"
  }
  if (problema !== null) {
    throw problema
  }

}

async function mostrarDialogoAutenticacao() {
  const elementoFormularioAutenticacao = document.createElement("form")
  const elementoCampoSenha = document.createElement("div")
  const elementoEtiquetaSenha = document.createElement("label")
  elementoEtiquetaSenha.htmlFor = "senha"
  elementoEtiquetaSenha.textContent = "SENHA"
  const elementoCampoDeTextoSenha = document.createElement("input")
  elementoCampoDeTextoSenha.id = "senha"
  elementoCampoDeTextoSenha.type = "text"
  elementoCampoDeTextoSenha.inputmode = "go"
  elementoCampoDeTextoSenha.placeholder = "DIGITE A SENHA"
  elementoCampoSenha.append(
    elementoEtiquetaSenha,
    elementoCampoDeTextoSenha,
  )
  const elementoBotaoAutenticarComSenha = document.createElement("button")
  elementoBotaoAutenticarComSenha.type = "submit"
  elementoFormularioAutenticacao.addEventListener("submit", async function tratarAutenticacao(evento = null) {
    if (evento === null) {
      return
    }
    evento.preventDefault()
    await autenticarComSenha()
    .catch(function tratarProblema(problema = null) {
      throw "falha ao autenticar"
    })
    const elementoModal = document.getElementById("modal") ?? null
    if (elementoModal === null) {
      throw "elemento modal não encontrado"
    }
    elementoModal.hidden = false
    const elementoDialogo = document.getElementById("dialogo") ?? null
    if (elementoDialogo === null) {
      throw "elemento dialogo não encontrado"
    }
    elementoDialogo.hidden = false
    const elementoBotaoFechar = document.createElement("button")
    elementoBotaoFechar.id = "fechar_dialogo"
    elementoBotaoFechar.addEventListener("click", function fechar(evento) {
    })
    elementoDialgo.append(elementoBotaoFechar)
    mostrarDialogo({
      mensagem: "usuário autorizado",
      usarTelaCheia: false,
      duracao: 4000,
    })
  })

  elementoFormularioAutenticacao.append(
    elementoCampoSenha,
    elementoBotaoAutenticarComSenha,
  )
  mostrarDialogo({
    mensagem: "digite a senha",
    usarTelaCheia: true,
    corpo: elementoFormularioAutenticacao,
  })
    
}

function criarPessoa(argumentos) {
  const {
    identificador = null,
    nome_completo: nomeCompleto = null,
    primeiro_nome: primeiroNome = null,
    sobrenomes: textoComSobrenomes = null,
    apelido = null,
    numero_de_telefone: numeroDeTelefone = null,
    tipo = null,
    observacoes = null,
    extra = null,
    data_de_criacao: dataDeCriacao = null,
    data_de_atualizacao: dataDeAtualizacao = null,
  } = argumentos
  const sobrenomes = []
  if (typeof textoComSobrenomes === "string") {
    sobrenomes.push(...textoComSobrenomes.split(";"))
  }
  return Object.assign(
    Object.create({
      adicionarParcela: async function adicionarParcela() {
        if ((this?.tipo ?? null) !== "cliente") {
          return
        }
        const identificadorDaParcela = crypto.randomUUID()
        const {
          error: problemaAoAdicionarParcela = null,
        } = (await clienteDoSupabase
        .from("eventos")
        .insert({
          identificador: identificadorDaParcela,
          tipo: "parcela",
          extra: {
            identificador_do_cliente: this.identificador,
            valor: 0,
            estado: "aberta",
          },
        })) ?? {}
        if (problemaAoAdicionarParcela !== null) {
          throw problemaAoAdicionarParcela
        }
      },
    }),
    {
      identificador,
      nomeCompleto,
      primeiroNome,
      sobrenomes,
      apelido: apelido ?? primeiroNome,
      numeroDeTelefone,
      tipo,
      observacoes,
      extra,
      dataDeCriacao,
      dataDeAtualizacao,
    }
  )
}

async function obterPessoas() {
  const {
    data: resposta = null,
    error: problema = null
  } = await clienteDoSupabase
  .from("pessoas")
  .select("*")
  .order("apelido") ?? {}
  if (problema !== null) {
    throw problema
  }
  if (Array.isArray(resposta) !== true) {
    throw "conjunto de pessoas inválido ou ausente" + " - " + JSON.stringify({ pessoas: resposta })
  }
  for (const item of resposta) {
    if (typeof item !== "object") {
      throw "pessoa inválida ou ausente" + " - " + JSON.stringify({ pessoa: item })
    }
    const {
      identificador = null,
      nome_completo: nomeCompleto = null,
      primeiro_nome: primeiroNome = null,
      sobrenomes: textoComSobrenomes = null,
      apelido = null,
      numero_de_telefone: numeroDeTelefone = null,
      tipo = null,
      observacoes = null,
      extra = null,
      data_de_criacao: dataDeCriacao = null,
      data_de_atualizacao: dataDeAtualizacao = null,
    } = item
    const sobrenomes = []
    if (typeof textoComSobrenomes === "string") {
      sobrenomes.push(...textoComSobrenomes.split(";"))
    }
    const pessoa = criarPessoa({
      identificador,
      nomeCompleto,
      primeiroNome,sobrenomes,
      apelido: apelido ?? primeiroNome,
      numeroDeTelefone,
      tipo,
      observacoes,
      extra,
      dataDeCriacao,
      dataDeAtualizacao,
    })
    const pessoaJaEmCache = CACHE.pessoas.find(function obterPessoa(item) {
      let valor = false
      if (typeof item !== "object") {
        return valor
      }
      if (item.identificador === identificador && item.dataDeAtualizacao === dataDeAtualizacao) {
        valor = true
      }
      return valor
    }) ?? null
    if (pessoaJaEmCache !== null) {
      CACHE.pessoas.push(pessoa)
    }
  }
}

async function obterEventos() {
  const {
    data: resposta = null,
    error: problema = null
  } = await clienteDoSupabase
  .from("eventos")
  .select("*") ?? {}
  if (problema !== null) {
    throw problema
  }
  if (Array.isArray(resposta) !== true) {
    throw "conjunto de eventos inválido ou ausente" + " - " + JSON.stringify({ eventos: resposta })
  }
  for (const item of resposta) {
    if (typeof item !== "object") {
      throw "evento inválido ou ausente" + " - " + JSON.stringify({ evento: item })
    }
    const {
      identificador = null,
      tipo = null,
      data_de_criacao: dataDeCriacao = null,
      data_de_atualizacao: dataDeAtualizacao = null,
    } = item
    let extra = item?.extra ?? {}
    if (tipo === "parcela") {
      const {
        identificador_do_cliente: identificadorDoCliente = null,
        valor = null,
        estado = null,
      } = extra
      if (typeof identificadorDoCliente !== "string") {
        throw "identificador do cliente inválido ou ausente" + " - " + JSON.stringify({ parcela })
      }
      if (typeof valor !== "number") {
        throw "valor da parcala inválido ou ausente" + " - " + JSON.stringify({ parcela })
      }
      if (typeof estado !== "string") {
        throw "estado da parcela inválido ou ausente" + " - " + JSON.stringify({ parcela })
      }
      extra = {
        identificadorDoCliente,
        valor,
        estado,
      }
    }
    const evento = Object.assign(
      Object.create({}), {
        identificador,
        tipo,
        ...extra,
        dataDeCriacao,
        dataDeAtualizacao,
      },
    )
    if (CACHE.eventos.includes(evento) === true) {
      continue
    }
    CACHE.eventos.push(evento)
  }
}

function adicionarClienteVazio() {
  const identificador = crypto.randomUUID() ?? ""
  const clienteVazio = criarPessoa({
    identificador,
    tipo: "cliente",
    apelido: "",
    numeroDeTelefone: "",
    observacoes: "",
  })
  CACHE.pessoas.push(clienteVazio)
}

async function renderizarConteinerClientes() {
  // @problema: não indica estado de carregamento enquanto comunica com o banco
  // @problema: renderiza todos elementos. Devemos comparar e renderizar somente onde informações mudaram
  const elementoDoConteinerClientes = document.querySelector("body div.clientes") ?? null
  if (typeof elementoDoConteinerClientes !== "object") {
    throw "elemento do conteiner de clientes não encontrado"
  }
  await obterPessoas()
  await obterEventos()
  elementoDoConteinerClientes.replaceChildren("")

  for (const pessoa of (CACHE?.pessoas ?? [])) {
    if (typeof pessoa !== "object") {
      continue
    }
    if (pessoa.tipo !== "cliente") {
      continue
    }
    pessoa.eventos = CACHE.eventos.filter(function obterEventosDoCliente(evento) {
      let valor = false
      if (typeof evento !== "object") {
        return valor
      }
      if (evento.identificadorDaPessoa === pessoa.identificador) {
        valor = true
      }
      return valor
    })
    const {
      identificador: identificadorDoCliente = null,
      apelido = null,
      telefone = null,
      eventos = [],
    } = pessoa ?? {}
    const identificadorParcelaUnica = crypto.randomUUID()
    const eventoParcelaUnica = {
      "identificador": identificadorParcelaUnica,
      identificadorDoCliente,
      "tipo": "parcela",
      "valor": 0,
      "estado": "aberta",
    }
    if (eventos.length === 0) {
      eventos.push(eventoParcelaUnica)
    }
    const parcelas = eventos.filter(function obterParcelas(evento) {
      let valor = false
      if (typeof evento !== "object") {
        return valor
      }
      if (evento.tipo === "parcela") {
        valor = true
      }
      return valor
    })
    const valorTotal = parcelas.reduce(function (valorAcumulado, item) {
      let valor = null
      if (typeof item !== "object") {
        throw "parcela inválida" + " - " + JSON.stringify({ parcela: item })
      }
      const valorDaParcela = Number(item.valor ?? null) ?? null
      if (typeof valorDaParcela !== "number") {
        throw "valor de parcela inválido" + " - " + JSON.stringify({ parcela: item })
      }
      valor = valorAcumulado + valorDaParcela
      return valor
    }, 0)
    if (typeof valorTotal !== "number") {
      throw "valor devido inválido" + " - " + JSON.stringify({ valor: valorTotal })
    }

    const elementoDoConteinerCliente = document.createElement("div")
    elementoDoConteinerCliente.classList.add("cliente")
    
    const elementoDoConteinerApelido = document.createElement("div")
    elementoDoConteinerApelido.classList.add("campo", "apelido")
    const elementoDaEtiquetaApelido = document.createElement("label")
    const identificadorDoCampoApelido = "campo_apelido_" + identificadorDoCliente
    elementoDaEtiquetaApelido.htmlFor = identificadorDoCampoApelido
    elementoDaEtiquetaApelido.textContent = "APELIDO"
    const elementoDoCampoDeTextoApelido = document.createElement("input")
    elementoDoCampoDeTextoApelido.id = identificadorDoCampoApelido
    if (apelido !== null) {
      elementoDoCampoDeTextoApelido.value = apelido
    }

    const elementoDoConteinerTelefone = document.createElement("div")
    elementoDoConteinerTelefone.classList.add("campo", "telefone")
    const elementoDaEtiquetaTelefone = document.createElement("label")
    const identificadorDoCampoTelefone = "campo_telefone_" + identificadorDoCliente
    elementoDaEtiquetaTelefone.htmlFor = identificadorDoCampoTelefone
    elementoDaEtiquetaTelefone.textContent = "TELEFONE"
    const elementoDoCampoDeTextoTelefone = document.createElement("input")
    elementoDoCampoDeTextoTelefone.id = identificadorDoCampoTelefone
    if (telefone !== null) {
      elementoDoCampoDeTextoTelefone.value = telefone
    }

    const elementoDoConteinerTotal = document.createElement("div")
    elementoDoConteinerTotal.classList.add("campo", "total")
    const elementoDaEtiquetaTotal = document.createElement("label")
    const identificadorDoCampoTotal = "campo_total_" + identificadorDoCliente
    elementoDaEtiquetaTotal.htmlFor = identificadorDoCampoTotal
    elementoDaEtiquetaTotal.textContent = "TOTAL"
    const elementoDoCampoDeTextoTotal = document.createElement("input")
    elementoDoCampoDeTextoTotal.id = identificadorDoCampoTotal
    elementoDoCampoDeTextoTotal.value = valorTotal

    const elementoDoConteinerParcelas = document.createElement("div")
    elementoDoConteinerParcelas.classList.add("campo", "parcelas")
    const elementoDaEtiquetaParcelas = document.createElement("label")
    elementoDaEtiquetaParcelas.textContent = "PARCELAS"
    const elementoDoConteinerCamposDeTextoParcelas = document.createElement("div")

    for (const parcela of parcelas) {
      if (typeof parcela !== "object") {
        continue
      }
      const {
        identificador: identificadorDaParcela = null,
        valor: valorDaParcela = null,
        estado: estadoDaParcela = null,
      } = parcela
      if (typeof identificadorDaParcela !== "string") {
        throw "parcela com identificador inválido ou ausente" + " - " + JSON.stringify({ parcela })
      }
      if (typeof valorDaParcela !== "number") {
        throw "parcela com valor inválido ou ausente" + " - " + JSON.stringify({ parcela })
      }
      if (typeof estadoDaParcela !== "string") {
        throw "parcela com estado inválido ou ausente" + " - " + JSON.stringify({ parcela })
      }
      const elementoDoCampoDeTextoParcela = document.createElement("input")
      const identificadorDoCampoParcela = "campo_parcela_" + identificadorDaParcela
      elementoDoCampoDeTextoParcela.id = identificadorDoCampoParcela

      const elementoDoBotaoPago = document.createElement("button")
      elementoDoBotaoPago.id = "botao_marcar_parcela_como_paga_" + identificadorDaParcela
      elementoDoBotaoPago.textContent = "PAGO"
      if (estadoDaParcela === "pago") {
        elementoDoBotaoPago.textContent = "REABRIR"
      }
      if (estadoDaParcela === "paga" || valorDaParcela <= 0) {
        elementoDoBotaoPago.disabled = true
      }
      elementoDoBotaoPago.addEventListener("click", async function tratarBotaoPago(evento) {
        if (estadoDaParcela === "pago") {
          return
        }
        if (typeof evento !== "object") {
          return
        }
        const {
          target: {
            id: identificadorDoElemento = null
          } = {}
        } = evento
        if (typeof identificadorDoElemento !== "string") {
          throw "identificador do elemento html inválido ou ausente" + " - " + JSON.stringify({ identificador: identificadorDoElemento })
        }
        const expressaoRegular = /botao_marcar_parcela_como_paga_(?<identificadorDaParcela>[^"\"]*)"/
        const {
          groups: {
            identificadorDaParcela = null
          } = {}
        } = expressaoRegular.exec(identificadorDoElemento) ?? {}
        if (identificadorDaParcela !== "string") {
          throw "identificador da parcela inválido ou ausente" + " - " + JSON.stringify({ identificador: identificadorDaParcela })
        }
        const parcela = parcelas.find(function obterParcela(item) {
          let valor = false
          if (typeof item !== "object") {
            return valor;
          }
          if (item.identificador === identificadorDaParcela) {
            valor = true
          }
          return valor;
        })
        if (typeof parcela !== "object") {
          throw "parcela não encontrada" + " - " + JSON.stringify({ identificadorDaParcela })
        }
        await parcela.marcarComoPaga()
        .catch(function tratarProblema(problema) {
          throw problema
        })
      })

      const elementoDoBotaoParcelar = document.createElement("button")
      elementoDoBotaoParcelar.id = "botao_adicionar_parcela_" + identificadorDaParcela
      elementoDoBotaoParcelar.textContent = "PARCELAR"
      // @problema: lógica de última parcela não utilizada
      let ultimaParcela = null
      let numeroDeParcelas = parcelas[parcelas.length]
      if (numeroDeParcelas > 0) {
        ultimaParcela = parcelas[numeroDeParcelas - 1]
      }
      elementoDoBotaoParcelar.addEventListener("click", async function tratarBotaoParcelar(evento) {
        if (typeof evento !== "object") {
          return
        }
        const {
          target: {
            id: identificadorDoElemento = null
          } = {}
        } = evento
        if (typeof identificadorDoElemento !== "string") {
          throw "identificador do elemento html inválido ou ausente" + " - " + JSON.stringify({ identificador: identificadorDoElemento })
        }
        const expressaoRegular = /botao_adicionar_parcela_(?<identificador_da_parcela>[a-z0-9\-]+)/
        const {
          groups: {
            identificador_da_parcela: identificadorDaParcela = null
          } = {}
        } = expressaoRegular.exec(identificadorDoElemento) ?? {}
        if (typeof identificadorDaParcela !== "string") {
          throw "identificador da parcela inválido ou ausente" + " - " + JSON.stringify({ identificador: identificadorDaParcela })
        }
        const parcela = parcelas.find(function obterParcela(item) {
          let valor = false
          if (typeof item !== "object") {
            return valor;
          }
          if (item.identificador === identificadorDaParcela) {
            valor = true
          }
          return valor;
        })
        if (typeof parcela !== "object") {
          throw "parcela não encontrada" + " - " + JSON.stringify({ identificadorDaParcela })
        }
        const { identificadorDoCliente = null } = parcela
        if (typeof identificadorDoCliente !== "string") {
          throw "identificador do cliente inválido ou ausente" + " - " + JSON.stringify({ parcela })
        }
        const cliente = CACHE.pessoas.find(function obterCliente(item) {
          let valor = false
          if (typeof item !== "object") {
            return valor;
          }
          if (item.identificador === identificadorDoCliente) {
            valor = true
          }
          return valor;
        })
        if (typeof cliente !== "object") {
          throw "cliente não encontrado" + " " + JSON.stringify({ identificadorDoCliente })
        }
        await cliente.adicionarParcela()
        .catch(function tratarPoblema(problema) {
          throw problema
        })
      })
      elementoDoConteinerCamposDeTextoParcelas.append(
        elementoDoCampoDeTextoParcela,
        elementoDoBotaoParcelar,
        elementoDoBotaoPago,
      )
    }
    elementoDoConteinerParcelas.append(
      elementoDaEtiquetaParcelas,
      elementoDoConteinerCamposDeTextoParcelas,
    )

    const elementoDoConteinerObservacoes = document.createElement("div")
    elementoDoConteinerObservacoes.classList.add("campo", "observacoes")
    const elementoDaEtiquetaObservacoes = document.createElement("label")
    const identificadorDoCampoObservacoes = "campo_observacoes_" + identificadorDoCliente
    elementoDaEtiquetaObservacoes.htmlFor = identificadorDoCampoObservacoes
    elementoDaEtiquetaObservacoes.textContent = "OBSERVAÇÕES"
    const elementoDoCampoDeTextoObservacoes = document.createElement("input")
    elementoDoCampoDeTextoObservacoes.id = identificadorDoCampoObservacoes

    elementoDoConteinerApelido.append(
      elementoDaEtiquetaApelido,
      elementoDoCampoDeTextoApelido,
    )
    elementoDoConteinerTelefone.append(
      elementoDaEtiquetaTelefone,
      elementoDoCampoDeTextoTelefone,
    )
    elementoDoConteinerTotal.append(
      elementoDaEtiquetaTotal,
      elementoDoCampoDeTextoTotal,
    )
    elementoDoConteinerObservacoes.append(
      elementoDaEtiquetaObservacoes,
      elementoDoCampoDeTextoObservacoes,
    )
    elementoDoConteinerCliente.append(
      elementoDoConteinerApelido,
      elementoDoConteinerTelefone,
      elementoDoConteinerTotal,
      elementoDoConteinerParcelas,
      elementoDoConteinerObservacoes,
    )
    elementoDoConteinerClientes.append(elementoDoConteinerCliente)
  }
}

async function inicializar() {
  // await autenticarNoBancoDeDados()
  // await mostrarDialogoAutenticacao()
  // mostra diálogo pedindo senha
  let autorizado = false
  autorizado = await new Promise(function tratarAutenticacao(resolver) {
    const elementoPelicula = document.getElementById("pelicula") ?? null
    if (elementoPelicula?.nodeType !== 1) {
      throw "elemento da película cobertora não encontrado"
    }
    elementoPelicula.hidden = false

    const elementoDialogo = document.getElementById("dialogo")
    if (elementoDialogo?.nodeType !== 1) {
      throw "elemento da caixa de diálogo não encontrado"
    }
    elementoDialogo.classList.add("centralizado")
    elementoDialogo.hidden = false

    const elementoFormularioAutenticacao = document.createElement("form")
    elementoFormularioAutenticacao.id = "autenticacao"
    elementoFormularioAutenticacao.addEventListener("submit", async function autenticar(evento = null) {
      if (evento === null) {
        return
      }
      evento.preventDefault()
      const email = "thribsilva@gmail.com"
      const elementoCampoSenha = document.getElementById("campo_senha")
      const senha = elementoCampoSenha?.value ?? null
      if (senha === null || senha.length < 1) {
        throw "senha vazia"
      }
      const {
        data: resposta = null,
        error: problema = null
      } = await clienteDoSupabase.auth.signInWithPassword({
        email,
        password: senha
      })

      if (resposta === null) {
        throw "falha ao autenticar no Supabase"
      }
      if (problema !== null) {
        throw problema
      }

      elementoPelicula.hidden = true
      elementoDialogo.hidden = true
      elementoDialogo.replaceChildren("")
      resolver(true)
      elementoCampoSenha.value = ""
      return
      resolver(false)
    })
    elementoDialogo.append(elementoFormularioAutenticacao)

    const idCampoSenha = "campo_senha"
    const elementoCampoSenha = document.createElement("div")
    elementoCampoSenha.classList.add("campo", "senha")
    elementoCampoSenha.type = "password"
    elementoFormularioAutenticacao.append(elementoCampoSenha)
    const elementoEtiquetaCampoSenha = document.createElement("label")
    elementoEtiquetaCampoSenha.htmlFor = idCampoSenha
    elementoEtiquetaCampoSenha.textContent = "SENHA"
    elementoCampoSenha.append(elementoEtiquetaCampoSenha)
    const elementoCampoDeTextoSenha = document.createElement("input")
    elementoCampoDeTextoSenha.id = idCampoSenha
    elementoCampoDeTextoSenha.setAttribute("type", "text")
    elementoCampoSenha.append(elementoCampoDeTextoSenha)
    // etiqueta
    const elementoCaixaMostrarSenha = document.createElement("input")
    elementoCaixaMostrarSenha.type = "checkbox"
    elementoCaixaMostrarSenha.selected = false
    elementoCaixaMostrarSenha.addEventListener("onchange", function alternarVisibilidadeSenha(evento = null) {
      if (evento === null) {
        return
      }
      let tipoDoCampo = "password"
      const opcao = evento?.target?.checked ?? false
      if (opcao === true) {
        tipoDoCampo = "text"
      }
      const elementoCampoSenha = document.getElementById("campo_senha") ?? null
      if (elementoCampoSenha?.nodeType !== 1) {
        throw "elemento do campo senha não encontrado"
      }
      elementoCampoSenha.type = tipoDoCampo
    })
    elementoCampoSenha.append(elementoCaixaMostrarSenha)

    const elementoBotaoConfirmar = document.createElement("button")
    elementoBotaoConfirmar.type = "submit"
    elementoBotaoConfirmar.textContent = "CONFIRMAR"
    elementoCampoSenha.append(elementoBotaoConfirmar)

    const elementoBotaoFechar = document.createElement("button")
    elementoBotaoFechar.id = "fechar_dialogo"
    elementoBotaoFechar.addEventListener("click", function fecharDialogo(evento = null) {
      if (evento === null) {
        return
      }
    })
    elementoFormularioAutenticacao.append(elementoBotaoFechar)
    elementoCampoDeTextoSenha.focus()
  })
  if (autorizado !== true) {
    throw "falha ao autenticar"
  }
  // se senha certa continua
  adicionarClienteVazio()
  await renderizarConteinerClientes()

  const elementoDoBotaoCriarRegistro = document.getElementById("criar_registro")
  elementoDoBotaoCriarRegistro.addEventListener("click", async function tratarBotaoCriarRegistro(evento) {
    if (typeof evento !== "object") {
      throw "evento do navegador inválido ou ausente" + " - " + JSON.stringify({ evento })
    }
   adicionarClienteVazio()
   await renderizarConteinerClientes()
  })
}

await inicializar()

