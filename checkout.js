import {
  catalogo,
  desenharProdutoCarrinhoSimples,
  lerLocalStorage,
  apagarDoLocalStorage,
  salvarLocalStorage,
} from "./src/utilidades";

function desenharProdutosCheckout() {
  const idsProdutoCarrinhoComQuantidade = lerLocalStorage("carrinho") ?? {};
  for (const idProduto in idsProdutoCarrinhoComQuantidade) {
    desenharProdutoCarrinhoSimples(
      idProduto,
      "container-produtos-checkout",
      idsProdutoCarrinhoComQuantidade[idProduto]
    );
  }
}

function finalizarCompra(evento) {
  evento.preventDefault();
  const idsProdutoCarrinhoComQuantidade = lerLocalStorage("carrinho") ?? {};
  if (Object.keys(idsProdutoCarrinhoComQuantidade).length === 0) {
    return;
  }

  const dataAtual = new Date();
  const pedidoFeito = {
    dataPedido: dataAtual,
    pedido: idsProdutoCarrinhoComQuantidade,
  };
  const historicoDePedidos = lerLocalStorage("historico") ?? [];
  const historicoDePedidosAtualizado = [pedidoFeito, ...historicoDePedidos];

  salvarLocalStorage("historico", historicoDePedidosAtualizado);
  apagarDoLocalStorage("carrinho");

  window.location.href = "./pedidos.html";
}

desenharProdutosCheckout();

document.addEventListener("submit", (evt) => finalizarCompra(evt));

function atualizarPrecoCarrinhoCheckout() {
  const precoCarrinho = document.getElementById("preco-total-checkout");
  const idsProdutoCarrinhoComQuantidade = lerLocalStorage("carrinho") ?? {};
  console.log(idsProdutoCarrinhoComQuantidade);
  let precoTotalCarrinho = 0;
  for (const idProdutoNoCarrinho in idsProdutoCarrinhoComQuantidade) {
    precoTotalCarrinho +=
      catalogo.find((p) => p.id === idProdutoNoCarrinho).preco *
      idsProdutoCarrinhoComQuantidade[idProdutoNoCarrinho];
  }
  precoCarrinho.innerText = `Total: R$:${precoTotalCarrinho}`;
}

atualizarPrecoCarrinhoCheckout();

// Função para validar um endereço de e-mail
function validarEmail(email) {
  const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return regexEmail.test(email);
}

// Função para validar um número de cartão de crédito com 16 dígitos
function validarNumeroCartao(numeroCartao) {
  // Você pode adicionar sua própria lógica de validação para números de cartão de crédito.
  // Aqui, um exemplo simples é usado para verificar se o número tem 16 dígitos.
  const regexNumeroCartao = /^\d{16}$/;
  return regexNumeroCartao.test(numeroCartao);
}

// Adicionar event listeners para os campos de e-mail, telefone e número do cartão
const emailInput = document.getElementById("email");
emailInput.addEventListener("blur", () => {
  const email = emailInput.value.trim();
  if (!validarEmail(email)) {
    alert("Por favor, insira um e-mail válido.");
    emailInput.value = ""; // Limpa o campo se estiver errado
  }
});

const telefoneInput = document.getElementById("telefone");

telefoneInput.addEventListener("input", () => {
  let telefone = telefoneInput.value.trim().replace(/\D/g, ""); // Remove caracteres não numéricos

  if (telefone.length > 11) {
    telefone = telefone.slice(0, 11); // Limita o telefone a 11 dígitos
  }

  // Formata o telefone no formato (XX) XXXX-XXXXX
  if (telefone.length >= 2) {
    telefone = `(${telefone.slice(0, 2)})${telefone.slice(2)}`;
  }
  if (telefone.length >= 7) {
    telefone = `${telefone.slice(0, 7)}-${telefone.slice(7)}`;
  }

  telefoneInput.value = telefone;
});

telefoneInput.addEventListener("keypress", (event) => {
  const key = event.key;
  if (!/[0-9]/.test(key) && key !== "Backspace") {
    event.preventDefault(); // Bloqueia a entrada de caracteres não numéricos
  }
});

const numeroCartaoInput = document.getElementById("numero-cartao");

numeroCartaoInput.addEventListener("input", () => {
  let numeroCartao = numeroCartaoInput.value.trim().replace(/\D/g, ""); // Remove caracteres não numéricos

  if (numeroCartao.length > 16) {
    numeroCartao = numeroCartao.slice(0, 16); // Limita o número a 16 dígitos (XXXX-XXXX-XXXX-XXXX)
  }

  // Insere hífens após cada grupo de 4 dígitos, se necessário
  if (numeroCartao.length >= 4) {
    numeroCartao = `${numeroCartao.slice(0, 4)} ${numeroCartao.slice(4)}`;
  }
  if (numeroCartao.length >= 9) {
    numeroCartao = `${numeroCartao.slice(0, 9)} ${numeroCartao.slice(9)}`;
  }
  if (numeroCartao.length >= 14) {
    numeroCartao = `${numeroCartao.slice(0, 14)} ${numeroCartao.slice(14)}`;
  }

  numeroCartaoInput.value = numeroCartao;
});

numeroCartaoInput.addEventListener("keypress", (event) => {
  const key = event.key;
  if (!/[0-9-]/.test(key) || numeroCartaoInput.value.length >= 19) {
    event.preventDefault(); // Bloqueia a inserção de caracteres não numéricos e limita o número a XXXX-XXXX-XXXX-XXXX
  }
});


const cvvInput = document.getElementById("cvv");

cvvInput.addEventListener("input", () => {
  let cvv = cvvInput.value.trim().replace(/\D/g, ""); // Remove caracteres não numéricos

  if (cvv.length > 3) {
    cvv = cvv.slice(0, 3); // Limita o CVV a 3 dígitos
  }

  cvvInput.value = cvv;
});

cvvInput.addEventListener("keypress", (event) => {
  const key = event.key;
  if (!/[0-9]/.test(key) || cvvInput.value.length >= 3) {
    event.preventDefault(); // Bloqueia a inserção de letras e limita o CVV a 3 dígitos
  }
});

const dataExpiracaoInput = document.getElementById("data-expiracao");

dataExpiracaoInput.addEventListener("input", () => {
  let dataExpiracao = dataExpiracaoInput.value.trim().replace(/\D/g, ""); // Remove caracteres não numéricos

  if (dataExpiracao.length > 4) {
    dataExpiracao = dataExpiracao.slice(0, 4); // Limita a data de validade a 4 dígitos (XX/XX)
  }

  // Insere a barra após os dois primeiros dígitos, se necessário
  if (dataExpiracao.length > 2) {
    dataExpiracao = `${dataExpiracao.slice(0, 2)}/${dataExpiracao.slice(2)}`;
  }

  dataExpiracaoInput.value = dataExpiracao;
});

dataExpiracaoInput.addEventListener("keypress", (event) => {
  const key = event.key;
  if (!/[0-9/]/.test(key) || dataExpiracaoInput.value.length >= 5) {
    event.preventDefault(); // Bloqueia a inserção de caracteres não numéricos e limita a data a XX/XX
  }
});

const cepInput = document.getElementById("cep");

cepInput.addEventListener("input", () => {
  let cep = cepInput.value.trim().replace(/\D/g, ""); // Remove caracteres não numéricos

  if (cep.length > 8) {
    cep = cep.slice(0, 8); // Limita o CEP a 8 dígitos (XXXXX-XXX)
  }

  // Insere o hífen após os cinco primeiros dígitos, se necessário
  if (cep.length > 5) {
    cep = `${cep.slice(0, 5)}-${cep.slice(5)}`;
  }

  cepInput.value = cep;
});

cepInput.addEventListener("keypress", (event) => {
  const key = event.key;
  if (!/[0-9-]/.test(key) || cepInput.value.length >= 9) {
    event.preventDefault(); // Bloqueia a inserção de caracteres não numéricos e limita o CEP a XXXXX-XXX
  }
});

const numeroInput = document.getElementById("numero");

numeroInput.addEventListener("input", () => {
  let numero = numeroInput.value.trim().replace(/\D/g, ""); // Remove caracteres não numéricos

  if (numero.length > 3) {
    numero = numero.slice(0, 3); // Limita o número a 3 dígitos
  }

  numeroInput.value = numero;
});

numeroInput.addEventListener("keypress", (event) => {
  const key = event.key;
  if (!/[0-9]/.test(key) || numeroInput.value.length >= 3) {
    event.preventDefault(); // Bloqueia a inserção de letras e limita o número a 3 dígitos
  }
});

